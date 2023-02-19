import {
  Reverb,
  PitchShift,
  Chebyshev,
  FeedbackDelay,
  FrequencyShifter,
} from "tone";
import Delay from "../components/FX/Delay";
import Reverber from "../components/FX/Reverb";
import FreqShift from "../components/FX/FreqShift";
import PitchShifter from "../components/FX/PitchShift";
import Chebyshever from "../components/FX/Chebyshev";

type Props = {
  fxChoices: string[][];
  currentMix: MixSettings;
  currentTracks: TrackSettings[];
  channelType: string;
};

export default function useFxType({
  fxChoices,
  currentMix,
  currentTracks,
  channelType,
}: Props) {
  const fxTypes: FxType[][] = (() => {
    let types: FxType[][] = [];
    currentTracks.map((_, i) => (types[i] = []));
    return types;
  })();

  const fxControls: JSX.Element[][] = (() => {
    let controls: JSX.Element[][] = [];
    currentTracks.map((_, i) => (controls[i] = []));
    return controls;
  })();

  fxChoices.forEach((fxChoice: string[], j: number) => {
    fxChoice.forEach((choice, i) => {
      switch (choice) {
        case "":
          break;

        case "reverb":
          const reverbsMix =
            channelType === "bus"
              ? currentMix.reverbsMix
              : currentTracks[j].reverbsMix;
          const reverbsDecay =
            channelType === "bus"
              ? currentMix.reverbsDecay
              : currentTracks[j].reverbsDecay;
          const reverbsPreDelay =
            channelType === "bus"
              ? currentMix.reverbsPreDelay
              : currentTracks[j].reverbsPreDelay;

          fxTypes[j][i] = new Reverb({
            wet: reverbsMix[i],
            decay: reverbsDecay[i],
            preDelay: reverbsPreDelay[i],
          });

          fxControls[j][i] = (
            <Reverber
              key={`reverb-${currentMix.id}`}
              controls={fxTypes[j][i]}
              currentTrack={currentTracks[i]}
              currentTracks={currentTracks}
              currentMix={currentMix}
              channelType={channelType}
              index={channelType === "track" ? i : i + j + j}
            />
          );
          break;
        case "delay":
          const delaysMix =
            channelType === "bus"
              ? currentMix.delaysMix
              : currentTracks[j].delaysMix;
          const delaysTime =
            channelType === "bus"
              ? currentMix.delaysTime
              : currentTracks[j].delaysTime;
          const delaysFeedback =
            channelType === "bus"
              ? currentMix.delaysFeedback
              : currentTracks[j].delaysFeedback;

          fxTypes[j][i] = new FeedbackDelay({
            wet: delaysMix[i],
            delayTime: delaysTime[i],
            feedback: delaysFeedback[i],
          });

          fxControls[j][i] = (
            <Delay
              key={`delay-${currentMix.id}`}
              controls={fxTypes[j][i]}
              currentTrack={currentTracks[i]}
              currentTracks={currentTracks}
              currentMix={currentMix}
              channelType={channelType}
              index={channelType === "track" ? i : i + j + j}
            />
          );
          break;
        case "freq-shift":
          const freqShiftsMix =
            channelType === "bus"
              ? currentMix.freqShiftsMix
              : currentTracks[j].freqShiftsMix;

          const freqShiftsFreq =
            channelType === "bus"
              ? currentMix.freqShiftsFreq
              : currentTracks[j].freqShiftsFreq;

          fxTypes[j][i] = new FrequencyShifter({
            wet: freqShiftsMix[i],
            frequency: freqShiftsFreq[i],
          });

          fxControls[j][i] = (
            <FreqShift
              key={`freq-${currentMix.id}`}
              controls={fxTypes[j][i]}
              currentTrack={currentTracks[i]}
              currentTracks={currentTracks}
              currentMix={currentMix}
              channelType={channelType}
              index={channelType === "track" ? i : i + j + j}
            />
          );
          break;
        case "chebyshev":
          const chebyshevsMix =
            channelType === "bus"
              ? currentMix.chebyshevsMix
              : currentTracks[j].chebyshevsMix;

          const chebyshevsOrder =
            channelType === "bus"
              ? currentMix.chebyshevsOrder
              : currentTracks[j].chebyshevsOrder;

          fxTypes[j][i] = new Chebyshev({
            wet: chebyshevsMix[i],
            order: chebyshevsOrder[i],
          });

          fxControls[j][i] = (
            <Chebyshever
              key={`cheby-${currentMix.id}`}
              controls={fxTypes[j][i]}
              currentTrack={currentTracks[i]}
              currentTracks={currentTracks}
              currentMix={currentMix}
              channelType={channelType}
              index={channelType === "track" ? i : i + j + j}
            />
          );
          break;
        case "pitch-shift":
          const pitchShiftsMix =
            channelType === "bus"
              ? currentMix.pitchShiftsMix
              : currentTracks[j].pitchShiftsMix;

          const pitchShiftsPitch =
            channelType === "bus"
              ? currentMix.pitchShiftsPitch
              : currentTracks[j].pitchShiftsPitch;

          const pitchShiftsDelayTime =
            channelType === "bus"
              ? currentMix.pitchShiftsDelayTime
              : currentTracks[j].pitchShiftsDelayTime;

          const pitchShiftsSize =
            channelType === "bus"
              ? currentMix.pitchShiftsSize
              : currentTracks[j].pitchShiftsSize;

          const pitchShiftsFeedback =
            channelType === "bus"
              ? currentMix.pitchShiftsFeedback
              : currentTracks[j].pitchShiftsFeedback;

          fxTypes[j][i] = new PitchShift({
            wet: pitchShiftsMix[i],
            pitch: pitchShiftsPitch[i],
            delayTime: pitchShiftsDelayTime[i],
            windowSize: pitchShiftsSize[i],
            feedback: pitchShiftsFeedback[i],
          });

          fxControls[j][i] = (
            <PitchShifter
              key={`pitch-${currentMix.id}`}
              controls={fxTypes[j][i]}
              currentTrack={currentTracks[i]}
              currentTracks={currentTracks}
              currentMix={currentMix}
              channelType={channelType}
              index={channelType === "track" ? i : i + j + j}
            />
          );
          break;

        default:
          break;
      }
    });
  });

  return [fxTypes, fxControls];
}
