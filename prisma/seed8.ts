import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed8() {
  const song = await db.song.create({
    data: {
      title: "Scar Tissue",
      slug: "scar-tissue",
      artist: "Red Hot Chili Peppers",
      year: "1999",
      studio: "Cello",
      location: "Los Angeles, CA",
      start: 0,
      end: 218,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      name: "Kick",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/scar-tissue/01.kick.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Snare",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/scar-tissue/02.snare.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Room",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/scar-tissue/03.room.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/scar-tissue/04.bass.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Guitar",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/scar-tissue/05.gtr.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/scar-tissue/06.vox.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Extras",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/scar-tissue/07.extras.ogg",
    },
  });
}
