import { useLayoutEffect, useState } from "react";

const specialKeys = [
  "Shift",
  "CapsLock",
  "Meta",
  "Control",
  "Alt",
  "Tab",
  "Backspace",
  "Escape",
  "Space",
];

const useKeys = () => {
  const [keys, setKeys] = useState<any[]>([]);

  useLayoutEffect(() => {
    const downHandler = (
      e: KeyboardEvent,
      { code, shiftKey, repeat } = e
    ): void => {
      // if (repeat) return;
      setKeys((prevKeys) => {
        return [
          ...prevKeys,
          {
            code,
            shiftKey,
          },
        ];
      });
    };

    const upHandler = ({ code, shiftKey }: KeyboardEvent) => {
      setKeys((prevKeys) => {
        return prevKeys.filter((k) => {
          if (specialKeys.includes(code)) return false;
          return JSON.stringify(k) !== JSON.stringify({ code, shiftKey });
        });
      });
    };

    window.addEventListener(`keydown`, downHandler);
    window.addEventListener(`keyup`, upHandler);
    return () => {
      window.removeEventListener(`keydown`, downHandler);
      window.removeEventListener(`keyup`, upHandler);
    };
  }, []);
  return keys.map((x) => x.code);
};

export default useKeys;
