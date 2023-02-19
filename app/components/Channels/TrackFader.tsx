import { useState, useEffect } from "react";
import Fader from "./Fader";
import { dBToPercent, transpose } from "~/utils/scale";
import { Draw, Transport as t } from "tone";

type Props = {
  channel: Channel;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  isMuted: boolean;
  playbackState: string;
  index: number;
};

function TrackFader({
  channel,
  currentTrack,
  currentTracks,
  isMuted,
  playbackState,
  index,
}: Props) {
  const [volume, setVolume] = useState(() => currentTrack.volume);

  useEffect(() => {
    if (currentTrack.playbackState === "playback") {
      console.log("drawing!");
      const rtmString = localStorage.getItem("realTimeMix");
      const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

      realTimeMix.mix?.map((mix) => {
        return t.schedule((time) => {
          Draw.schedule(() => {
            const transposed = transpose(mix[`${index}`]);
            const scaled = dBToPercent(transposed);
            return setVolume(scaled);
          }, time);
        }, mix.time);
      });
    }
    return () => {
      if (currentTracks[index].playbackState === "playback") {
        Draw.dispose();
      }
    };
  }, [currentTrack.playbackState, currentTracks, index]);

  useEffect(() => {
    if (currentTracks[index].playbackState === "playback")
      channel.volume.value = volume;
  }, [volume, channel.volume, currentTracks, index]);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    if (playbackState !== "playback") {
      if (isMuted) return;
      const value = parseFloat(e.currentTarget.value);
      const transposed = transpose(value);
      const scaled = dBToPercent(transposed);
      channel.volume.value = scaled;
      setVolume(value);
      currentTrack.volume = value;
      localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
    }
  }
  return (
    <Fader
      id={currentTrack?.id}
      disabled={currentTrack?.playbackState === "playback"}
      channel={channel}
      volume={volume}
      changeVolume={changeVolume}
    />
  );
}

export default TrackFader;
