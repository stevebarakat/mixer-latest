import { Transport as t } from "tone";
import restart from "~/assets/restart";

type Props = {
  song: Song;
};

function Restart({ song }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  function reStart() {
    t.stop();
    t.seconds = song.start || 0;
    // currentTracks.forEach((currentTrack: TrackSettings) => {
    //   if (currentTrack.playbackState === "record") {
    //     window.location.reload();
    //   }
    // });
  }

  return (
    <button className="button square red" onClick={reStart}>
      {restart}
    </button>
  );
}

export default Restart;
