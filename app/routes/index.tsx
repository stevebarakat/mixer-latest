import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout/Layout";
import CommunityMixes from "~/components/CommunityMixes";
import { getSessionUser } from "~/utils/session.server";
import slugify from "react-slugify";
import { db } from "~/utils/db.server";
import { json, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getSessionUser(request);

  if (user) return redirect(`/${slugify(user.userName)}`);

  const publicMixesData = await db.mixSettings.findMany({
    include: { user: true },
  });

  const data = {
    publicMixesData,
  };
  return json(data);
};

export default function () {
  const data = useLoaderData();
  const publicMixesData = data.publicMixesData;

  return (
    <Layout>
      <CommunityMixes communityMixes={publicMixesData} />
    </Layout>
  );
}
