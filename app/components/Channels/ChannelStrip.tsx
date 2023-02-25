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
  handleSetTrackFxChoices: (arg: string[][]) => void;
  setPlaybackState: (arg: string) => void;
  playState: string;
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
  setPlaybackState,
  playState,
}: Props) {
  const fetcher = useFetcher();
  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

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

  // function selectFx(
  //   e: FormEvent<HTMLSelectElement>,
  //   busIndex: number,
  //   fxIndex: number
  // ) {
  //   trackFxChoices[busIndex][fxIndex] = e.currentTarget.value;
  //   handleSetTrackFxChoices([...trackFxChoices]);

  //   return updateCurrentMix({ trackFxChoices });
  // }
  const tempFxChoices = useRef<string[][] | null>(null);
  const selectFx = (e: FormEvent<HTMLSelectElement>, j: number, i: number) => {
    handleSetTrackFxChoices((currentFxChoices: string[][]) => {
      tempFxChoices.current = currentFxChoices.map((each: string[]) => [
        ...each,
      ]);
      tempFxChoices.current![j][i] = e.currentTarget.value;
      return tempFxChoices.current;
    });
  };

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
    saveMix(trackIndex, currentTracks[trackIndex].playbackState);

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

  console.log("currentTrack.playbackState", currentTrack.playbackState);

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
          <TrackFader
            index={trackIndex}
            channel={channel}
            currentTrack={currentTrack}
            currentTracks={currentTracks}
            isMuted={isMuted}
            playState={playState}
          />
          <div className="flex gap4">
            <div className="flex controls">
              <input
                type="radio"
                id={`${trackIndex}-record`}
                name={`${trackIndex}-playbackState`}
                value="record"
                onChange={savePlaybackState}
                checked={currentTrack.playbackState === "record"}
              />
              <label className="label" htmlFor={`${trackIndex}-record`}>
                <div style={{ width: 10 }}>{recordIcon}</div>
              </label>
            </div>
            <div className="flex controls">
              <input
                type="radio"
                id={`${trackIndex}-playback`}
                name={`${trackIndex}-playbackState`}
                value="playback"
                onChange={savePlaybackState}
                checked={currentTrack.playbackState === "playback"}
              />
              <label className="label" htmlFor={`${trackIndex}-playback`}>
                <div style={{ width: 10 }}>{earIcon}</div>
              </label>
            </div>
            <div className="flex controls">
              <input
                type="radio"
                id={`${trackIndex}-free`}
                name={`${trackIndex}-playbackState`}
                value="free"
                onChange={savePlaybackState}
                checked={currentTrack.playbackState === "free"}
              />
              <label className="label" htmlFor={`${trackIndex}-free`}>
                F
              </label>
            </div>
          </div>
          <span style={{ color: "#232323" }}>{currentTrack.playbackState}</span>
          <div className="track-labels">
            <span className="track-name">{track.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
