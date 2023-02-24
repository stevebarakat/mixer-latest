import { useMatches } from "@remix-run/react";
import MasterFader from "./MasterFader";

type Props = {
  index: number;
  channel: Destination;
};

function Master({ index, channel }: Props) {
  const matches = useMatches();
  const currentMix = matches[1].data.currentMix;

  return (
    <div className="fader-wrap">
      <MasterFader channel={channel} currentMix={currentMix} />
      <div className="track-labels">
        <span className="track-name">Master</span>
      </div>
    </div>
  );
}

export default Master;
