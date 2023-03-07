import { Transport as t } from "tone";
import rew from "~/assets/rew";

type Props = {
  song: Song;
};

function Rewind({ song }: Props) {
  const currentTracks = JSON.parse(localStorage.getItem("currentTracks")!);

  const disabled = currentTracks.some(
    (currentTrack: TrackSettings) => currentTrack.playbackMode === "record"
  );

  function rewind() {
    if (t.seconds < song.start!) {
      t.seconds = song.start || 0;
    } else {
      t.seconds = t.seconds - 10;
    }
  }

  return (
    <button disabled={disabled} className="button square red" onClick={rewind}>
      {rew}
    </button>
  );
}

export default Rewind;
