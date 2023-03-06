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
  playState: string;
  setPlayState: (arg: string) => void;
};

function Transport({ song, playState, setPlayState }: Props) {
  const [isStarted, setStarted] = useState(false);
  const keys = useKeys();

  useEffect(() => {
    t.stop();
  }, []);

  useEffect(() => {
    switch (keys.toString()) {
      case "ShiftLeft,Space":
      case "ShiftLeft,NumpadDecimal":
      case "ShiftLeft,ArrowDown":
        isStarted ? t.pause() : t.start();
        return () => setStarted(!isStarted);
      case "ShiftLeft,Numpad0":
      case "ShiftLeft,ArrowUp":
        t.stop();
        t.seconds = song.start || 0;
        return () => setStarted((started) => !started);
      case "ShiftLeft,NumpadEnter":
        t.seconds = song.start || 0;
        t.start();
        return () => setStarted(true);
      case "ShiftLeft,ArrowLeft":
        t.seconds = t.seconds - 10;
        break;
      case "ShiftLeft,ArrowRight":
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
        <Rewind song={song} />
        <Play song={song} playState={playState} setPlayState={setPlayState} />
        <FastFwd song={song} />
      </div>
      <Clock song={song} />
    </>
  );
}

export default Transport;
