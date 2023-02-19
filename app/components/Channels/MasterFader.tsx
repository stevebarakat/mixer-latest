import { useState } from "react";
import { dBToPercent, transpose } from "~/utils/scale";
import Fader from "./Fader";

type Props = {
  channel: Destination;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
};

function MasterFader({ channel, currentTrack, currentTracks }: Props) {
  const [volume, setVolume] = useState(() => currentTrack.volume);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const transposed = transpose(value);
    const scaled = dBToPercent(transposed);
    channel.volume.value = scaled;
    setVolume(value);
    currentTrack.volume = value;
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
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

export default MasterFader;
