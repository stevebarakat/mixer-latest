import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed13() {
  const song = await db.song.create({
    data: {
      title: "Let Love Rule",
      slug: "let-love-rule",
      artist: "Lenny Kravitz",
      year: "1989",
      studio: "Waterfront Studios",
      location: "Hoboken, NJ",
      start: 0,
      end: 345,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      name: "Kick",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/let-love-rule/01.kick.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Snare",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/let-love-rule/02.snare.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Room",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/let-love-rule/03.room.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/let-love-rule/04.bass.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Guitar",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/let-love-rule/05.gtr.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/let-love-rule/06.vox.ogg",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Extras",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/let-love-rule/07.extra.ogg",
    },
  });
}
