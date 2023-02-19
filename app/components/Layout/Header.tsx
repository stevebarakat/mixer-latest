import { Link, useMatches, useFetcher } from "@remix-run/react";
import useFork from "~/hooks/useFork";
import useLike from "~/hooks/useLike";
import { forkIcon } from "~/assets/forkIcon";
import { heart } from "~/assets/heart";
import { saveIcon } from "~/assets/saveIcon";
import logo from "~/assets/logo";

function Header() {
  const fetcher = useFetcher();
  const matches = useMatches();
  const forkMix = useFork();
  const likeMix = useLike();
  const sessionUser = matches[0].data.user;
  const currentMix = matches[1].data.currentMix;

  const saveMix = () => {
    fetcher.submit(
      {
        actionName: "saveMix",
        currentMix: localStorage.getItem("currentMix")!,
        currentTracks: localStorage.getItem("currentTracks")!,
      },
      { method: "post", action: "/saveMix", replace: true }
    );
  };

  const menu = () => {
    const privateMix = (
      <div style={{ display: "flex" }}>
        <button id={currentMix.id} className="button colored" onClick={forkMix}>
          <div>{forkIcon}</div>
          <span>Fork</span>
        </button>
        <button className="button colored" onClick={saveMix}>
          <div>{saveIcon}</div>
          <span>Save</span>
        </button>
      </div>
    );

    const publicMix = (
      <div style={{ display: "flex" }}>
        <button onClick={likeMix} className="button colored">
          <div className="likes">
            {heart}
            <span>{currentMix.likes}</span>
          </div>
          <span>Like</span>
        </button>
        <button id={currentMix.id} className="button colored" onClick={forkMix}>
          <div>{forkIcon}</div>
          <span>Fork</span>
        </button>
      </div>
    );

    return sessionUser?.userName === currentMix?.userName
      ? privateMix
      : publicMix;
  };

  return (
    <div className="header-wrap">
      <nav className="top-nav">
        <Link to="/index?">{logo}</Link>
        {currentMix ? menu() : null}
        <ul>
          {sessionUser ? (
            <>
              <li>
                <Link to="/index?">Dashboard</Link>
              </li>
              <li>
                <form action="/logout" method="post">
                  <button type="submit" className="link-btn">
                    Logout
                  </button>
                </form>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/index?">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
