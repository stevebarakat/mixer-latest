import { useState, useEffect, useCallback } from "react";
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
  loop: React.MutableRefObject<Loop>;
};

function TrackFader({
  channel,
  currentTrack,
  currentTracks,
  isMuted,
  playState,
  index,
  loop,
}: Props) {
  const [volume, setVolume] = useState(currentTrack.volume);

  // !!! --- START RECORDING --- !!! //
  const startRecording = useCallback(
    (index: number) => {
      let data: {}[] = [];

      loop.current = new Loop(() => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);
        if (currentTracks[index].playbackMode !== "record") return;

        const volume = currentTracks[index].volume;

        // data = [{ time: t.seconds.toFixed(1), volume }, ...data];

        let ubu = (t.seconds * 10).toFixed(0);
        console.log("ubu", ubu);
        data[parseInt(ubu, 10)] = { time: t.seconds.toFixed(2), volume };

        localStorage.setItem(`Track${index}-volume`, JSON.stringify(data));
      }, 0.1).start(0);
    },
    [loop]
  );

  useEffect(() => {
    const indices = currentTracks.reduce(
      (r: number[], v: TrackSettings, i: any) =>
        r.concat(v.playbackMode === "record" ? i : []),
      []
    );
    indices.forEach((index) => startRecording(index));
  }, [playState, currentTrack, startRecording, currentTracks, loop]);

  // !!! --- START PLAYBACK --- !!! //
  const startPlayback = useCallback(() => {
    const rtmString = localStorage.getItem(`Track${index}-volume`);
    const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

    realTimeMix.forEach((mix: TrackSettings[] & any) => {
      t.schedule((time) => {
        Draw.schedule(() => {
          if (currentTrack.playbackMode !== "playback") return;
          const transposed = transpose(mix.volume);
          const scaled = dBToPercent(transposed);
          channel.volume.value = scaled;
          return setVolume(mix.volume);
        }, time);
      }, mix.time);
    });
  }, [index, channel.volume, currentTrack.playbackMode]);

  useEffect(() => {
    startPlayback();
  }, [startPlayback]);

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
