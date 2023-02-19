import { useState } from "react";
import { start, Transport as t } from "tone";
import play from "~/assets/play";
import pause from "~/assets/pause";

type Props = {
  song: Song;
  startRecording: (arg: number) => void;
  playbackState: string[];
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

  const indices = currentTracks.reduce((r: [], v: TrackSettings, i: any) => {
    console.log("v.playbackState[i]", v.playbackState[i]);
    return r.concat(v.playbackState[i] === "record" ? i : []);
  }, []);

  return (
    <div>
      {ready ? (
        <button
          className="button square red"
          onClick={() => {
            startSong();
            currentTracks.forEach((currentTrack: TrackSettings, i: number) => {
              console.log(
                "currentTrack.playbackState[i]",
                currentTrack.playbackState[i]
              );
              if (currentTrack.playbackState[i] === "record") {
                indices.forEach((index: number) => startRecording(index));
              }
            });
          }}
        >
          {playerState}
        </button>
      ) : (
        <button
          className="button square red"
          onClick={() => {
            initializeAudioContext();
            currentTracks.forEach((currentTrack: TrackSettings, i: number) => {
              if (currentTrack.playbackState[i] === "record") {
                indices.forEach((index: number) => startRecording(index));
              }
            });
          }}
        >
          {play}
        </button>
      )}
    </div>
  );
}

export default Play;
