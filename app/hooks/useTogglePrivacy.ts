import { useState } from "react";
import { useFetcher, useMatches } from "@remix-run/react";

function useTogglePrivacy() {
  const fetcher = useFetcher();
  const matches = useMatches();
  const userMixes = matches[1].data.userMixes;

  const [isPrivate, setIsPrivate] = useState<boolean[]>(
    () =>
      userMixes.map((userMix: MixSettings) => userMix.private) ||
      new Array(userMixes.length).fill(true)
  );

  const togglePrivacy = (e: React.FormEvent<HTMLButtonElement>): void => {
    const selectedId = parseInt(e.currentTarget.id[0], 10);
    const mixIds = Object.keys(userMixes);

    mixIds.forEach((id, i) => {
      const mixId = parseInt(id, 10);
      if (mixId === selectedId) {
        isPrivate[mixId] = !isPrivate[mixId];
      }
      setIsPrivate([...isPrivate]);

      fetcher.submit(
        {
          actionName: "togglePrivacy",
          index: i.toString(),
          id: userMixes[selectedId].id,
          isPrivate: JSON.stringify(isPrivate),
        },
        { method: "post", action: "/userActions", replace: true }
      );
    });
  };
  return { isPrivate, togglePrivacy };
}

export default useTogglePrivacy;
