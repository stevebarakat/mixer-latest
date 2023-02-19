import { useEffect, useRef, useCallback, useState } from "react";
import { Transport as t } from "tone";
import { formatMilliseconds } from "../../utils";

type Props = {
  song: Song;
};

function Clock({ song }: Props) {
  const requestRef = useRef<number | null>(null);
  const [clock, setClock] = useState("0:0:0");

  // make sure song stops at end
  if (song.end !== null && song.start !== null) {
    if (t.seconds > song.end) {
      t.stop();
      t.seconds = song.start;
    }
  }
  // make sure song doesn't rewind past start position
  if (t.seconds < (song.start || 0)) {
    t.stop();
    t.seconds = song.start || 0;
  }

  const animateClock = useCallback(() => {
    requestRef.current = requestAnimationFrame(animateClock);
    setClock(formatMilliseconds(t.seconds));
  }, []);

  // triggers animateClock
  useEffect(() => {
    requestAnimationFrame(animateClock);

    return () => {
      if (requestRef.current === null) return;
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="clock">
      <div className="ghost">88:88:88</div>
      {clock}
    </div>
  );
}

export default Clock;
