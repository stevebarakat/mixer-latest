import { useEffect, useContext } from "react";
import { MixerContext } from "~/state/context";
import { Draw, Transport as t } from "tone";
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
  const playbackState = useContext(MixerContext);
  const matches = useMatches();
  const currentTracks = matches[1].data.currentTracks;

  useEffect(() => {
    if (playbackState === "playback") {
      const rtmString = localStorage.getItem("realTimeMix");
      const realTimeMix = rtmString && JSON.parse(rtmString);
      const times = realTimeMix.mix.map((mix) => mix.time);

      realTimeMix.mix?.map((mix, i) => {
        console.log("mix", mix);
        return t.schedule((time) => {
          Draw.schedule(() => {
            handleSetIsMuted(mix.currentTracks[index].mute);
          }, time);
        }, times[i]);
      });
    }
  }, [playbackState, handleSetIsMuted, currentTracks, index]);

  useEffect(() => {
    if (playbackState === "playback") {
      channel.mute = isMuted;
    }
  }, [isMuted, channel, playbackState]);

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
    if (playbackState === "playback") return;
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
