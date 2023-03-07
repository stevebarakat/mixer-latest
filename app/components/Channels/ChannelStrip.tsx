import { useState, useRef } from "react";
import { array as fx } from "~/utils";
import { useFetcher } from "@remix-run/react";
import type { FormEvent } from "react";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import TrackFader from "./TrackFader";
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
  handleSetTrackFxChoices: (
    arg: (currentTrackFxChoices: string[][]) => string[][]
  ) => void;
  playState: string;
  loop: React.MutableRefObject<Loop>;
};

export default function ChannelStrip({
  trackIndex,
  track,
  channel,
  toggleBus,
  busChannels,
  currentTrack,
  // currentTracks,
  trackFxChoices,
  handleSetTrackFxChoices,
  trackFxOpen,
  handleSetTrackFxOpen,
  playState,
  loop,
}: Props) {
  const fetcher = useFetcher();
  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

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

  const selectFx = (
    e: React.FormEvent<HTMLSelectElement>,
    j: number,
    i: number
  ) => {
    let tempFxChoices: string[][] | null;
    // TODO ts
    handleSetTrackFxChoices((currentTrackFxChoices: string[][]) => {
      tempFxChoices = currentTrackFxChoices.map((choice: string[]) => [
        ...choice,
      ]);
      tempFxChoices[j][i] = e.currentTarget.value;
      return tempFxChoices;
    });

    trackFxChoices?.forEach(() => {
      localStorage.setItem(
        "currentMix",
        JSON.stringify({
          ...currentMix,
          trackFxChoices: tempFxChoices,
        })
      );
    });
  };

  const saveMix = (index: number, playbackMode?: PlaybackMode) => {
    const currentTracksString = localStorage.getItem("currentTracks");
    const currentTracksParsed =
      currentTracksString && JSON.parse(currentTracksString);

    switch (currentTracks[trackIndex].param) {
      case "volume":
        currentTracksParsed[index].playbackMode.volume = playbackMode?.volume;

        currentTracksParsed[index].playbackMode.pan = playbackMode?.pan;
        break;
      case "pan":
        currentTracksParsed[index].playbackMode.pan = playbackMode?.pan;
        break;
      default:
        break;
    }
    fetcher.submit(
      {
        actionName: "savePlaybackMode",
        playbackMode: JSON.stringify(currentTracksParsed[index].playbackMode),
      },
      { method: "post", action: "/saveMix", replace: true }
    );
    localStorage.setItem(
      "playbackMode",
      JSON.stringify(currentTracksParsed[index].playbackMode)
    );
  };

  function savePlaybackState(e: React.SyntheticEvent) {
    const target = e.target as HTMLButtonElement;
    const trackIndex = parseInt(target.id[0], 10);

    switch (currentTracks[trackIndex].param) {
      case "volume":
        currentTracks[trackIndex].playbackMode.volume = target.value;
        break;
      case "pan":
        currentTracks[trackIndex].playbackMode.pan = target.value;
        break;
      default:
        break;
    }

    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));

    saveMix(trackIndex, currentTracks[trackIndex].playbackMode);
  }

  console.log(
    "currentTracks[trackIndex].param",
    currentTracks[trackIndex].param
  );

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
                id={fxIndex.toString()}
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
          <TrackFader
            index={trackIndex}
            channel={channel}
            currentTrack={currentTrack}
            currentTracks={currentTracks}
            isMuted={isMuted}
            playState={playState}
            loop={loop}
          />
          <div className="flex gap4">
            <div className="flex controls">
              <input
                type="radio"
                id={`${trackIndex}-record`}
                name={`${trackIndex}-playbackMode`}
                value="record"
                onChange={savePlaybackState}
                checked={
                  currentTracks[trackIndex].param === "volume"
                    ? currentTracks[trackIndex].playbackMode.volume === "record"
                    : currentTracks[trackIndex].playbackMode.pan === "record"
                }
              />
              <label className="label" htmlFor={`${trackIndex}-record`}>
                <div style={{ width: 10 }}>{recordIcon}</div>
              </label>
            </div>
            <div className="flex controls">
              <input
                type="radio"
                id={`${trackIndex}-playback`}
                name={`${trackIndex}-playbackMode`}
                value="playback"
                onChange={savePlaybackState}
                checked={
                  currentTracks[trackIndex].param === "volume"
                    ? currentTracks[trackIndex].playbackMode.volume ===
                      "playback"
                    : currentTracks[trackIndex].playbackMode.pan === "playback"
                }
              />
              <label className="label" htmlFor={`${trackIndex}-playback`}>
                <div style={{ width: 10 }}>{earIcon}</div>
              </label>
            </div>
            <div className="flex controls">
              <input
                type="radio"
                id={`${trackIndex}-free`}
                name={`${trackIndex}-playbackMode`}
                value="free"
                onChange={savePlaybackState}
                checked={
                  currentTracks[trackIndex].param === "volume"
                    ? currentTracks[trackIndex].playbackMode.volume === "free"
                    : currentTracks[trackIndex].playbackMode.pan === "free"
                }
              />
              <label className="label" htmlFor={`${trackIndex}-free`}>
                F
              </label>
            </div>
          </div>
          <span style={{ color: "#232323" }}>
            {currentTracks[trackIndex].playbackMode.volume}
          </span>
          <div>
            <select
              id={trackIndex.toString()}
              onChange={(e) => {
                currentTracks[trackIndex].param = e.target.value;

                fetcher.submit(
                  {
                    actionName: "saveMix",
                    currentMix: localStorage.getItem("currentMix")!,
                    currentTracks: JSON.stringify(currentTracks),
                  },
                  { method: "post", action: "/saveMix", replace: true }
                );

                localStorage.setItem(
                  "currentTracks",
                  JSON.stringify([...currentTracks])
                );
              }}
              className="effect-select"
              value={currentTracks[trackIndex].param}
            >
              <option value="volume">Volume</option>
              <option value="pan">Pan</option>
            </select>
          </div>
          <div className="track-labels">
            <span className="track-name">{track.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
