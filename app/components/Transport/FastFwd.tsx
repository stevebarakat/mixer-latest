import { Transport as t } from "tone";
import ff from "~/assets/ff";

type Props = {
  song: Song;
};

function FastFwd({ song }: Props) {
  function fastForward() {
    if (t.seconds > song.end! - 10) {
      t.seconds = song.end || 0;
    } else {
      t.seconds = t.seconds + 10;
    }
  }

  return (
    <button className="button square red" onClick={fastForward}>
      {ff}
    </button>
  );
}

export default FastFwd;
