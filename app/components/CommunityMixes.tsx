import { Link } from "@remix-run/react";
import slugify from "react-slugify";
import { unSlugify } from "~/utils";
import { userIcon } from "~/assets/userIcon";
import { forkIcon } from "~/assets/forkIcon";
import useFork from "~/hooks/useFork";

type Props = {
  communityMixes: MixSettings[];
};

function CommunityMixes({ communityMixes }: Props) {
  const user = communityMixes.map((communityMix) => communityMix.userName);
  const forkMix = useFork();

  return (
    <div>
      {communityMixes.length > 0 && <h2>Community Mixes</h2>}
      <ol className="community-mix-list-container">
        {communityMixes.map((communityMix: MixSettings, i: number) => {
          const defaultValue = `${communityMix.mixName} `;
          return (
            <li key={communityMix.songSlug}>
              <h4>{unSlugify(defaultValue)}</h4>
              <div
                className="community-mix-list hover-img"
                style={{
                  backgroundImage: `url('assets/${communityMix.coverArt}')`,
                }}
              >
                <figcaption>
                  <header>{unSlugify(defaultValue)}</header>
                  <Link
                    key={communityMix.id}
                    title="Go to mix"
                    to={`/${slugify(user)}/${communityMix.songSlug}/${
                      communityMix.id
                    }`}
                  >
                    <ul>
                      <li>Song: {communityMix.title}</li>
                      <li>Artist: {communityMix.artist}</li>
                      <li>Year: {communityMix.year}</li>
                      <li>Studio: {communityMix.studio}</li>
                      <li>Location: {communityMix.location}</li>
                    </ul>
                  </Link>
                </figcaption>
                <div className="vertical-space-between">
                  <Link
                    to={`/${slugify(user[i])}/${communityMix.songSlug}/${
                      communityMix.id
                    }`}
                  >
                    {`${unSlugify(defaultValue)}`}
                  </Link>
                  {user[i]}
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
                  className="button"
                  id={communityMix.id}
                  onClick={forkMix}
                >
                  {forkIcon}
                </button>
                <Link className="button" to={`/${user[i]}/profile`}>
                  {userIcon}
                </Link>
              </footer>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default CommunityMixes;
