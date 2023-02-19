import { useState } from "react";
import { start, Transport as t } from "tone";
import play from "~/assets/play";
import pause from "~/assets/pause";

type Props = {
  song: Song;
  playState: string;
  setPlayState: (arg: string) => void;
};

function Play({ song, playState, setPlayState }: Props) {
  const [ready, setReady] = useState(false);

  function initializeAudioContext() {
    start();
    t.seconds = song.start || 0;
    t.start();
    setPlayState("started");
    setReady(true);
  }

  function startSong() {
    if (playState === "started") {
      setPlayState("paused");
      t.pause();
    } else if (playState === "stopped") {
      setPlayState("started");
      t.start();
    } else if (playState === "paused") {
      setPlayState("started");
      t.start();
    }
  }

  const playerState = (() => {
    switch (t.state) {
      case "stopped":
        return play;
      case "paused":
        return play;
      case "started":
        return pause;
      default:
        return pause;
    }
  })();

  return (
    <div>
      {ready ? (
        <button className="button square red" onClick={startSong}>
          {playerState}
        </button>
      ) : (
        <button className="button square red" onClick={initializeAudioContext}>
          {play}
        </button>
      )}
    </div>
  );
}

export default Play;
