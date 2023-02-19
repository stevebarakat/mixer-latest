import { useState } from "react";
import type { Destination as D } from "tone/build/esm/core/context/Destination";
import { dBToPercent, transpose } from "~/utils/scale";
import { useMatches } from "@remix-run/react";
import Fader from "./Fader";

type Props = {
  index: number;
  channel: D;
};

function Master({ index, channel }: Props) {
  const matches = useMatches();
  const currentMix = matches[1].data.currentMix;
  const currentTracks = matches[1].data.currentTracks;

  const [volume, setVolume] = useState(currentMix.masterVolume);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const transposed = transpose(value);
    const scaled = dBToPercent(transposed);
    channel.volume.value = scaled;
    setVolume(value);
    currentMix.masterVolume = value;
  }

  return (
    <div className="fader-wrap">
      <Fader
        channel={channel}
        volume={volume}
        changeVolume={changeVolume}
        currentTrack={currentTracks[index]}
      />
      <div className="track-labels">
        <span className="track-name">Master</span>
      </div>
    </div>
  );
}

export default Master;
