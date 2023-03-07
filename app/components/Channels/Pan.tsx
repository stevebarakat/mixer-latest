import { useState, useEffect, useCallback } from "react";
import { useMatches } from "@remix-run/react";
import { Draw, Loop, Transport as t } from "tone";

type Props = {
  index: number;
  currentTrack: TrackSettings;
  channel: Channel;
};

function Pan({ index, channel, currentTrack }: Props) {
  const [pan, setPan] = useState(currentTrack.pan);

  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  // // !!! --- START RECORDING --- !!! //
  // const startRecording = useCallback((index: number) => {
  //   let data: {}[] = [];

  //   new Loop(() => {
  //     const currentTracksString = localStorage.getItem("currentTracks");
  //     const currentTracks =
  //       currentTracksString && JSON.parse(currentTracksString);
  //     if (currentTracks[index].playbackMode !== "record") return;

  //     const pan = currentTracks[index].pan;

  //     data = [{ time: t.seconds.toFixed(1), pan }, ...data];

  //     localStorage.setItem(`Track${index}-pan`, JSON.stringify(data));
  //   }, 0.1).start(0);
  // }, []);

  // useEffect(() => {
  //   const indices = currentTracks.reduce(
  //     (r: number[], v: TrackSettings, i: any) =>
  //       r.concat(v.playbackMode.pan === "record" ? i : []),
  //     []
  //   );
  //   indices.forEach((index: number) => startRecording(index));
  // }, [currentTrack, startRecording, currentTracks]);

  // // !!! --- START PLAYBACK --- !!! //
  // const startPlayback = useCallback(() => {
  //   const rtmString = localStorage.getItem(`Track${index}-pan`);
  //   const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

  //   realTimeMix.forEach((mix: TrackSettings[] & any) => {
  //     t.schedule((time) => {
  //       Draw.schedule(() => {
  //         if (currentTrack.playbackMode.pan !== "playback") return;
  //         channel.pan.value = mix.pan;
  //         return setPan(mix.pan);
  //       }, time);
  //     }, mix.time);
  //   });
  // }, [index, channel.pan, currentTrack.playbackMode]);

  // useEffect(() => {
  //   startPlayback();
  // }, [startPlayback]);

  const changePan = (e: React.FormEvent<HTMLInputElement>): void => {
    const panVal = parseFloat(e.currentTarget.value);
    setPan(panVal);
    channel.set({ pan: panVal });
  };

  const updatePan = (e: React.FormEvent<HTMLInputElement>): void => {
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
