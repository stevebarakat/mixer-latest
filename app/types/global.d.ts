import type {
  User as UserType,
  Song as SongType,
  Track as TrackType,
  MixSettings as MixSettingsType,
  TrackSettings as TrackSettingsType,
  PlaybackMode as PlaybackModeType,
} from "@prisma/client";
import type { Destination as ToneDestination } from "tone/build/esm/core/context/Destination";
import type {
  Channel as ToneChannel,
  Volume as ToneVolume,
  Loop as ToneLoop,
  Reverb,
  FeedbackDelay,
  Chebyshev,
  FrequencyShifter,
  PitchShift,
} from "tone";

declare global {
  type User = UserType;
  type Song = SongType;
  type Track = TrackType;
  type MixSettings = MixSettingsType;
  type TrackSettings = TrackSettingsType;
  type PlaybackMode = PlaybackModeType;
  type Destination = ToneDestination;
  type Loop = ToneLoop;
  type Channel = ToneChannel;
  type Volume = ToneVolume;
  type Source = Song & { tracks: Track[] };
  type FxType =
    | Reverb
    | FeedbackDelay
    | Chebyshev
    | FrequencyShifter
    | PitchShift
    | JSX.Element;
}
