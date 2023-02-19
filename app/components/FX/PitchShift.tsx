type Props = {
  controls: FxType;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  currentMix: MixSettings;
  channelType: string;
  index: number;
};

export default function PitchShifter({
  controls,
  currentTrack,
  currentTracks,
  currentMix,
  channelType,
  index,
}: Props) {
  const trackPitchShiftsFeedback = currentTrack.pitchShiftsFeedback;
  const trackPitchShiftsSize = currentTrack.pitchShiftsSize;
  const trackPitchShiftsDelayTime = currentTrack.pitchShiftsDelayTime;
  const trackPitchShiftsPitch = currentTrack.pitchShiftsPitch;
  const trackPitchShiftsMix = currentTrack.pitchShiftsMix;
  const busPitchShiftsFeedback = currentMix.pitchShiftsFeedback;
  const busPitchShiftsSize = currentMix.pitchShiftsSize;
  const busPitchShiftsDelayTime = currentMix.pitchShiftsDelayTime;
  const busPitchShiftsPitch = currentMix.pitchShiftsPitch;
  const busPitchShiftsMix = currentMix.pitchShiftsMix;

  const changePitchShiftsMix = (e: React.FormEvent<HTMLInputElement>): void => {
    if (channelType === "track") {
      trackPitchShiftsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(trackPitchShiftsMix[index].toString());
    }
    if (channelType === "bus") {
      busPitchShiftsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(busPitchShiftsMix[index].toString());
    }
  };

  const updatePitchShiftsMix = () => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        pitchShiftsMix: trackPitchShiftsMix,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        pitchShiftsMix: busPitchShiftsMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changePitchShiftsPitch = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    if (channelType === "track") {
      trackPitchShiftsPitch[index] = parseFloat(e.currentTarget.value);
      controls.pitch = parseFloat(trackPitchShiftsPitch[index].toString());
    }
    if (channelType === "bus") {
      busPitchShiftsPitch[index] = parseFloat(e.currentTarget.value);
      controls.pitch = parseFloat(busPitchShiftsPitch[index].toString());
    }
  };

  const updatePitchShiftsPitch = () => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        pitchShiftsPitch: trackPitchShiftsPitch,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        pitchShiftsPitch: busPitchShiftsPitch,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changePitchShiftsDelayTime = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    if (channelType === "track") {
      trackPitchShiftsDelayTime[index] = parseFloat(e.currentTarget.value);
      controls.delayTime.value = parseFloat(
        trackPitchShiftsDelayTime[index].toString()
      );
    }
    if (channelType === "bus") {
      busPitchShiftsDelayTime[index] = parseFloat(e.currentTarget.value);
      controls.delayTime.value = parseFloat(
        busPitchShiftsDelayTime[index].toString()
      );
    }
  };

  const updatePitchShiftsDelayTime = (): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        pitchShiftsDelayTime: trackPitchShiftsDelayTime,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        pitchShiftsDelayTime: busPitchShiftsDelayTime,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changePitchShiftsSize = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    if (channelType === "track") {
      trackPitchShiftsSize[index] = parseFloat(e.currentTarget.value);
      controls.windowSize = parseFloat(trackPitchShiftsSize[index].toString());
    }
    if (channelType === "bus") {
      busPitchShiftsSize[index] = parseFloat(e.currentTarget.value);
      controls.windowSize = parseFloat(busPitchShiftsSize[index].toString());
    }
  };

  const updatePitchShiftsSize = (): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        pitchShiftsSize: trackPitchShiftsSize,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        pitchShiftsSize: busPitchShiftsSize,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changePitchShiftsFeedback = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    if (channelType === "track") {
      trackPitchShiftsFeedback[index] = parseFloat(e.currentTarget.value);
      controls.feedback.value = parseFloat(
        trackPitchShiftsFeedback[index].toString()
      );
    }
    if (channelType === "bus") {
      busPitchShiftsFeedback[index] = parseFloat(e.currentTarget.value);
      controls.feedback.value = parseFloat(
        busPitchShiftsFeedback[index].toString()
      );
    }
  };

  const updatePitchShiftsFeedback = (): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        pitchShiftsFeedback: trackPitchShiftsFeedback,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        pitchShiftsFeedback: busPitchShiftsFeedback,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  return (
    <div>
      <h3>PitchShifter</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="mix"
          min={0}
          max={1}
          step={0.0001}
          onChange={changePitchShiftsMix}
          onPointerUp={updatePitchShiftsMix}
          defaultValue={
            channelType === "bus"
              ? currentMix.pitchShiftsMix[index]
              : currentTracks[index].pitchShiftsMix[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="pitch">Pitch:</label>
        <input
          type="range"
          className="simple-range"
          name="pitch"
          min={-48}
          max={48}
          step={1}
          onChange={changePitchShiftsPitch}
          onPointerUp={updatePitchShiftsPitch}
          defaultValue={
            channelType === "bus"
              ? currentMix.pitchShiftsPitch[index]
              : currentTracks[index].pitchShiftsPitch[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          className="simple-range"
          name="delay-time"
          min={0}
          max={1}
          step={0.00001}
          onChange={changePitchShiftsDelayTime}
          onPointerUp={updatePitchShiftsDelayTime}
          defaultValue={
            channelType === "bus"
              ? currentMix.pitchShiftsDelayTime[index]
              : currentTracks[index].pitchShiftsDelayTime[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="size">Size:</label>
        <input
          type="range"
          className="simple-range"
          name="size"
          min={0.03}
          max={0.1}
          step={0.00001}
          onChange={changePitchShiftsSize}
          onPointerUp={updatePitchShiftsSize}
          defaultValue={
            channelType === "bus"
              ? currentMix.pitchShiftsSize[index]
              : currentTracks[index].pitchShiftsSize[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="feedback">Feedback:</label>
        <input
          type="range"
          className="simple-range"
          name="feedback"
          min={0}
          max={1}
          step={0.00001}
          onChange={changePitchShiftsFeedback}
          onPointerUp={updatePitchShiftsFeedback}
          defaultValue={
            channelType === "bus"
              ? currentMix.pitchShiftsFeedback[index]
              : currentTracks[index].pitchShiftsFeedback[index].toString()
          }
        />
      </div>
    </div>
  );
}
