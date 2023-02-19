import rew from "~/assets/rew";

type Props = {
  song: Song;
  rewind: () => void;
};

function Rewind({ rewind }: Props) {
  return (
    <button className="button square red" onClick={rewind}>
      {rew}
    </button>
  );
}

export default Rewind;
