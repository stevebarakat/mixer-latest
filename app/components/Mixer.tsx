import { useState, useRef } from "react";
import { useMatches, useFetcher } from "@remix-run/react";
import { Destination, Volume, Loop, Transport as t } from "tone";
import Controls from "./Transport/Controls";
import MasterVol from "./Channels/Master";
import BusReceive from "./Channels/BusReceive";
import ChannelStrip from "./Channels/ChannelStrip";
import Spinner from "./Spinner";
import useFxType from "~/hooks/useFxType";
import useHydrate from "~/hooks/useHydrate";
import useToggleBus from "~/hooks/useToggleBus";
import useToggleFxPanel from "~/hooks/useToggleFxPanel";
import useChannelStrip from "~/hooks/useChannelStrip";
import Draggable from "~/components/Draggable";
import { xIcon } from "~/assets/xIcon";

type Props = {
  song: Source;
};

function Mixer({ song }: Props) {
  const fetcher = useFetcher();
  const matches = useMatches();
  const loop = useRef<Loop | null>(null);
  const tracks = song.tracks;

  const busChannels = useRef<Volume[]>([new Volume(), new Volume()]);

  const currentMixString = localStorage.getItem("currentMix");
  const currentMix =
    (currentMixString && JSON.parse(currentMixString)) ||
    matches[1].data.currentMix;
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks =
    (currentTracksString && JSON.parse(currentTracksString)) ||
    matches[1].data.currentTracks;

  const [playbackState, setPlaybackState] = useState(
    currentTracks.playbackState
  );
  const playbackStateSet = (value: string[]) => setPlaybackState(value);

  const [busFxOpen, setBusFxOpen] = useState([true, true]);
  const handleSetBusFxOpen = (value: boolean[]) => setBusFxOpen(value);
  const [trackFxOpen, setTrackFxOpen] = useState(
    new Array(tracks.length).fill(true)
  );
  const handleSetTrackFxOpen = (value: boolean[]) => setTrackFxOpen(value);

  const handleSetBusFxChoices = (value: string[][]) => setBusFxChoices(value);
  const [busFxChoices, setBusFxChoices] = useState(() => {
    if (currentMix.busFxChoices > tracks.length) {
      return currentMix.busFxChoices;
    } else {
      return currentMix.busFxChoices.concat(
        new Array(tracks.length - currentMix.busFxChoices.length).fill([])
      );
    }
  });

  const handleSetTrackFxChoices = (value: string[][]) =>
    setTrackFxChoices(value);
  const [trackFxChoices, setTrackFxChoices] = useState<string[][]>(() => {
    if (currentMix.trackFxChoices > tracks.length) {
      return currentMix.trackFxChoices;
    } else {
      return currentMix.trackFxChoices.concat(
        new Array(tracks.length - currentMix.trackFxChoices.length).fill([])
      );
    }
  });

  let i = useRef(-0.1);
  function startRecording(index: number) {
    const realTimeMixString = localStorage.getItem("realTimeMix");
    const realTimeMix = realTimeMixString && JSON.parse(realTimeMixString);

    console.log(
      "currentTracks[index].playbackState[index]",
      currentTracks[index].playbackState[index]
    );
    if (currentTracks[index].playbackState[index] === "record") {
      console.log("REcording!!!");
      let data: {
        time: string;
        0: number;
        1: number;
        2: number;
        3: number;
      }[] = [];

      loop.current = new Loop(() => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);
        console.log("i.current", Math.round(i.current));

        // data[Math.round(i.current)] = {
        //   time: t.seconds.toFixed(1),
        //   0: currentTracks[0].volume,
        //   1: currentTracks[1].volume,
        //   2: currentTracks[2].volume,
        //   3: currentTracks[3].volume,
        // };

        data.push({
          time: t.seconds.toFixed(1),
          0: currentTracks[0].volume,
          1: currentTracks[1].volume,
          2: currentTracks[2].volume,
          3: currentTracks[3].volume,
        });

        localStorage.setItem(
          "realTimeMix",
          JSON.stringify({
            ...realTimeMix,
            mix: data,
          })
        );

        // fetcher.submit(
        //   {
        //     actionName: "saveRealTimeMix",
        //     realTimeMix: JSON.stringify({
        //       ...realTimeMix,
        //       mix: data,
        //     }),
        //   },
        //   { method: "post", action: "/saveMix", replace: true }
        // );

        i.current = i.current + 0.5;
      }, 0.1).start();
    }
  }

  function rewind() {
    if (t.seconds < song.start!) {
      t.seconds = song.start || 0;
    } else {
      t.seconds = t.seconds - 5;
    }
  }

  const [trackFxTypes, trackFxControls] = useFxType({
    fxChoices: trackFxChoices,
    currentMix,
    currentTracks,
    channelType: "track",
  });

  const [busFxTypes, busFxControls] = useFxType({
    fxChoices: busFxChoices,
    currentMix,
    currentTracks,
    channelType: "bus",
  });

  const [channels, isLoaded] = useChannelStrip({
    tracks,
    trackFxTypes,
    busFxTypes,
    busChannels: busChannels.current,
  });

  useHydrate({
    currentMix,
    currentTracks,
    channels,
    busFxTypes,
    busChannels: busChannels.current,
  });

  const toggleBus = useToggleBus({
    channels,
    busChannels: busChannels.current,
  });

  const toggleFxPanel = useToggleFxPanel({
    trackFxOpen,
    setTrackFxOpen,
    busFxOpen,
    setBusFxOpen,
  });

  const toggleTrackFxModal = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const index = parseInt(e.currentTarget.id[3], 10);
    busFxOpen[index] = !busFxOpen[index];
    setBusFxOpen([...busFxOpen]);
    trackFxOpen[index] = !trackFxOpen[index];
    setTrackFxOpen([...trackFxOpen]);
  };

  return isLoaded === false ? (
    <div className="loader-wrap">
      <Spinner song={song} />
    </div>
  ) : (
    <div className="console">
      <div className="fx-panels-wrap">
        {busFxControls.map((control: any, j: number) => {
          const noControls = control.every((bool: boolean) => bool === null);
          if (noControls) return null;
          return (
            <Draggable
              key={j}
              className={busFxOpen[j] ? "panel open" : "panel closed"}
            >
              <button
                id={`bs-${j}`}
                className="fx-panel-btn"
                onClick={toggleFxPanel}
              >
                {xIcon}
              </button>
              <div style={{ minWidth: "250px", maxWidth: "50%" }}>
                <h4>{`Bus${j + 1} FX`}</h4>
                {busChannels.current.map(
                  (_, i) => control[i] && <div key={i}>{control[i]}</div>
                )}
              </div>
            </Draggable>
          );
        })}
      </div>

      <div className="mixer">
        {tracks.map((track: Track, i: number) => (
          <ChannelStrip
            key={track.path}
            trackIndex={i}
            channel={channels[i]}
            track={track}
            toggleBus={toggleBus}
            busChannels={busChannels.current}
            currentTrack={currentTracks[i]}
            currentTracks={currentTracks}
            trackFxOpen={trackFxOpen}
            handleSetTrackFxOpen={handleSetTrackFxOpen}
            trackFxChoices={trackFxChoices}
            handleSetTrackFxChoices={handleSetTrackFxChoices}
            playbackState={playbackState}
            setPlaybackState={playbackStateSet}
          />
        ))}
        {busChannels.current.map((busChannel, i) => (
          <BusReceive
            busIndex={i}
            key={`busChannel${i}`}
            busChannel={busChannel}
            busFxOpen={busFxOpen}
            handleSetBusFxOpen={handleSetBusFxOpen}
            busFxChoices={busFxChoices}
            handleSetBusFxChoices={handleSetBusFxChoices}
          />
        ))}
        <MasterVol index={0} channel={Destination} />
        <div className="fx-panels-wrap">
          {trackFxControls.map((control: any, j: number) => {
            const noControls = control.every((bool: boolean) => {
              return bool === null;
            });
            if (noControls) return null;

            return (
              <Draggable
                key={j}
                className={trackFxOpen[j] ? "panel open" : "panel closed"}
              >
                <button
                  id={`bs-${j}`}
                  className="fx-panel-btn"
                  onClick={toggleTrackFxModal}
                >
                  {xIcon}
                </button>
                <ul style={{ minWidth: "200px", maxWidth: "50%" }}>
                  <li>
                    <>
                      <h4>{`Track${j + 1} FX`}</h4>
                      {trackFxControls[j]}
                    </>
                  </li>
                </ul>
              </Draggable>
            );
          })}
        </div>
      </div>

      <div className="flex">
        <div className="controls flex gap8 pt8">
          <Controls
            song={song}
            rewind={rewind}
            startRecording={startRecording}
            playbackState={playbackState}
          />
        </div>
      </div>
    </div>
  );
}

export default Mixer;
