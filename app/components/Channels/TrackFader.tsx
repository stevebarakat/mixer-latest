import { useState } from "react";
import Fader from "./Fader";
import { dBToPercent, transpose } from "~/utils/scale";

type Props = {
  channel: Channel;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  isMuted: boolean;
  playbackState: string;
};

function TrackFader({
  channel,
  currentTrack,
  currentTracks,
  isMuted,
  playbackState,
}: Props) {
  const [volume, setVolume] = useState(() => currentTrack.volume);

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
