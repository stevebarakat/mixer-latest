import VuMeter from "./VuMeter";
import useVuMeter from "~/hooks/useVuMeter";

type Props = {
  channel: Channel | Volume | Destination;
  volume: number;
  changeVolume: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  currentTrack: TrackSettings;
  currentTracks: TrackSettings[];
};

function Fader({ channel, volume, changeVolume, currentTrack }: Props) {
  const meterVal = useVuMeter([channel]);

  return (
    <div className="fader-wrap">
      <div className="window">
        <input
          disabled
          className="level-val"
          value={Math.round(volume) + " db"}
        />
      </div>

      <div className="levels-wrap">
        <VuMeter meterValue={meterVal} height={300} width={10} />
      </div>
      <div className="vol-wrap">
        <input
          disabled={currentTrack.playbackState === "playback"}
          id={currentTrack.id}
          className="volume"
          style={{ width: 300, top: 85 }}
          type="range"
          min={-100}
          max={12}
          step={0.1}
          value={volume}
          onChange={changeVolume}
          // onPointerUp={updateVolume}
        />
      </div>
    </div>
  );
}

export default Fader;
