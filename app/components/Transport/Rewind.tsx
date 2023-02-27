import rew from "~/assets/rew";

type Props = {
  song: Song;
  setIsRewinding: (arg: boolean) => void;
};

function Rewind({ setIsRewinding }: Props) {
  return (
    <button className="button square red" onClick={() => setIsRewinding(true)}>
      {rew}
    </button>
  );
}

export default Rewind;
