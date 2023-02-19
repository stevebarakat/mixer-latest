type Props = {
  song: Source;
};

const Spinner = ({ song }: Props) => {
  return (
    <div className="loader-container">
      <span>
        Loading: {song.artist} - {song.title}
      </span>
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
