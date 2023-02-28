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
  rewind: (track: string, playbackMode: string, loop: Loop) => void;
  loop: React.MutableRefObject<Loop>;
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
  loop,
}: Props) {
  const [volume, setVolume] = useState(currentTrack.volume);
  const draw = useRef<typeof Draw>(Draw);

  // !!! --- START RECORDING --- !!! //
  const startRecording = useCallback(
    (index: number) => {
      if (currentTracks[index].playbackMode !== "record") return;
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
      }, 0.1).start("+0.5");
    },
    [currentTracks, loop]
  );

  useEffect(() => {
    const indices = currentTracks.reduce(
      (r: number[], v: TrackSettings, i: any) =>
        r.concat(v.playbackMode === "record" ? i : []),
      []
    );
    indices.forEach(
      (index: number) => playState === "started" && startRecording(index)
    );
  }, [playState, currentTracks, startRecording, loop]);

  // !!! --- START PLAYBACK --- !!! //
  const startPlayback = useCallback(
    (index: number) => {
      if (currentTrack.playbackMode !== "playback") return;
      const rtmString = localStorage.getItem(`Track${index}`);
      const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

      realTimeMix.mix?.map((mix: TrackSettings[] & any) => {
        t.scheduleOnce((time) => {
          draw.current.schedule(() => {
            const transposed = transpose(mix[`${index}`].volume);
            const scaled = dBToPercent(transposed);
            channel.volume.value = scaled;
            return setVolume(mix[`${index}`].volume);
          }, time);
        }, mix.time);
        return draw.current.dispose();
      });
    },
    [channel.volume, currentTrack.playbackMode]
  );

  useEffect(() => {
    const indices = currentTracks.reduce(
      (r: number[], v: TrackSettings, i: any) =>
        r.concat(v.playbackMode === "playback" ? i : []),
      []
    );
    indices.forEach(
      (index: number) => playState === "started" && startPlayback(index)
    );
  }, [currentTracks, playState, startPlayback, index]);

  useEffect(() => {
    if (isRewinding) {
      rewind(`Track${index}`, currentTrack.playbackMode, loop.current);
      setIsRewinding(false);
    }
  }, [
    setIsRewinding,
    isRewinding,
    rewind,
    index,
    currentTrack.playbackMode,
    loop,
  ]);

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
