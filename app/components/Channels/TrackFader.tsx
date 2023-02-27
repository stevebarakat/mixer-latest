import { useState, useEffect, useRef, useCallback } from "react";
import Fader from "./Fader";
import { dBToPercent, transpose } from "~/utils/scale";
import { Destination, Volume, Draw, Loop, Transport as t } from "tone";

type Props = {
  channel: Channel;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  isMuted: boolean;
  playState: string;
  index: number;
};

function TrackFader({
  channel,
  currentTrack,
  currentTracks,
  isMuted,
  playState,
  index,
}: Props) {
  const [volume, setVolume] = useState(currentTrack.volume);
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
      let data: {}[] = [];

      loop.current = new Loop(() => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);

        data = [{ time: t.seconds.toFixed(1), ...currentTracks }, ...data];

        localStorage.setItem(
          `Track${index}`,
          JSON.stringify({
            mix: data,
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
        (r: string[], v: TrackSettings, i: any) => {
          console.log("v.playbackState", v.playbackState);
          return r.concat(v.playbackState === "record" ? i : []);
        },
        []
      );
      console.log("indices", indices);
      if (currentTrack.playbackState === "record") {
        indices.forEach((index: string) => startRecording(parseInt(index, 10)));
      }
    }
  }, [playState, currentTrack, currentTracks]);

  /////////////////////
  // START PLAYBACK //
  /////////////////////

  const startPlayback = useCallback(() => {
    const rtmString = localStorage.getItem(`Track${index}`);
    const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

    realTimeMix.mix?.map((mix) => {
      return t.schedule((time) => {
        Draw.schedule(() => {
          const transposed = transpose(mix[`${index}`].volume);
          const scaled = dBToPercent(transposed);
          channel.volume.value = scaled;
          return setVolume(mix[`${index}`].volume);
        }, time);
      }, mix.time);
    });
  }, [channel.volume, index]);

  useEffect(() => {
    if (currentTrack.playbackState !== "playback") return;
    startPlayback();

    return () => {
      if (currentTrack.playbackState === "playback") {
        Draw.dispose();
      }
    };
  }, [
    currentTrack.playbackState,
    startPlayback,
    index,
    volume,
    channel.volume,
  ]);

  useEffect(() => {
    if (currentTrack.playbackState === "free") return;
  }, [currentTrack, index]);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    if (currentTrack.playbackState !== "playback") {
      if (isMuted) return;
      const value = parseFloat(e.currentTarget.value);
      const transposed = transpose(value);
      const scaled = dBToPercent(transposed);
      channel.volume.value = scaled;
      setVolume(value);
      currentTrack.volume = scaled;
      localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
    }
  }
  return (
    <Fader
      id={currentTrack?.id}
      disabled={currentTrack.playbackState === "playback"}
      channel={channel}
      volume={volume}
      changeVolume={changeVolume}
    />
  );
}

export default TrackFader;
