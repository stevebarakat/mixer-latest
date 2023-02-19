import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed2() {
  const song1 = await db.song.create({
    data: {
      title: "A Day In The Life",
      slug: "a-day-in-the-life",
      artist: "The Beatles",
      year: "1967",
      studio: "Abby Road",
      location: "London, England",
      start: 0,
      end: 267,
    },
  });

  await db.track.create({
    data: {
      songId: song1.id,
      name: "Bass/Drums",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/bass-drums.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song1.id,
      name: "Instruments",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/instruments.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song1.id,
      name: "Orchestra",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/orchestra.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song1.id,
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/aDayInTheLife/vox.mp3",
    },
  });
}
