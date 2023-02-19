import useFork from "~/hooks/useFork";
import { forkIcon } from "~/assets/forkIcon";

type Props = {
  mix: MixSettings;
};
function Fork({ mix }: Props) {
  const forkMix = useFork();

  return (
    <button id={mix.id} onClick={forkMix}>
      {forkIcon}
      <span>Fork</span>
    </button>
  );
}

export default Fork;
