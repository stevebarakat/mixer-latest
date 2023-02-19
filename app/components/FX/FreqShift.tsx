type Props = {
  controls: FxType;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  currentMix: MixSettings;
  channelType: string;
  index: number;
};

export default function FreqShift({
  controls,
  currentTrack,
  currentTracks,
  currentMix,
  channelType,
  index,
}: Props) {
  const trackFreqShiftsMix = currentTrack.freqShiftsMix;
  const trackFreqShiftsFreq = currentTrack.freqShiftsFreq;
  const busFreqShiftsMix = currentMix.freqShiftsMix;
  const busFreqShiftsFreq = currentMix.freqShiftsFreq;

  const changeFreqShiftsMix = (e: React.FormEvent<HTMLInputElement>): void => {
    if (channelType === "track") {
      trackFreqShiftsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(trackFreqShiftsMix[index].toString());
    }
    if (channelType === "bus") {
      busFreqShiftsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(busFreqShiftsMix[index].toString());
    }
  };

  const updateFreqShiftsMix = (e: React.FormEvent<HTMLInputElement>): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        freqShiftsMix: trackFreqShiftsMix,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        freqShiftsMix: busFreqShiftsMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changeFreqShiftsFreq = (e: React.FormEvent<HTMLInputElement>): void => {
    if (channelType === "track") {
      trackFreqShiftsFreq[index] = parseFloat(e.currentTarget.value);
      controls.frequency.value = parseFloat(
        trackFreqShiftsFreq[index].toString()
      );
    }
    if (channelType === "bus") {
      busFreqShiftsFreq[index] = parseFloat(e.currentTarget.value);
      controls.frequency.value = parseFloat(
        busFreqShiftsFreq[index].toString()
      );
    }
  };

  const updateFreqShiftsFreq = (e: React.FormEvent<HTMLInputElement>): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        freqShiftsFreq: trackFreqShiftsFreq,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        freqShiftsFreq: busFreqShiftsFreq,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  return (
    <div>
      <h3>Frequency Shifter</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="wet">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="wet"
          min={0}
          max={1}
          step={0.01}
          onChange={changeFreqShiftsMix}
          onPointerUp={updateFreqShiftsMix}
          defaultValue={
            channelType === "bus"
              ? currentMix.freqShiftsMix[index]
              : currentTracks[index].freqShiftsMix[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="frequency">Frequency:</label>
        <input
          type="range"
          className="simple-range"
          name="frequency"
          min={0}
          max={4000}
          step={100}
          onChange={changeFreqShiftsFreq}
          onPointerUp={updateFreqShiftsFreq}
          defaultValue={
            channelType === "bus"
              ? currentMix.freqShiftsFreq[index]
              : currentTracks[index].freqShiftsFreq[index].toString()
          }
        />
      </div>
    </div>
  );
}
