import { useEffect } from "react";
import { Destination } from "tone";
import { dBToPercent, transpose } from "~/utils/scale";

type Props = {
  currentMix: MixSettings;
  currentTracks: TrackSettings[];
  channels: Channel[];
  busChannels: Volume[];
  busFxTypes: FxType[][];
};

function useHydrate({
  currentMix,
  currentTracks,
  channels,
  busChannels,
  busFxTypes,
}: Props) {
  useEffect(() => {
    const scaled = transpose(currentMix.masterVolume);
    const volume = dBToPercent(scaled);
    Destination.set({ volume });

    busChannels.forEach((busChannel, i) => {
      const scaled = transpose(currentMix.bussesVolume[i]);
      const volume = dBToPercent(scaled);
      busChannel.set({ volume });
    });

    currentTracks.forEach((currentTrack: TrackSettings, j: number) => {
      const value = currentTrack.volume!;
      const transposed = transpose(value);
      const scaled = dBToPercent(transposed);

      if (channels[j]) {
        channels[j].set({ pan: currentTrack.pan || 0 });
        channels[j].set({ volume: scaled || -32 });
        channels[j].toDestination();
      }

      currentTrack.activeBusses.forEach((activeBus, i) => {
        if (activeBus === true) {
          channels[j] &&
            busFxTypes[i][0] &&
            channels[j].chain(busChannels[i], busFxTypes[i][0], Destination);
          channels[j] &&
            busFxTypes[i][1] &&
            channels[j].chain(busChannels[i], busFxTypes[i][1], Destination);
        }
      });
    });
  }, [channels, busChannels, busFxTypes, currentMix, currentTracks]);
}

export default useHydrate;
