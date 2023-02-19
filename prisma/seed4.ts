import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}

// prisma/seed.ts
export async function seed4() {
  const song = await db.song.create({
    data: {
      title: "Borderline",
      slug: "borderline",
      artist: "Madonna",
      year: "1983",
      studio: "Sigma Sound",
      location: "New York City, NY",
      start: 0,
      end: 382,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      name: "Kick",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/1-Borderline-Foot.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Snare",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/2-Borderline-Snare.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "HiHat",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/3-Borderline-Sock.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Toms",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/4-Borderline-Toms.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Guitar",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/6-Reggies-Guitar-(stereo).mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Arp Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/7-Borderline-Arp-Bass.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/8-Borderline-Bass-odub.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Rhodes",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/9-Borderline-Rhodes.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Horns",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/10-Prophet-Horns-(stereo).mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Harpsichord",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/12-Bridge-Synth-Harpsichord.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Synth 1",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/13-Synth-Figure-Intro-after-1st-Chorus.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Synth 2",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/14-Synth-Wind.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Lead Vox 1",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/16-Lead-Vox.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Lead Vox 2",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/15-Lead-Vox-scratch.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Strings",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/17-Strings-(stereo).mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Piano",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/18-Piano-(stereo).mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      name: "Back Vox",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/borderline/21-Background-Vox-(stereo).mp3",
    },
  });
}
