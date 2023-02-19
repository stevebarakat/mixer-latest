import { useState } from "react";
import type { Destination as D } from "tone/build/esm/core/context/Destination";
import VuMeter from "./VuMeter";
import { dBToPercent, transpose } from "~/utils/scale";
import useVuMeter from "~/hooks/useVuMeter";
import { useMatches } from "@remix-run/react";

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

  const meterVal = useVuMeter([channel]);
  return (
    <div className="fader-wrap">
      <div className="window">
        <input
          disabled
          className="level-val"
          value={Math.round(volume) + " db"}
        />
      </div>

      <div className="levels-wrap">
        <VuMeter meterValue={meterVal} height={300} width={10} />
      </div>
      <div className="vol-wrap">
        <input
          disabled={currentTracks[index].playbackState === "playback"}
          id={index.toString()}
          className="volume"
          style={{ width: 300, top: 85 }}
          type="range"
          min={-100}
          max={12}
          step={0.1}
          value={volume}
          onChange={changeVolume}
          // onPointerUp={updateVolume}
        />
      </div>
      <div className="track-labels">
        <span className="track-name">Master</span>
      </div>
    </div>
  );
}

export default Master;
