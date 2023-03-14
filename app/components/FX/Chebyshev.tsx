import { useState, useEffect, useCallback } from "react";
import { Draw, Loop, Transport as t } from "tone";
import type { Chebyshev } from "tone";

type Props = {
  controls: Chebyshev;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
  currentMix: MixSettings;
  channelType: string;
  index: number;
};

export default function Chebyshever({
  controls,
  currentTrack,
  currentTracks,
  currentMix,
  channelType,
  index,
}: Props) {
  const [trackChebyshevsMix, setTrackChebyshevsMix] = useState(
    currentTrack.chebyshevsMix
  );
  const [busChebyshevsMix, setBusChebyshevsMix] = useState(
    currentMix.chebyshevsMix
  );
  const trackChebyshevsOrder = currentTrack.chebyshevsOrder;
  const busChebyshevsOrder = currentMix.chebyshevsOrder;

  // !!! --- START RECORDING --- !!! //
  const startRecording = useCallback(
    (index: number) => {
      console.log("HELLO");
      let data: {}[] = [];

      new Loop(() => {
        if (channelType === "track") {
          const currentTracksString = localStorage.getItem("currentTracks");
          const currentTracks =
            currentTracksString && JSON.parse(currentTracksString);
          if (currentTracks[index].playbackMode.trackChebyshevsMix !== "record")
            return;

          const chebyshevsMix = currentTracks[index].chebyshevsMix;

          data = [{ time: t.seconds.toFixed(1), chebyshevsMix }, ...data];

          localStorage.setItem(
            `Track${index}-chebyshevsMix`,
            JSON.stringify(data)
          );
        }
      }, 0.1).start(0);
    },
    [channelType]
  );

  useEffect(() => {
    const indices = currentTracks.reduce(
      (r: number[], v: TrackSettings, i: any) =>
        r.concat(v.playbackMode.trackChebyshevsMix === "record" ? i : []),
      []
    );
    indices.forEach((index: number) => startRecording(index));
  }, [currentTrack, startRecording, currentTracks]);

  // !!! --- START PLAYBACK --- !!! //
  const startPlayback = useCallback(() => {
    const rtmString = localStorage.getItem(`Track${index}-chebyshevsMix`);
    const realTimeMix: any = (rtmString && JSON.parse(rtmString)) ?? [];

    if (channelType === "track") {
      realTimeMix.forEach((mix: TrackSettings[] & any) => {
        t.schedule((time) => {
          Draw.schedule(() => {
            if (
              currentTracks[index].playbackMode.trackChebyshevsMix !==
              "playback"
            )
              return;
            return setTrackChebyshevsMix(mix.chebyshevsMix[index]);
          }, time);
        }, mix.time);
      });
    }
  }, [index, channelType, currentTracks]);

  useEffect(() => {
    startPlayback();
  }, [startPlayback]);

  const changeChebyshevsMix = (e: React.FormEvent<HTMLInputElement>): void => {
    if (channelType === "track") {
      trackChebyshevsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(trackChebyshevsMix[index].toString());
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        chebyshevsMix: trackChebyshevsMix,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }
    if (channelType === "bus") {
      busChebyshevsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(busChebyshevsMix[index].toString());
      const mixSettings = {
        ...currentMix,
        chebyshevsMix: busChebyshevsMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  // const updateChebyshevsMix = (): void => {
  //   if (channelType === "track") {
  //     const trackSettings = currentTracks?.map((currentTrack) => ({
  //       ...currentTrack,
  //       chebyshevsMix: trackChebyshevsMix,
  //     }));
  //     localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
  //   }

  //   if (channelType === "bus") {
  //     const mixSettings = {
  //       ...currentMix,
  //       chebyshevsMix: busChebyshevsMix,
  //     };
  //     localStorage.setItem("currentMix", JSON.stringify(mixSettings));
  //   }
  // };

  const changeChebyshevsOrder = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    if (channelType === "track") {
      trackChebyshevsOrder[index] = parseFloat(e.currentTarget.value);
      controls.order = parseFloat(trackChebyshevsOrder[index].toString());
    }
    if (channelType === "bus") {
      busChebyshevsOrder[index] = parseFloat(e.currentTarget.value);
      controls.order = parseFloat(busChebyshevsOrder[index].toString());
    }
  };

  const updateChebyshevsOrder = (): void => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        chebyshevsOrder: trackChebyshevsOrder,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        chebyshevsOrder: busChebyshevsOrder,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  return (
    <div>
      <h3>Chebyshev</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="order">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="order"
          min={0}
          max={1}
          step={0.01}
          onChange={changeChebyshevsMix}
          // onPointerUp={updateChebyshevsMix}
          value={
            channelType === "bus"
              ? currentMix.chebyshevsMix[index]
              : currentTracks[index].chebyshevsMix[index].toString()
          }
        />
        <label htmlFor="order">Order:</label>
        <input
          type="range"
          className="simple-range"
          name="order"
          min={1}
          max={100}
          step={1}
          onChange={changeChebyshevsOrder}
          onPointerUp={updateChebyshevsOrder}
          defaultValue={
            channelType === "bus"
              ? currentMix.chebyshevsOrder[index]
              : currentTracks[index].chebyshevsOrder[index].toString()
          }
        />
      </div>
    </div>
  );
}
