import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed9() {
  const song = await db.song.create({
    data: {
      title: "Teenage Riot",
      slug: "teenage-riot",
      artist: "Sonic Youth",
      year: "1988",
      studio: "Greene St. Recording",
      location: "New York City, NY",
      start: 0,
      end: 420,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      name: "Kick",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/teenage-riot/01.kick.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Snare",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/teenage-riot/02.snare.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Room",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/teenage-riot/03.room.ogg?t=2023-01-06T13%3A18%3A29.620Z",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/teenage-riot/04.bass.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Guitar",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/teenage-riot/05.gtr.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/teenage-riot/06.vox.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Extras",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/teenage-riot/07.extra.ogg",
    },
  });
}
