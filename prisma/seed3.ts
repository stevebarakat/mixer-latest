import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed3() {
  const song = await db.song.create({
    data: {
      title: "BlueMonday",
      slug: "blue-monday",
      artist: "New Order",
      year: "1986",
      studio: "Britannia Row",
      location: "London, England",
      start: 0,
      end: 490,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      name: "Drums 1",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/01-Drums-01.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Drums 2",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/02-Drums-02.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Drums 3",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/03-Drums-03.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Synth Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/04-Synth-Bass.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Bass Gtr",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/05-Real-Bass.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Synths 1",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/07-Synths-01.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Synths 2",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/08-Synths-02.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/blueMonday/06-Vocals.mp3",
    },
  });
}
