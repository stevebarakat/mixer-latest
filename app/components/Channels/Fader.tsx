import VuMeter from "./VuMeter";
import useVuMeter from "~/hooks/useVuMeter";

type Props = {
  id: string;
  disabled?: boolean;
  channel: Channel | Volume | Destination;
  volume: number;
  changeVolume: (arg: React.ChangeEvent<HTMLInputElement>) => void;
};

function Fader({ channel, volume, changeVolume, id, disabled }: Props) {
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
          disabled={disabled}
          id={id}
          className="volume"
          style={{ width: 300, top: 85 }}
          type="range"
          min={-100}
          max={12}
          step={0.1}
          value={volume}
          onChange={changeVolume}
        />
      </div>
    </div>
  );
}

export default Fader;
