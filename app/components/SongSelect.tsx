import { useState } from "react";
import { useFetcher } from "@remix-run/react";

function SongSelect() {
  const fetcher = useFetcher();
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (e: React.FormEvent<HTMLSelectElement>): void => {
    if (e.currentTarget.value === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  return (
    <>
      <fetcher.Form
        method="post"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <select
          onChange={handleChange}
          className="song-select"
          name="slug"
          id="song-select"
        >
          <option value="">Create A New Mix...</option>
          <option value="a-day-in-the-life">
            The Beatles - A Day In The Life
          </option>
          <option value="borderline">Madonna - Borderline</option>
          <option value="roxanne">The Police - Roxanne</option>
          <option value="blue-monday">New Order - Blue Monday</option>
          <option value="baby-one-more-time">
            Britney Spears - Babay One More Time
          </option>
          <option value="nineteen-one">Phoenix - 1901</option>
          <option value="everlong">Foo Fighters - Everlong</option>
          <option value="let-love-rule">Lenny Kravitz - Let Love Rule</option>
          <option value="santa-monica">Everclear - Santa Monica</option>
          <option value="scar-tissue">
            Red Hot Chili Peppers - Scar Tissue
          </option>
          <option value="interstate-love-song">
            Stone Temple Pilots - Interstate Love Song
          </option>
          <option value="teenage-riot">Sonic Youth - Teenage Riot</option>
          <option value="semi-charmed-life">
            Third Eye Blind - Semi-Charmed Life
          </option>
        </select>
        <button disabled={isDisabled} className="submit-btn">
          {isDisabled ? (
            <>
              <span style={{ position: "relative", top: 2 }}>⬅</span>Choose Mix
            </>
          ) : (
            "Create Mix"
          )}
        </button>
      </fetcher.Form>
    </>
  );
}

export default SongSelect;
