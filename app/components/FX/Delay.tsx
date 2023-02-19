type Props = {
  controls: FxType;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  currentMix: MixSettings;
  channelType: string;
  index: number;
};

export default function Delay({
  controls,
  currentTrack,
  currentTracks,
  currentMix,
  channelType,
  index,
}: Props) {
  const trackDelaysMix = currentTrack.delaysMix;
  const trackDelaysTime = currentTrack.delaysTime;
  const trackDelaysFeedback = currentTrack.delaysFeedback;
  const busDelaysMix = currentMix.delaysMix;
  const busDelaysTime = currentMix.delaysTime;
  const busDelaysFeedback = currentMix.delaysFeedback;

  const changeDelaysMix = (e: React.FormEvent<HTMLInputElement>): void => {
    if (typeof controls === "string") return;
    if (channelType === "track") {
      trackDelaysMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(trackDelaysMix[index].toString());
    }
    if (channelType === "bus") {
      busDelaysMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(busDelaysMix[index].toString());
    }
  };

  const updateDelaysMix = () => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        delaysMix: trackDelaysMix,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        delaysMix: busDelaysMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changeDelaysTime = (e: React.FormEvent<HTMLInputElement>): void => {
    if (typeof controls === "string") return;
    if (channelType === "track") {
      trackDelaysTime[index] = parseFloat(e.currentTarget.value);
      controls.delayTime.value = parseFloat(trackDelaysTime[index].toString());
    }
    if (channelType === "bus") {
      busDelaysTime[index] = parseFloat(e.currentTarget.value);
      controls.delayTime.value = parseFloat(busDelaysTime[index].toString());
    }
  };

  const updateDelaysTime = () => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        delaysTime: trackDelaysTime,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        delaysTime: busDelaysTime,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changeDelaysFeedback = (e: React.FormEvent<HTMLInputElement>): void => {
    if (typeof controls === "string") return;
    if (channelType === "track") {
      trackDelaysFeedback[index] = parseFloat(e.currentTarget.value);
      controls.feedback.value = parseFloat(
        trackDelaysFeedback[index].toString()
      );
    }
    if (channelType === "bus") {
      busDelaysFeedback[index] = parseFloat(e.currentTarget.value);
      controls.feedback.value = parseFloat(busDelaysFeedback[index].toString());
    }
  };

  const updateDelaysFeedback = () => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        delaysFeedback: trackDelaysFeedback,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        delaysFeedback: busDelaysFeedback,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  return (
    <div>
      <h3>Delay</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-mix">Delay Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="delay-mix"
          min={0}
          max={1}
          step={0.1}
          onChange={changeDelaysMix}
          onPointerUp={updateDelaysMix}
          defaultValue={
            channelType === "bus"
              ? currentMix.delaysMix[index]
              : currentTracks[index].delaysMix[index].toString()
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
          step={0.1}
          onChange={changeDelaysTime}
          onPointerUp={updateDelaysTime}
          defaultValue={
            channelType === "bus"
              ? currentMix.delaysTime[index]
              : currentTracks[index].delaysTime[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-feedback">Delay Feedback:</label>
        <input
          type="range"
          className="simple-range"
          name="delay-feedback"
          min={0}
          max={0.75}
          step={0.1}
          onChange={changeDelaysFeedback}
          onPointerUp={updateDelaysFeedback}
          defaultValue={
            channelType === "bus"
              ? currentMix.delaysFeedback[index]
              : currentTracks[index].delaysFeedback[index].toString()
          }
        />
      </div>
    </div>
  );
}
