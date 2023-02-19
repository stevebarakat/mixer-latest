import { useRef } from "react";
import { useMatches, useFetcher } from "@remix-run/react";

type Props = {
  index: number;
  currentTrack: TrackSettings;
  busChannels: Volume[];
  toggleBus: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function TrackSend({ index, currentTrack, busChannels, toggleBus }: Props) {
  const matches = useMatches();
  const fetcher = useFetcher();
  const currentTracks = matches[1].data.currentTracks;
  const actives = useRef(currentTracks[index].activeBusses || [false, false]);

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

  const updateBus = (e: React.FormEvent<HTMLInputElement>): void => {
    actives.current.map((_: void, i: number) => {
      const active = e.currentTarget.checked;
      if (i === parseInt(e.currentTarget.id[3], 10))
        actives.current[i] = active;
      return null;
    });
    currentTracks[index].activeBusses = actives.current;
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
    saveMix();
  };

  return (
    <div className="flex gap4">
      {busChannels.map((_, i) => {
        return (
          <div className="chan-strip-btn" key={`bus${i + currentTrack.id}`}>
            <input
              id={`bus${i + currentTrack.id}`}
              type="checkbox"
              name={index.toString()}
              onChange={toggleBus}
              onInput={updateBus}
              defaultChecked={currentTrack.activeBusses[i]}
            />
            <label className="label" htmlFor={`bus${i + currentTrack.id}`}>
              {i + 1}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default TrackSend;
