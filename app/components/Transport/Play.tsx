import { useState } from "react";
import { start, Transport as t } from "tone";
import play from "~/assets/play";
import pause from "~/assets/pause";

type Props = {
  song: Song;
  startRecording: (arg: number) => void;
  playbackState: string;
};

function Play({ song, startRecording, playbackState }: Props) {
  const [state, setState] = useState("stopped");
  const [ready, setReady] = useState(false);

  function initializeAudioContext() {
    console.log("playbackState", playbackState);
    start();
    t.seconds = song.start || 0;
    t.bpm.value = 120;
    t.start();
    setState("started");
    setReady(true);
  }

  function startSong() {
    console.log("playbackState", playbackState);
    if (state === "started") {
      setState("paused");
      t.pause();
    } else if (state === "stopped") {
      setState("started");
      t.start();
    } else if (state === "paused") {
      setState("started");
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

  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const indices = currentTracks.reduce(
    (r: [], v: TrackSettings, i: any) =>
      r.concat(v.playbackState === "record" ? i : []),
    []
  );

  return (
    <div>
      {ready ? (
        <button
          className="button square red"
          onClick={() => {
            startSong();
            playbackState === "record" &&
              state === "playing" &&
              indices.forEach((index: number) => startRecording(index));
          }}
        >
          {playerState}
        </button>
      ) : (
        <button
          className="button square red"
          onClick={() => {
            initializeAudioContext();
            playbackState === "record" &&
              indices.forEach((index: number) => startRecording(index));
          }}
        >
          {play}
        </button>
      )}
    </div>
  );
}

export default Play;
