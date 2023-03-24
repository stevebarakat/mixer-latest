import { useEffect, useRef, useState } from "react";
import { loaded, Channel, Player, Transport as t, Destination } from "tone";

type Props = {
  tracks: Track[];
  trackFxTypes: FxType[][];
};

function useChannelStrip({ tracks, trackFxTypes }: Props) {
  const channels = useRef<Channel[] | []>([]);
  const players = useRef<Player[] | []>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load audio files, create players to play them and channels to mix them
  useEffect(() => {
    tracks.map((_, i) => {
      channels.current = [...channels.current, new Channel()];
      return (players.current = [
        ...players.current,
        new Player(tracks[i].path).sync().start("+0.5"),
      ]);
    });

    return () => {
      t.stop();
      players.current.forEach((player, j) => {
        player.disconnect();
        channels.current[j].disconnect();
      });
    };
  }, [tracks]);

  useEffect(() => {
    tracks.forEach((_, j) => {
      for (let i = 0; i < 2; i++) {
        if (trackFxTypes[j][i]) {
          players.current[j].chain(
            channels.current[j],
            trackFxTypes[j][i],
            Destination
          );
        } else {
          // may have to remove Destination
          players.current[j].connect(channels.current[j]);
        }
      }
    });
    return () => {
      tracks.forEach((_, j) => {
        for (let i = 0; i < 2; i++) {
          if (trackFxTypes[j][i]) {
            trackFxTypes[j][i].disconnect();
          }
        }
      });
    };
  }, [tracks, trackFxTypes]);

  useEffect(() => {
    loaded().then(() => setIsLoaded(true));
  }, [setIsLoaded]);

  return [channels.current, isLoaded] as const;
}

export default useChannelStrip;
