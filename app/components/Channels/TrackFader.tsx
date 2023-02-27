import { useState, useEffect, useRef, useCallback } from "react";
import Fader from "./Fader";
import { dBToPercent, transpose } from "~/utils/scale";
import { Draw, Loop, Transport as t } from "tone";

type Props = {
  channel: Channel;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  isMuted: boolean;
  playState: string;
  index: number;
  setIsRewinding: (arg: boolean) => void;
  isRewinding: boolean;
  rewind: (arg: number) => void;
};

function TrackFader({
  channel,
  currentTrack,
  currentTracks,
  isMuted,
  playState,
  index,
  setIsRewinding,
  isRewinding,
  rewind,
}: Props) {
  const [volume, setVolume] = useState(currentTrack.volume);
  const loop = useRef<Loop | null>(null);

  const i = useRef(0);
  useEffect(() => {
    /////////////////////
    // START RECORDING //
    /////////////////////

    function startRecording(index: number) {
      console.log("currentTracks[index]", currentTracks[index]);
      if (currentTracks[index].playbackMode !== "record") return;
      console.log("Recording!!!");
      console.log("index", index);
      let data: {}[] = [];

      loop.current = new Loop(() => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);

        data = [{ time: i.current, ...currentTracks }, ...data];

        localStorage.setItem(
          `Track${index}`,
          JSON.stringify({
            mix: data,
          })
        );
        i.current = i.current + 1;
      }, 1).start();
    }

    if (playState === "started") {
      const indices = currentTracks.reduce(
        (r: string[], v: TrackSettings, i: any) => {
          console.log("v.playbackMode", v.playbackMode);
          return r.concat(v.playbackMode === "record" ? i : []);
        },
        []
      );
      console.log("indices", indices);
      if (currentTrack.playbackMode === "record") {
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
    if (currentTrack.playbackMode !== "playback") return;
    startPlayback();

    return () => {
      if (currentTrack.playbackMode === "playback") {
        Draw.dispose();
      }
    };
  }, [currentTrack.playbackMode, startPlayback, index, volume, channel.volume]);

  useEffect(() => {
    if (isRewinding) {
      rewind(i.current);
      setIsRewinding(false);
    }
  }, [setIsRewinding, isRewinding, rewind]);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    if (currentTrack.playbackMode !== "playback") {
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
      disabled={currentTrack.playbackMode === "playback"}
      channel={channel}
      volume={volume}
      changeVolume={changeVolume}
    />
  );
}

export default TrackFader;
