import { useState, useEffect } from "react";
import { Transport as t } from "tone";
import Restart from "./Restart";
import Rewind from "./Rewind";
import FastFwd from "./FastFwd";
import Play from "./Play";
import Clock from "./Clock";
import useKeys from "~/hooks/useKeyPress";

type Props = {
  song: Song;
  rewind: () => void;
  // startRecording: (arg: number) => void;
  playbackState: string[];
  playState: string;
  setPlayState: (arg: string) => void;
};

function Controls({
  song,
  rewind,
  playbackState,
  playState,
  setPlayState,
}: Props) {
  const [isStarted, setStarted] = useState(false);
  const keys = useKeys();

  useEffect(() => {
    t.stop();
  }, []);

  useEffect(() => {
    switch (keys[0]) {
      case "Space":
      case "NumpadDecimal":
      case "ArrowDown":
        isStarted ? t.pause() : t.start();
        return () => setStarted(!isStarted);
      case "Numpad0":
      case "ArrowUp":
        t.stop();
        t.seconds = song.start || 0;
        return () => setStarted((started) => !started);
      case "NumpadEnter":
        t.seconds = song.start || 0;
        t.start();
        return () => setStarted(true);
      case "ArrowLeft":
        t.seconds = t.seconds - 10;
        break;
      case "ArrowRight":
      case "FF":
        t.seconds = t.seconds + 10;
        break;
      default:
        break;
    }
  }, [keys, song, isStarted]);

  return (
    <>
      <div className="flex gap4">
        <Restart song={song} />
        <Rewind song={song} rewind={rewind} />
        <Play
          song={song}
          // startRecording={startRecording}
          // playbackState={playbackState}
          playState={playState}
          setPlayState={setPlayState}
        />
        <FastFwd song={song} />
      </div>
      <Clock song={song} />
    </>
  );
}

export default Controls;
