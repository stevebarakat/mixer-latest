import { db } from "~/utils/db.server";

export async function getCurrentMix(mixId: string) {
  const currentMix = await db.mixSettings.findMany({
    where: { id: mixId },
  });
  return currentMix;
}

export async function getCurrentTracks(mixId: string) {
  const currentTracks = await db.trackSettings.findMany({
    where: {
      mixSettingsId: mixId,
    },
    orderBy: {
      position: "asc",
    },
  });
  return currentTracks;
}

export async function getRealTimeMix(mixId: string) {
  const realTimeMix = await db.realTimeMix.findFirst({
    where: {
      mixSettingsId: mixId,
    },
  });
  return realTimeMix;
}
