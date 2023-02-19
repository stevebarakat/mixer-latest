import type { ActionFunction } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const actionName = form.get("actionName");

  const mixSettingsString = form.get("currentMix");
  const mixSettings =
    typeof mixSettingsString === "string" && JSON.parse(mixSettingsString);

  const trackSettingsString = form.get("currentTracks");
  const trackSettings =
    typeof trackSettingsString === "string" && JSON.parse(trackSettingsString);

  const realTimeMixString = form.get("realTimeMix");
  const realTimeMix =
    typeof realTimeMixString === "string" && JSON.parse(realTimeMixString);

  switch (actionName) {
    case "saveMix":
      await db.mixSettings.update({
        where: {
          id: mixSettings.id,
        },
        data: {
          masterVolume: mixSettings.masterVolume,
          bussesVolume: mixSettings.bussesVolume,
          busFxChoices: mixSettings.busFxChoices,
          trackFxChoices: mixSettings.trackFxChoices,
          delaysMix: mixSettings.delaysMix,
          delaysTime: mixSettings.delaysTime,
          delaysFeedback: mixSettings.delaysFeedback,
          reverbsMix: mixSettings.reverbsMix,
          reverbsPreDelay: mixSettings.reverbsPreDelay,
          reverbsDecay: mixSettings.reverbsDecay,
          pitchShiftsMix: mixSettings.pitchShiftsMix,
          pitchShiftsSize: mixSettings.pitchShiftsSize,
          pitchShiftsPitch: mixSettings.pitchShiftsPitch,
          pitchShiftsDelayTime: mixSettings.pitchShiftsDelayTime,
          pitchShiftsFeedback: mixSettings.pitchShiftsFeedback,
          freqShiftsMix: mixSettings.freqShiftsMix,
          freqShiftsFreq: mixSettings.freqShiftsFreq,
          chebyshevsMix: mixSettings.chebyshevsMix,
          chebyshevsOrder: mixSettings.chebyshevsOrder,
        },
      });

      await trackSettings.forEach(
        async (track: TrackSettings) =>
          await db.trackSettings.update({
            where: {
              id: track.id,
            },
            data: {
              playbackState: track.playbackState,
              volume: track.volume,
              solo: track.solo,
              mute: track.mute,
              pan: track.pan,
              activeBusses: track.activeBusses,
              delaysMix: track.delaysMix,
              delaysTime: track.delaysTime,
              delaysFeedback: track.delaysFeedback,
              reverbsMix: track.reverbsMix,
              reverbsPreDelay: track.reverbsPreDelay,
              reverbsDecay: track.reverbsDecay,
              pitchShiftsMix: track.pitchShiftsMix,
              pitchShiftsSize: track.pitchShiftsSize,
              pitchShiftsPitch: track.pitchShiftsPitch,
              pitchShiftsDelayTime: track.pitchShiftsDelayTime,
              pitchShiftsFeedback: track.pitchShiftsFeedback,
              freqShiftsMix: track.freqShiftsMix,
              freqShiftsFreq: track.freqShiftsFreq,
              chebyshevsMix: track.chebyshevsMix,
              chebyshevsOrder: track.chebyshevsOrder,
            },
          })
      );
      break;

    case "saveRealTimeMix":
      await db.realTimeMix.update({
        where: {
          id: realTimeMix.id,
        },
        data: {
          mix: realTimeMix.mix,
        },
      });

      break;
    default:
      throw new Response(`Unknown action ${actionName}`, { status: 400 });
  }
  return null;
};
