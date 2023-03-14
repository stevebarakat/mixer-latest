// convert a value from one scale to another
// e.g. App.util.scale(-96, -192, 0, 0, 100) to convert
// -96 from dB (-192 - 0) to percentage (0 - 100)

export const scale = function (
  val: number,
  f0: number,
  f1: number,
  t0: number,
  t1: number
) {
  return ((val - f0) * (t1 - t0)) / (f1 - f0) + t0;
};

export const transpose = (value: number) =>
  Math.log(value + 101) / Math.log(113);

// convert dBFS to a percentage
export const dBToPercent = function (dB: number) {
  return scale(dB, 0, 1, -100, 12);
};

export const transposeBus = (value: number) =>
  Math.log(value + 12) / Math.log(111);

// convert dBFS to a percentage
export const dBToPercentBus = function (dB: number) {
  return scale(dB, 0, 1, -100, -60);
};

// convert percentage to dBFS -- not using
export const percentTodB = function (percent: number) {
  return scale(percent, -100, 12, 0, 1);
};
