import { useState } from "react";
import Fader from "./Fader";
import { dBToPercent, transpose } from "~/utils/scale";

type Props = {
  channel: Volume;
  currentMix: MixSettings;
  index: number;
};

function BusFader({ channel, currentMix, index }: Props) {
  const [volume, setVolume] = useState(() => currentMix.bussesVolume[index]);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    const id = parseInt(e.currentTarget.id);
    // setTrackIndex(id);
    const value = parseFloat(e.currentTarget.value);
    const transposed = transpose(value);
    const scaled = dBToPercent(transposed);
    channel.volume.value = scaled;
    setVolume(value);
    currentMix.bussesVolume[id] = value;
  }

  return (
    <Fader
      id={currentMix?.id}
      // disabled={currentMix?.playbackState === "playback"}
      channel={channel}
      volume={volume}
      changeVolume={changeVolume}
    />
  );
}

export default BusFader;
