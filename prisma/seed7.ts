import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed7() {
  const song = await db.song.create({
    data: {
      title: "Semi-Charmed Life",
      slug: "semi-charmed-life",
      artist: "Third Eye Blind",
      year: "1997",
      studio: "Skywalker Sound",
      location: "Lucas Valley, CA",
      start: 0,
      end: 380,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      name: "Kick",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/semiCharmedLife/01.kick.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Snare",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/semiCharmedLife/02.snare.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Room",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/semiCharmedLife/03.room.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/semiCharmedLife/04.bass.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Guitar",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/semiCharmedLife/05.gtr.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/semiCharmedLife/06.extras.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Backup Vox",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/semiCharmedLife/07.vox.mp3",
    },
  });
}
