import { useState, useEffect } from "react";
import { Draw, Transport as t } from "tone";
import { useMatches } from "@remix-run/react";
import VuMeter from "./VuMeter";
import { dBToPercent, transpose } from "~/utils/scale";
import useVuMeter from "~/hooks/useVuMeter";

type Props = {
  index: number;
  channel: Channel;
  isMuted?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  volume: number;
  setVolume: (arg: number) => void;
};

function TrackFader({
  index,
  channel,
  isMuted,
  min,
  max,
  disabled,
  volume,
  setVolume,
}: Props) {
  const matches = useMatches();
  const meterVal = useVuMeter([channel]);
  const currentMix = matches[1].data.currentMix;
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  useEffect(() => {
    if (currentTracks[index].playbackState === "playback") {
      const rtmString = localStorage.getItem("realTimeMix");
      const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

      realTimeMix.mix?.map((mix) => {
        return t.schedule((time) => {
          Draw.schedule(() => {
            const transposed = transpose(mix.currentTracks[index].volume);
            const scaled = dBToPercent(transposed);
            return setVolume(scaled);
          }, time);
        }, mix.time);
      });
    }
    return () => {
      if (currentTracks[index].playbackState === "playback") {
        Draw.dispose();
      }
    };
  }, [index, currentTracks, setVolume]);

  useEffect(() => {
    if (currentTracks[index].playbackState === "playback")
      channel.volume.value = volume;
  }, [volume, channel, currentTracks, index]);

  function changeVolume(e: React.FormEvent<HTMLInputElement>): void {
    if (currentTracks[index].playbackState !== "playback") {
      if (isMuted) return;
      const id = parseInt(e.currentTarget.id);
      const value = parseFloat(e.currentTarget.value);
      const transposed = transpose(value);
      const scaled = dBToPercent(transposed);
      channel.volume.value = scaled;
      setVolume(value);

      currentTracks[id].volume = value;
    }
    if (currentTracks[index].playbackState === "record") {
      localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
      localStorage.setItem("currentMix", JSON.stringify(currentMix));
    }
  }

  function updateVolume(e: React.FormEvent<HTMLInputElement>): void {
    if (currentTracks[index].playbackState === "free") {
      localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
      localStorage.setItem("currentMix", JSON.stringify(currentMix));
    }
  }

  return (
    <div className="fader-wrap">
      <div className="window">
        <input
          disabled
          className="level-val"
          value={Math.round(currentTracks[index].volume) + " db"}
        />
      </div>

      <div className="levels-wrap">
        <VuMeter meterValue={meterVal} height={300} width={10} />
      </div>
      <div className="vol-wrap">
        <input
          disabled={
            currentTracks[index].playbackState === "playback" || disabled
          }
          id={index.toString()}
          className="volume"
          style={{ width: 300, top: 85 }}
          type="range"
          min={min || -100}
          max={max || 12}
          step={0.1}
          value={currentTracks[index].volume}
          onChange={changeVolume}
          // onPointerUp={updateVolume}
        />
      </div>
    </div>
  );
}

export default TrackFader;
