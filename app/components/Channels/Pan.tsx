import { useState } from "react";
import { useMatches } from "@remix-run/react";

type Props = {
  index: number;
  currentTrack: TrackSettings;
  channel: Channel;
};

function Pan({ index, channel, currentTrack }: Props) {
  const [pan, setPan] = useState(currentTrack.pan);

  const matches = useMatches();
  const currentTracks = matches[1].data.currentTracks;

  const changePan = (e: React.FormEvent<HTMLInputElement>): void => {
    const pan = parseFloat(e.currentTarget.value);
    setPan(pan);
    channel.set({ pan });
  };

  const updatePan = (e: React.FormEvent<HTMLInputElement>): void => {
    currentTracks[index].pan = e.currentTarget.value;
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
  };

  return (
    <div>
      <input
        id={currentTrack?.id}
        className="simple-range"
        type="range"
        min={-1}
        max={1}
        step={0.001}
        value={pan || 0}
        onChange={changePan}
        onInput={updatePan}
      />
      <div className="pan-labels">
        <span>L</span>
        <span>R</span>
      </div>
    </div>
  );
}

export default Pan;
