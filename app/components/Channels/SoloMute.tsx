import { useMatches } from "@remix-run/react";

type Props = {
  index: number;
  currentTrack: TrackSettings;
  channel: Channel;
  isMuted: boolean;
  handleSetIsMuted: (muted: boolean) => void;
};

function SoloMute({
  index,
  currentTrack,
  channel,
  isMuted,
  handleSetIsMuted,
}: Props) {
  const matches = useMatches();
  const currentTracks = matches[1].data.currentTracks;

  const changeSolo = (e: React.FormEvent<HTMLInputElement>): void => {
    const soloed = e.currentTarget.checked;
    channel.set({ solo: soloed });
  };

  const changeMute = (e: React.FormEvent<HTMLInputElement>): void => {
    const muted = e.currentTarget.checked;
    handleSetIsMuted(muted);
    channel.set({ mute: muted });
  };

  const updateMute = (e: React.FormEvent<HTMLInputElement>): void => {
    currentTracks[index].mute = e.currentTarget.checked;
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
  };

  return (
    <div className="flex gap4">
      <div className="chan-strip-btn">
        <input
          id={`solo${currentTrack.id}`}
          type="checkbox"
          name={currentTrack.trackSettingsId}
          onChange={changeSolo}
          defaultChecked={false}
        />
        <label className="label" htmlFor={`solo${currentTrack.id}`}>
          S
        </label>
      </div>
      <div className="chan-strip-btn">
        <div style={{ position: "relative", width: "100%" }}>
          <input
            id={`mute${currentTrack.id}`}
            type="checkbox"
            name={currentTrack.trackSettingsId}
            onChange={changeMute}
            onInput={updateMute}
            checked={isMuted}
          />
          <label className="label" htmlFor={`mute${currentTrack.id}`}>
            M
          </label>
        </div>
      </div>
    </div>
  );
}

export default SoloMute;
