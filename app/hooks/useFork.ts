import { useFetcher, useMatches } from "@remix-run/react";

function useFork() {
  const fetcher = useFetcher();
  const matches = useMatches();
  const sessionUser = matches[0].data.user;

  const forkMix = (e: React.FormEvent<HTMLButtonElement>): void => {
    if (!sessionUser) {
      alert("You must be logged in");
    } else {
      fetcher.submit(
        {
          actionName: "fork",
          mixSettingsId: e.currentTarget.id,
        },
        { method: "post", action: "/userActions", replace: true }
      );
    }
  };

  return forkMix;
}

export default useFork;
