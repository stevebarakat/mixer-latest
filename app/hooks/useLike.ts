import { useFetcher, useMatches } from "@remix-run/react";

function useLike() {
  const fetcher = useFetcher();
  const matches = useMatches();
  const sessionUser = matches[0].data.user;

  const currentMix = matches[1].data.currentMix;

  const updateLikes = () => {
    const likesInt = currentMix.likes + 1;
    const likes = likesInt.toString();

    if (!sessionUser) {
      alert("You must be logged in");
    } else {
      fetcher.submit(
        {
          actionName: "updateLikes",
          id: currentMix.id,
          likes,
        },
        { method: "post", action: "/userActions", replace: true }
      );
    }
  };
  return updateLikes;
}

export default useLike;
