import { useState, useEffect, useRef } from "react";
import Fader from "./Fader";
import { dBToPercent, transpose } from "~/utils/scale";
import { Destination, Volume, Draw, Loop, Transport as t } from "tone";

type Props = {
  channel: Channel;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  isMuted: boolean;
  playbackState: string;
  playState: string;
  index: number;
};

function TrackFader({
  channel,
  currentTrack,
  currentTracks,
  isMuted,
  playbackState,
  playState,
  index,
}: Props) {
  const volumesString = localStorage.getItem("volumes");
  const volumes = volumesString && JSON.parse(volumesString);
  const [volume, setVolume] = useState(() => {
    return volumes ?? currentTracks.map((currentTrack) => currentTrack.volume);
  });
  const loop = useRef<Loop | null>(null);

  console.log("playstate", playState);
  console.log("volume", volume);

  useEffect(() => {
    /////////////////////
    // START RECORDING //
    /////////////////////

    function startRecording(index: number) {
      console.log("currentTracks[index]", currentTracks[index]);
      if (currentTracks[index].playbackState !== "record") return;
      console.log("Recording!!!");
      console.log("index", index);
      let data: {
        time: string;
        0: number;
        1: number;
        2: number;
        3: number;
      }[] = [];

      loop.current = new Loop(() => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);

        const ubu = Object.assign({}, currentTracks);

        // data.push({
        //   time: t.seconds.toFixed(1),
        //   ...ubu,
        // });

        data = [{ time: t.seconds.toFixed(1), ...ubu }, ...data];

        // console.log("data", data);
        // console.log("index", index);
        // console.log("data[index][0]", data[index][0]);
        // console.log("currentTrack.index", currentTrack.index);

        localStorage.setItem(
          "realTimeMix",
          JSON.stringify({
            mix: [data][0],
          })
        );

        // fetcher.submit(
        //   {
        //     actionName: "saveRealTimeMix",
        //     realTimeMix: JSON.stringify({
        //       ...realTimeMix,
        //       mix: data,
        //     }),
        //   },
        //   { method: "post", action: "/saveMix", replace: true }
        // );
      }, 0.1).start();
    }

    if (playState === "started") {
      const indices = currentTracks.reduce(
        (r: [], v: TrackSettings, i: any) => {
          console.log("v.playbackState", v.playbackState);
          return r.concat(v.playbackState === "record" ? i : []);
        },
        []
      );
      console.log("indices", indices);
      if (currentTrack.playbackState === "record") {
        indices.forEach((index: number) => startRecording(index));
      }
    }
  }, [playState, currentTrack, currentTracks]);

  /////////////////////
  // START PLAYBACK //
  /////////////////////

  useEffect(() => {
    if (currentTrack.playbackState !== "playback") return;
    const rtmString = localStorage.getItem("realTimeMix");
    const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

    realTimeMix.mix?.map((mix) => {
      return t.schedule((time) => {
        Draw.schedule(() => {
          channel.volume.value = volume[index];
          const transposed = transpose(mix[`${index}`].volume);
          const scaled = dBToPercent(transposed);
          volume[index] = scaled;
          return setVolume([...volume]);
        }, time);
      }, mix.time);
    });

    return () => {
      if (currentTrack.playbackState === "playback") {
        Draw.dispose();
      }
    };
  }, [currentTrack.playbackState, index, volume, channel.volume]);

  useEffect(() => {
    if (currentTrack.playbackState === "free") return;
  }, [currentTrack, index]);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    localStorage.setItem("volumes", JSON.stringify(volume));
    if (currentTrack.playbackState !== "playback") {
      if (isMuted) return;
      const value = parseFloat(e.currentTarget.value);
      const transposed = transpose(value);
      const scaled = dBToPercent(transposed);
      channel.volume.value = scaled;
      volume[index] = value;
      setVolume([...volume]);
      currentTrack.volume = value;
      localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
    }
  }
  return (
    <Fader
      id={currentTrack?.id}
      disabled={currentTrack.playbackState === "playback"}
      channel={channel}
      volume={volume[index]}
      changeVolume={changeVolume}
    />
  );
}

export default TrackFader;
