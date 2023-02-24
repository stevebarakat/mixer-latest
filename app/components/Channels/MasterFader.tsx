import { useState } from "react";
import { dBToPercent, transpose } from "~/utils/scale";
import Fader from "./Fader";

type Props = {
  channel: Destination;
  currentMix: MixSettings;
};

function MasterFader({ channel, currentMix }: Props) {
  const [volume, setVolume] = useState(() => currentMix.masterVolume);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const transposed = transpose(value);
    const scaled = dBToPercent(transposed);
    channel.volume.value = scaled;
    setVolume(value);
    currentMix.masterVolume = value;
    localStorage.setItem("currentMix", JSON.stringify(currentMix));
  }
  return (
    <Fader
      id={currentMix.id}
      channel={channel}
      volume={volume}
      changeVolume={changeVolume}
    />
  );
}

export default MasterFader;
