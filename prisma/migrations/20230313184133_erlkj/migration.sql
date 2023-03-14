/*
  Warnings:

  - You are about to drop the column `playbackState` on the `TrackSettings` table. All the data in the column will be lost.
  - Added the required column `playbackModeId` to the `TrackSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MixSettings" ALTER COLUMN "bussesVolume" SET DEFAULT ARRAY[-100, -100]::DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "TrackSettings" DROP COLUMN "playbackState",
ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "param" TEXT NOT NULL DEFAULT 'volume',
ADD COLUMN     "playbackModeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PlaybackMode" (
    "id" TEXT NOT NULL,
    "volume" TEXT NOT NULL DEFAULT 'free',
    "pan" TEXT NOT NULL DEFAULT 'free',
    "trackChebyshevsMix" TEXT NOT NULL DEFAULT 'free',
    "trackSettingsId" TEXT NOT NULL,

    CONSTRAINT "PlaybackMode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrackSettings" ADD CONSTRAINT "TrackSettings_playbackModeId_fkey" FOREIGN KEY ("playbackModeId") REFERENCES "PlaybackMode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
