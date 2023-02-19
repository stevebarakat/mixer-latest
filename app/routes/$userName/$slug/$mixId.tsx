import { useEffect } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import slugify from "react-slugify";
import Mixer from "~/components/Mixer";
import Layout from "~/components/Layout/Layout";
import {
  getCurrentMix,
  getCurrentTracks,
  getRealTimeMix,
} from "~/utils/controls.server";

export const loader: LoaderFunction = async ({
  params: { userName, mixId },
}) => {
  if (typeof mixId !== "string") return redirect(`/${slugify(userName)}`);

  const currentMixArray = await getCurrentMix(mixId);
  const currentMix = currentMixArray[0];
  const currentTracks = await getCurrentTracks(mixId);
  const realTimeMix = await getRealTimeMix(mixId);

  if (currentMix === undefined) return redirect(`/${slugify(userName)}`);

  const data = {
    currentTracks,
    currentMix,
    realTimeMix,
  };
  return json(data);
};

export default function MixNameRoute() {
  const fetcher = useFetcher();
  const songQuery = fetcher.data?.song;
  const { currentMix, currentTracks, realTimeMix } = useLoaderData();

  // resource route for loading server data
  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(`/songs/${currentMix.songSlug}`);
      localStorage.setItem("currentMix", JSON.stringify(currentMix));
      localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
      localStorage.setItem("realTimeMix", JSON.stringify(realTimeMix));
    }
  }, [fetcher, currentMix, currentTracks, realTimeMix]);

  return (
    songQuery !== undefined && (
      <Layout>
        <Mixer song={songQuery} />
      </Layout>
    )
  );
}
