import { useState, useEffect, useContext } from "react";
import { MixerContext } from "~/state/context";
import { Draw, Transport as t } from "tone";
import { useMatches } from "@remix-run/react";

type Props = {
  index: number;
  currentTrack: TrackSettings;
  channel: Channel;
};

function Pan({ index, channel, currentTrack }: Props) {
  const [pan, setPan] = useState(currentTrack.pan);

  const playbackState = useContext(MixerContext);
  const matches = useMatches();
  const currentTracks = matches[1].data.currentTracks;

  useEffect(() => {
    if (playbackState === "playback") {
      const rtmString = localStorage.getItem("realTimeMix");
      const realTimeMix = rtmString && JSON.parse(rtmString);
      const times = realTimeMix.mix.map((mix) => mix.time);

      realTimeMix.mix?.map((mix, i) => {
        return t.schedule((time) => {
          Draw.schedule(() => {
            setPan(mix.currentTracks[index].pan);
          }, time);
        }, times[i]);
      });
    }
  }, [index, playbackState]);

  useEffect(() => {
    if (playbackState === "playback") {
      channel.pan.value = pan;
    }
  }, [pan, channel, playbackState]);

  const changePan = (e: React.FormEvent<HTMLInputElement>): void => {
    if (playbackState === "playback") return;
    const pan = parseFloat(e.currentTarget.value);
    setPan(pan);
    channel.set({ pan });
  };

  const updatePan = (e: React.FormEvent<HTMLInputElement>): void => {
    if (playbackState === "playback") return;
    currentTracks[index].pan = e.currentTarget.value;
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
  };

  return (
    <div>
      <input
        id={currentTrack?.id}
        className="simple-range"
        type="range"
        min={-1}
        max={1}
        step={0.001}
        value={pan || 0}
        onChange={changePan}
        onInput={updatePan}
      />
      <div className="pan-labels">
        <span>L</span>
        <span>R</span>
      </div>
    </div>
  );
}

export default Pan;
