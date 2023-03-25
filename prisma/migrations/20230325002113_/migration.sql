-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realTimeMix" (
    "id" TEXT NOT NULL,
    "mix" JSONB NOT NULL DEFAULT '[]',
    "mixSettingsId" TEXT NOT NULL,

    CONSTRAINT "realTimeMix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybackMode" (
    "id" TEXT NOT NULL,
    "volume" TEXT NOT NULL DEFAULT 'free',
    "pan" TEXT NOT NULL DEFAULT 'free',
    "trackSettingsId" TEXT NOT NULL,

    CONSTRAINT "PlaybackMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixSettings" (
    "id" TEXT NOT NULL,
    "songSlug" TEXT NOT NULL,
    "artistPhoto" TEXT NOT NULL DEFAULT 'default',
    "coverArt" TEXT NOT NULL DEFAULT '0',
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" TEXT DEFAULT 'unknown',
    "studio" TEXT DEFAULT 'unknown',
    "location" TEXT DEFAULT 'unknown',
    "mixName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "masterVolume" DOUBLE PRECISION NOT NULL DEFAULT -32,
    "bussesVolume" DOUBLE PRECISION[] DEFAULT ARRAY[-100, -100]::DOUBLE PRECISION[],
    "busFxChoices" JSONB NOT NULL DEFAULT '[[],[]]',
    "trackFxChoices" JSONB NOT NULL DEFAULT '[]',
    "delaysMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "delaysTime" DOUBLE PRECISION[] DEFAULT ARRAY[1, 1, 1, 1]::DOUBLE PRECISION[],
    "delaysFeedback" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "reverbsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "reverbsPreDelay" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "reverbsDecay" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsPitch" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsDelayTime" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsSize" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsFeedback" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "chebyshevsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "chebyshevsOrder" INTEGER[] DEFAULT ARRAY[50, 50, 50, 50]::INTEGER[],
    "freqShiftsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "freqShiftsFreq" INTEGER[] DEFAULT ARRAY[2000, 2000, 2000, 2000]::INTEGER[],
    "compressorsThreshold" INTEGER[] DEFAULT ARRAY[-50, -50, -50, -50]::INTEGER[],
    "compressorsRatio" DOUBLE PRECISION[] DEFAULT ARRAY[10, 10, 10, 10]::DOUBLE PRECISION[],
    "compressorsKnee" DOUBLE PRECISION[] DEFAULT ARRAY[20, 20, 20, 20]::DOUBLE PRECISION[],
    "compressorsAttack" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "compressorsRelease" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5, 0.5, 0.5]::DOUBLE PRECISION[],
    "private" BOOLEAN NOT NULL DEFAULT false,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MixSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackSettings" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "position" SERIAL NOT NULL,
    "mixName" TEXT NOT NULL,
    "trackSettingsId" TEXT NOT NULL,
    "mixSettingsId" TEXT NOT NULL,
    "songSlug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "param" TEXT NOT NULL DEFAULT 'volume',
    "volume" DOUBLE PRECISION NOT NULL DEFAULT -32,
    "solo" BOOLEAN NOT NULL DEFAULT false,
    "mute" BOOLEAN NOT NULL DEFAULT false,
    "pan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activeBusses" BOOLEAN[] DEFAULT ARRAY[false, false]::BOOLEAN[],
    "eqHi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "eqMid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "eqLow" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "delaysMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "delaysTime" DOUBLE PRECISION[] DEFAULT ARRAY[1, 1]::DOUBLE PRECISION[],
    "delaysFeedback" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "reverbsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "reverbsPreDelay" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "reverbsDecay" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsPitch" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsDelayTime" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsSize" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "pitchShiftsFeedback" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "chebyshevsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "chebyshevsOrder" INTEGER[] DEFAULT ARRAY[50, 50]::INTEGER[],
    "freqShiftsMix" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "freqShiftsFreq" INTEGER[] DEFAULT ARRAY[2000, 2000]::INTEGER[],
    "compressorsThreshold" INTEGER[] DEFAULT ARRAY[-50, -50]::INTEGER[],
    "compressorsRatio" DOUBLE PRECISION[] DEFAULT ARRAY[10, 10]::DOUBLE PRECISION[],
    "compressorsKnee" DOUBLE PRECISION[] DEFAULT ARRAY[20, 20]::DOUBLE PRECISION[],
    "compressorsAttack" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "compressorsRelease" DOUBLE PRECISION[] DEFAULT ARRAY[0.5, 0.5]::DOUBLE PRECISION[],
    "playbackModeId" TEXT NOT NULL,

    CONSTRAINT "TrackSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" TEXT NOT NULL DEFAULT 'unknown',
    "studio" TEXT NOT NULL DEFAULT 'unknown',
    "location" TEXT NOT NULL DEFAULT 'unknown',
    "bpm" INTEGER NOT NULL DEFAULT 100,
    "start" INTEGER NOT NULL DEFAULT 0,
    "end" INTEGER NOT NULL DEFAULT 500,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Song_slug_key" ON "Song"("slug");

-- AddForeignKey
ALTER TABLE "realTimeMix" ADD CONSTRAINT "realTimeMix_mixSettingsId_fkey" FOREIGN KEY ("mixSettingsId") REFERENCES "MixSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MixSettings" ADD CONSTRAINT "MixSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackSettings" ADD CONSTRAINT "TrackSettings_playbackModeId_fkey" FOREIGN KEY ("playbackModeId") REFERENCES "PlaybackMode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackSettings" ADD CONSTRAINT "TrackSettings_mixSettingsId_fkey" FOREIGN KEY ("mixSettingsId") REFERENCES "MixSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackSettings" ADD CONSTRAINT "TrackSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
