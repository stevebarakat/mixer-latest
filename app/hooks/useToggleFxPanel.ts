type Props = {
  trackFxOpen: boolean[];
  setTrackFxOpen: (arg: boolean[]) => void;
  busFxOpen?: boolean[];
  setBusFxOpen?: (arg: boolean[]) => void;
};

function useToggleFxPanel({
  trackFxOpen,
  setTrackFxOpen,
  busFxOpen,
  setBusFxOpen,
}: Props) {
  const toggleFxPanel = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const index = parseInt(e.currentTarget.id[3], 10);
    busFxOpen[index] = !busFxOpen[index];
    setBusFxOpen([...busFxOpen]);
    trackFxOpen[index] = !trackFxOpen[index];
    setTrackFxOpen([...trackFxOpen]);
  };
  return toggleFxPanel;
}

export default useToggleFxPanel;
