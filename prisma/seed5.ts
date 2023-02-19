import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed5() {
  const song = await db.song.create({
    data: {
      title: "1901",
      slug: "nineteen-one",
      artist: "Phoenix",
      year: "2009",
      studio: "Motorbass",
      location: "Paris, France",
      start: 3,
      end: 192,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      name: "Drums L",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_drumsleft.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Drums R",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_drumsright.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Triggers",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_triggers.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_bass.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Gtr 1",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_gtr1.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Gtr 2",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_gtr2.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Keys",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_keys.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Synth 1",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_synth1.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Synth 2",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_synth2.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Siren",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_siren.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Lead Vox",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_leadvox.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Vox FX",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/1901/1901_voxfx.mp3",
    },
  });
}
