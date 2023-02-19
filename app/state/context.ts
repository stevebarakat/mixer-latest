import { createContext } from "react";

export type MixerContextType = {
  playState: string;
  setPlayState: (arg: string) => void;
};

export const MixerContext = createContext<MixerContextType>({
  playState: "stopped",
  setPlayState: () => {},
});
