import { updateCurrentMix, array as fx } from "~/utils";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useMatches } from "@remix-run/react";
import Fader from "./Fader";
import { dBToPercent, transpose } from "~/utils/scale";

type Props = {
  busIndex: number;
  busChannel: Volume;
  busFxChoices: string[][];
  busFxOpen: boolean[];
  handleSetBusFxOpen: (arg: boolean[]) => void;
  handleSetBusFxChoices: (arg: string[][]) => void;
};

function BusReceive({
  busIndex,
  busChannel,
  busFxOpen,
  handleSetBusFxOpen,
  busFxChoices,
  handleSetBusFxChoices,
}: Props) {
  const matches = useMatches();

  const currentMix = matches[1].data.currentMix;
  const currentTracks = matches[1].data.currentTracks;

  const [volume, setVolume] = useState(() => currentMix.bussesVolume[busIndex]);

  const [disabled, setDisabled] = useState(true);
  const isDisabled = currentTracks.every(
    (track: TrackSettings) => track.activeBusses[busIndex] === false
  );

  useEffect(() => {
    setDisabled(
      busFxChoices.every((_: string[], i: number) => {
        return !busFxChoices[busIndex][i];
      })
    );
  }, [busFxChoices, busIndex, setDisabled]);

  function toggleFxModal(e: React.MouseEvent<HTMLButtonElement>): void {
    const busIndex = parseInt(e.currentTarget.name, 10);
    busFxOpen[busIndex] = !busFxOpen[busIndex];
    handleSetBusFxOpen([...busFxOpen]);
  }

  function selectFx(
    e: FormEvent<HTMLSelectElement>,
    busIndex: number,
    fxIndex: number
  ) {
    busFxChoices[busIndex][fxIndex] = e.currentTarget.value;
    handleSetBusFxChoices([...busFxChoices]);

    return updateCurrentMix({ busFxChoices });
  }

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    const id = parseInt(e.currentTarget.id);
    // setTrackIndex(id);
    const value = parseFloat(e.currentTarget.value);
    const transposed = transpose(value);
    const scaled = dBToPercent(transposed);
    busChannel.volume.value = scaled;
    setVolume(value);
    currentMix.bussesVolume[id] = value;
  }

  return (
    <div className="activeBusses-wrap">
      <div className="fx-toggle">
        <button
          disabled={
            disabled ||
            currentTracks.every(
              (currentTrack: TrackSettings, i: number) =>
                currentTrack.activeBusses[i] === false
            )
          }
          name={busIndex.toString()}
          className="button effect-select"
          onClick={toggleFxModal}
        >
          {disabled ? "No" : busFxOpen[busIndex] ? "Close" : "Open"} FX
        </button>
        {fx(2).map((_, fxIndex) => (
          <div key={fxIndex}>
            <select
              id={busIndex.toString()}
              onChange={(e) => selectFx(e, busIndex, fxIndex)}
              className="effect-select"
              defaultValue={currentMix.busFxChoices[busIndex][fxIndex]}
              disabled={isDisabled}
            >
              <option value="">{`FX${fxIndex + 1}`}</option>
              <option value="reverb">Reverb</option>
              <option value="delay">Delay</option>
              <option value="freq-shift">FrequencyShift</option>
              <option value="chebyshev">Chebyshev</option>
              <option value="pitch-shift">PitchShift</option>
            </select>
          </div>
        ))}
      </div>
      <div className="fader-wrap">
        <div className="fader-wrap">
          <Fader
            channel={busChannel}
            volume={volume}
            changeVolume={changeVolume}
            currentTrack={currentTracks[busIndex]}
          />
        </div>
        <div className="track-labels">
          <span className="track-name">Bus {busIndex + 1}</span>
        </div>
      </div>
    </div>
  );
}

export default BusReceive;
