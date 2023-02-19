import { useFetcher, useLoaderData, useMatches } from "@remix-run/react";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import type { LoaderFunction } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import Layout from "~/components/Layout/Layout";
import { shareIcon } from "~/assets/shareIcon";
import { forkIcon } from "~/assets/forkIcon";
import { Link } from "@remix-run/react";
import { unSlugify } from "~/utils";
import slugify from "react-slugify";

export const loader: LoaderFunction = async ({
  request,
  params: { userName },
}) => {
  const { host } = new URL(request.url);

  const profile = await db.user.findUnique({
    where: { userName },
  });

  const userMixes = await db.mixSettings.findMany({
    where: { userId: profile?.id },
    include: { trackSettings: true },
    orderBy: {
      createdAt: "asc",
    },
  });

  const data = {
    userName,
    userMixes,
    host,
  };
  return json(data);
};

export default function () {
  const matches = useMatches();
  const sessionUser = matches[0].data.user;
  const fetcher = useFetcher();
  const { host, userName, userMixes } = useLoaderData();
  const { isCopied, copy } = useCopyToClipboard(
    userMixes.map(
      (userMix: MixSettings) =>
        `${host}/${slugify(userName)}/${userMix.songSlug}/${userMix.id}`
    )
  );

  const fork = (e: React.FormEvent<HTMLButtonElement>): void => {
    fetcher.submit(
      {
        actionName: "fork",
        mixSettingsId: e.currentTarget.id,
      },
      { method: "post", action: "/userActions", replace: true }
    );
  };
  return (
    <Layout>
      <div>
        <h2>{`${userName}'s`} Mixes</h2>
        <ol className="user-mix-list-container">
          {userMixes.map((userMix: MixSettings, i: number) => {
            const mixName = unSlugify(userMix.mixName);
            return (
              <li key={userMix.id}>
                <h3>{mixName}</h3>
                <div
                  className="user-mix-list hover-img"
                  style={{
                    backgroundImage: `url('assets/${userMix.coverArt}')`,
                  }}
                >
                  <figcaption>
                    <header>{mixName}</header>
                    <Link
                      key={userMix.userId}
                      title="Go to mix"
                      to={`/${slugify(userName)}/${userMix.songSlug}/${
                        userMix.id
                      }`}
                    >
                      <ul>
                        <li>Song: {userMix.title}</li>
                        <li>Artist: {userMix.artist}</li>
                        <li>Year: {userMix.year}</li>
                        <li>Studio: {userMix.studio}</li>
                        <li>Location: {userMix.location}</li>
                      </ul>
                    </Link>
                  </figcaption>
                  <div className="vertical-space-between">
                    <div>{mixName}</div>
                    <div>{mixName}</div>
                  </div>
                </div>

                <footer
                  style={{
                    padding: "0 12px",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <button
                    className="button link-btn"
                    id={`${i}-share`}
                    title="Copy Link"
                    onClick={copy}
                  >
                    {shareIcon}
                    {isCopied ? "Link Copied!" : "Share"}
                  </button>
                  {sessionUser && (
                    <button
                      className="button link-btn"
                      id={userMix.id}
                      title="Fork Mix"
                      onClick={fork}
                    >
                      {forkIcon} Fork
                    </button>
                  )}
                </footer>
              </li>
            );
          })}
        </ol>
      </div>
    </Layout>
  );
}
