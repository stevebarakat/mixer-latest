import { Destination } from "tone";

type Props = {
  channels: Channel[];
  busChannels: Volume[];
};

function useToggleBus({ channels, busChannels }: Props) {
  const toggleBus = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = parseInt(e.currentTarget.id[3], 10);
    const busId = parseInt(e.currentTarget.name, 10);

    busChannels.forEach((_, i: number) => {
      if (e.currentTarget.checked) {
        if (id === i) {
          busChannels.forEach(() => {
            if (busId === null) return;
            channels[busId].chain(busChannels[i]);
          });
        }
      } else {
        if (id === i && busChannels[i] !== undefined) {
          busChannels.forEach(() => {
            if (busId === null) return;
            channels[busId].connect(busChannels[i]);
            channels[busId].disconnect(busChannels[i]);
            channels[busId].connect(Destination);
          });
        }
      }
    });
  };
  return toggleBus;
}

export default useToggleBus;
