import { useMatches } from "@remix-run/react";
import MasterFader from "./MasterFader";

type Props = {
  index: number;
  channel: Destination;
};

function Master({ index, channel }: Props) {
  const matches = useMatches();
  const currentTracks = matches[1].data.currentTracks;

  return (
    <div className="fader-wrap">
      <MasterFader
        channel={channel}
        currentTrack={currentTracks[index]}
        currentTracks={currentTracks}
      />
      <div className="track-labels">
        <span className="track-name">Master</span>
      </div>
    </div>
  );
}

export default Master;
