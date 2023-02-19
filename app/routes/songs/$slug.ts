import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params: { slug } }) => {
  const song = await db.song.findFirst({
    where: { slug },
    include: { tracks: true },
  });
  if (!song) throw new Error("Song not found");
  const data = { song };
  return json(data);
};
