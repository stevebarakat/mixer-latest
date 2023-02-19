import { updateCurrentMix, array as fx } from "~/utils";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { FormEvent } from "react";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Fader from "./Fader";
import VuMeter from "./VuMeter";
import useVuMeter from "~/hooks/useVuMeter";
import { dBToPercent, transpose } from "~/utils/scale";
import TrackSend from "./TrackSend";
import { recordIcon } from "~/assets/recordIcon";
import { earIcon } from "~/assets/earIcon";

type Props = {
  trackIndex: number;
  track: Track;
  channel: Channel;
  busChannels: Volume[];
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  trackFxOpen: boolean[];
  trackFxChoices: string[][];
  toggleBus: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetTrackFxOpen: (value: boolean[]) => void;
  handleSetTrackFxChoices: (arg: string[][]) => void;
  playbackState: string;
  setPlaybackState: (arg: string) => void;
};

export default function ChannelStrip({
  trackIndex,
  track,
  channel,
  toggleBus,
  busChannels,
  currentTrack,
  currentTracks,
  trackFxChoices,
  handleSetTrackFxChoices,
  trackFxOpen,
  handleSetTrackFxOpen,
  playbackState,
  setPlaybackState,
}: Props) {
  const fetcher = useFetcher();
  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  const [volume, setVolume] = useState(() => currentTracks[trackIndex].volume);

  const [isMuted, setIsMuted] = useState(false);
  const handleSetIsMuted = (value: boolean) => setIsMuted(value);

  const toggleTrackFxModal = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const trackIndex = parseInt(e.currentTarget.name, 10);
    trackFxOpen[trackIndex] = !trackFxOpen[trackIndex];
    handleSetTrackFxOpen([...trackFxOpen]);
  };

  const disabled = trackFxChoices[trackIndex]?.every((_: string, i: number) => {
    return trackFxChoices[trackIndex][i] === "";
  });

  function selectFx(
    e: FormEvent<HTMLSelectElement>,
    busIndex: number,
    fxIndex: number
  ) {
    trackFxChoices[busIndex][fxIndex] = e.currentTarget.value;
    handleSetTrackFxChoices([...trackFxChoices]);

    return updateCurrentMix({ trackFxChoices });
  }

  const saveMix = (index: number, playbackState: string) => {
    const currentTracksString = localStorage.getItem("currentTracks");
    const currentTracksParsed =
      currentTracksString && JSON.parse(currentTracksString);

    console.log(
      "currentTracksParsed",
      currentTracksParsed[index].playbackState
    );

    currentTracksParsed[index].playbackState = playbackState;

    const currentTracks = JSON.stringify(currentTracksParsed);
    fetcher.submit(
      {
        actionName: "saveMix",
        realTimeMix: localStorage.getItem("realTimeMix")!,
        currentMix: localStorage.getItem("currentMix")!,
        currentTracks,
      },
      { method: "post", action: "/saveMix", replace: true }
    );
  };

  function savePlaybackState(e: React.SyntheticEvent) {
    const target = e.target as HTMLButtonElement;
    const trackIndex = parseInt(target.id[0], 10);
    console.log("trackIndex", trackIndex);

    currentTracks[trackIndex].playbackState = target.value;

    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));

    setPlaybackState(currentTracks[trackIndex].playbackState);
    saveMix(trackIndex, playbackState);

    console.log(
      "currentTracks[trackIndex].playbackState",
      currentTracks[trackIndex].playbackState
    );
    // if (currentTracks[trackIndex].playbackState === "record") {
    //   fetcher.submit(
    //     {
    //       actionName: "saveRealTimeMix",
    //       realTimeMix: localStorage.getItem("realTimeMix")!,
    //     },
    //     { method: "post", action: "/saveMix", replace: true }
    //   );
    // }
    // window.location.reload();
  }

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    if (playbackState !== "playback") {
      if (isMuted) return;
      const id = parseInt(e.currentTarget.id);
      // setTrackIndex(id);
      const value = parseFloat(e.currentTarget.value);
      const transposed = transpose(value);
      const scaled = dBToPercent(transposed);
      channel.volume.value = scaled;
      setVolume(value);

      if (channel.name === "Channel") {
        currentTracks[trackIndex].volume = value;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
      }
      if (channel.name === "Volume") currentMix.bussesVolume[id] = value;
      if (channel.name === "Destination") currentMix.masterVolume = value;
    }
    // if (playbackState === "record") {
    //   localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
    //   localStorage.setItem("currentMix", JSON.stringify(currentMix));
    // }
  }

  return (
    <div className="channel">
      <div className="fx-toggle">
        <button
          disabled={disabled}
          name={trackIndex.toString()}
          className="button effect-select"
          onClick={toggleTrackFxModal}
        >
          {disabled ? "No" : trackFxOpen[trackIndex] ? "Close" : "Open"} FX
        </button>
        {fx(2).map((_, fxIndex) => {
          return (
            <div key={fxIndex}>
              <select
                id={trackIndex.toString()}
                onChange={(e) => selectFx(e, trackIndex, fxIndex)}
                className="effect-select"
                defaultValue={
                  currentMix.trackFxChoices[trackIndex]
                    ? currentMix.trackFxChoices[trackIndex][fxIndex]
                    : ""
                }
              >
                <option value="">{`FX${fxIndex + 1}`}</option>
                <option value="reverb">Reverb</option>
                <option value="delay">Delay</option>
                <option value="freq-shift">FrequencyShift</option>
                <option value="chebyshev">Chebyshev</option>
                <option value="pitch-shift">PitchShift</option>
              </select>
            </div>
          );
        })}

        <SoloMute
          index={trackIndex}
          currentTrack={currentTrack}
          channel={channel}
          handleSetIsMuted={handleSetIsMuted}
          isMuted={isMuted}
        />
        <TrackSend
          index={trackIndex}
          currentTrack={currentTrack}
          busChannels={busChannels}
          toggleBus={toggleBus}
        />
        <div className="fader-wrap">
          <Pan
            index={trackIndex}
            currentTrack={currentTrack}
            channel={channel}
          />
          <Fader
            channel={channel}
            volume={volume}
            changeVolume={changeVolume}
            currentTrack={currentTrack}
          />
          <form onChange={savePlaybackState} className="flex gap4">
            <div className="flex controls">
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type="radio"
                  id={`${trackIndex}-record`}
                  name="playback-state"
                  value="record"
                  defaultChecked={currentTrack.playbackState === "record"}
                />
                <label className="label" htmlFor={`${trackIndex}-record`}>
                  <div style={{ width: 10 }}>{recordIcon}</div>
                </label>
              </div>
            </div>
            <div className="flex controls">
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type="radio"
                  id={`${trackIndex}-playback`}
                  name="playback-state"
                  value="playback"
                  defaultChecked={currentTrack.playbackState === "playback"}
                />
                <label className="label" htmlFor={`${trackIndex}-playback`}>
                  <div style={{ width: 10 }}>{earIcon}</div>
                </label>
              </div>
            </div>
            <div className="flex controls">
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type="radio"
                  id={`${trackIndex}-free`}
                  name="playback-state"
                  value="free"
                  defaultChecked={currentTrack.playbackState === "free"}
                />
                <label className="label" htmlFor={`${trackIndex}-free`}>
                  F
                </label>
              </div>
            </div>
          </form>
          <div className="track-labels">
            <span className="track-name">{track.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}