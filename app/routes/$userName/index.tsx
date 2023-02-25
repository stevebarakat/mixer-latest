import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSessionUser } from "~/utils/session.server";
import { getRandomNumber } from "~/utils";
import UserMixes from "~/components/UserMixes";
import CommunityMixes from "~/components/CommunityMixes";
import SongSelect from "~/components/SongSelect";
import Layout from "~/components/Layout/Layout";
import slugify from "react-slugify";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({
  request,
  params: { userName },
}) => {
  const sessionUser = await getSessionUser(request);

  if (!sessionUser) {
    return redirect("/");
  } else if (slugify(sessionUser.userName) !== userName) {
    return redirect(`/${slugify(sessionUser.userName)}`);
  }
  const communityMixes = await db.mixSettings.findMany({
    where: {
      NOT: {
        userId: sessionUser.id,
      },
      AND: [{ private: false }],
    },
    include: {
      user: true,
    },
  });

  const userMixes = await db.mixSettings.findMany({
    where: { userId: sessionUser.id },
    include: { trackSettings: true },
    orderBy: {
      createdAt: "asc",
    },
  });

  const data = {
    sessionUser,
    userMixes,
    communityMixes,
  };
  return json(data);
};

export let action: ActionFunction = async ({ request }) => {
  const sessionUser = await getSessionUser(request);
  if (sessionUser === null) return;
  const form = await request.formData();
  const slug: FormDataEntryValue | null = form.get("slug");
  const mixName = `${slug}`;

  const sourceSong = await db.song.findFirst({
    where: {
      slug: slug as string,
    },
    include: { tracks: true },
  });

  const coverArt = getRandomNumber(1, 9) + ".svg";

  const mixSettings = await db.mixSettings.create({
    data: {
      userId: sessionUser.id,
      userName: sessionUser.userName,
      songSlug: slug as string,
      coverArt,
      mixName,
    },
  });

  await db.realTimeMix.create({
    data: {
      mix: [],
      mixSettingsId: mixSettings.id,
    },
  });

  sourceSong?.tracks.forEach(async (trackSettings, i) => {
    await db.trackSettings.create({
      data: {
        index: i,
        userId: sessionUser.id,
        trackSettingsId: trackSettings.id,
        mixSettingsId: mixSettings.id,
        songSlug: slug as string,
        mixName: mixSettings.mixName,
      },
    });
  });

  return redirect(
    `/${slugify(sessionUser?.userName)}/${mixName}/${mixSettings.id}`
  );
};

export default function DashboardRoute() {
  const { sessionUser, userMixes, communityMixes } = useLoaderData();

  return (
    <Layout>
      <SongSelect />
      <div className="vertical-gap">
        <UserMixes user={sessionUser} userMixes={userMixes} />
        <CommunityMixes communityMixes={communityMixes} />
      </div>
    </Layout>
  );
}
