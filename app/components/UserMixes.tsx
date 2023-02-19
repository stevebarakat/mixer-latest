import { Link } from "@remix-run/react";
import MixName from "~/components/MixName";
import useFork from "~/hooks/useFork";
import useDelete from "~/hooks/useDelete";
import useTogglePrivacy from "~/hooks/useTogglePrivacy";
import { forkIcon } from "~/assets/forkIcon";
import { deleteIcon } from "~/assets/deleteIcon";
import { lockIcon, unlockIcon } from "~/assets/lockIcons";
import { unSlugify } from "~/utils";
import slugify from "react-slugify";

type Props = {
  user: User;
  userMixes: MixSettings[];
};

function UserMixes({ user, userMixes }: Props) {
  const forkMix = useFork();
  const deleteMix = useDelete();
  const { isPrivate, togglePrivacy } = useTogglePrivacy();
  return (
    <div>
      {userMixes.length > 0 && <h2>Your Mixes</h2>}
      <ol className="community-mix-list-container">
        {userMixes.map((userMix: MixSettings, i: number) => {
          const mixName = unSlugify(userMix.mixName);
          return (
            <div key={userMix.id} className="card">
              <img src={`assets/${userMix.coverArt}`} alt="ERROR!" />
              <h3>{mixName}</h3>
              <div className="focus-content">
                <footer
                  style={{
                    padding: "0 12px",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <button
                    className="button"
                    id={i.toString()}
                    onClick={togglePrivacy}
                  >
                    {isPrivate[i] ? lockIcon : unlockIcon}
                  </button>
                  <button className="button" id={userMix.id} onClick={forkMix}>
                    {forkIcon}
                  </button>
                  <button
                    className="button"
                    id={i.toString()}
                    onClick={deleteMix}
                  >
                    {deleteIcon}
                  </button>
                  <MixName
                    i={i}
                    user={user}
                    userMix={userMix}
                    userMixes={userMixes}
                  />
                  <Link
                    to={`/${slugify(user.userName)}/${userMix.songSlug}/${
                      userMix.id
                    }`}
                  >
                    {unSlugify(userMix.mixName)}
                  </Link>
                </footer>
              </div>
            </div>
          );
        })}
      </ol>
    </div>
  );
}

export default UserMixes;
