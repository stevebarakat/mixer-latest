type Props = {
  controls: FxType;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  currentMix: MixSettings;
  channelType: string;
  index: number;
};

export default function Chebyshever({
  controls,
  currentTrack,
  currentTracks,
  currentMix,
  channelType,
  index,
}: Props) {
  const trackChebyshevsMix = currentTrack.chebyshevsMix;
  const trackChebyshevsOrder = currentTrack.chebyshevsOrder;
  const busChebyshevsMix = currentMix.chebyshevsMix;
  const busChebyshevsOrder = currentMix.chebyshevsOrder;

  const changeChebyshevsMix = (e: React.FormEvent<HTMLInputElement>): void => {
    if (channelType === "track") {
      trackChebyshevsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(trackChebyshevsMix[index].toString());
    }
    if (channelType === "bus") {
      busChebyshevsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(busChebyshevsMix[index].toString());
    }
  };

  const updateChebyshevsMix = (): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        chebyshevsMix: trackChebyshevsMix,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        chebyshevsMix: busChebyshevsMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changeChebyshevsOrder = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    if (channelType === "track") {
      trackChebyshevsOrder[index] = parseFloat(e.currentTarget.value);
      controls.order = parseFloat(trackChebyshevsOrder[index].toString());
    }
    if (channelType === "bus") {
      busChebyshevsOrder[index] = parseFloat(e.currentTarget.value);
      controls.order = parseFloat(busChebyshevsOrder[index].toString());
    }
  };

  const updateChebyshevsOrder = (): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        chebyshevsOrder: trackChebyshevsOrder,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        chebyshevsOrder: busChebyshevsOrder,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  return (
    <div>
      <h3>Chebyshev</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="order">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="order"
          min={0}
          max={1}
          step={0.01}
          onChange={changeChebyshevsMix}
          onPointerUp={updateChebyshevsMix}
          defaultValue={
            channelType === "bus"
              ? currentMix.chebyshevsMix[index]
              : currentTracks[index].chebyshevsMix[index].toString()
          }
        />
        <label htmlFor="order">Order:</label>
        <input
          type="range"
          className="simple-range"
          name="order"
          min={1}
          max={100}
          step={1}
          onChange={changeChebyshevsOrder}
          onPointerUp={updateChebyshevsOrder}
          defaultValue={
            channelType === "bus"
              ? currentMix.chebyshevsOrder[index]
              : currentTracks[index].chebyshevsOrder[index].toString()
          }
        />
      </div>
    </div>
  );
}
