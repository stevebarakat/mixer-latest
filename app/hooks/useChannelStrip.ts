import { useEffect, useRef, useState } from "react";
import { loaded, Channel, Player, Transport as t, Destination } from "tone";

type Props = {
  tracks: Track[];
  trackFxTypes: FxType[][];
  busFxTypes: FxType[][];
  busChannels: Volume[];
};

function useChannelStrip({
  tracks,
  trackFxTypes,
  busFxTypes,
  busChannels,
}: Props) {
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
          players.current[j].chain(channels.current[j]);
        }
      }
    });
  }, [tracks, trackFxTypes]);

  useEffect(() => {
    busChannels.map((busChannel) => {
      return busFxTypes.map(
        (busFxType, i) => busFxType[i] && busChannel.connect(busFxType[i])
      );
    });

    return () => {
      busChannels.map((busChannel) => {
        return busFxTypes.map(
          (busFxType, i) => busFxType[i] && busChannel.disconnect(busFxType[i])
        );
      });
    };
  }, [busChannels, busFxTypes]);

  useEffect(() => {
    loaded().then(() => setIsLoaded(true));
  }, [setIsLoaded]);

  return [channels.current, isLoaded] as const;
}

export default useChannelStrip;
