import { IGameSettings } from './randomizer.service';

export const calculateTickerAnimationData = ({
  gameSettings,
  spinnerTransformStyles,
}: {
  gameSettings: IGameSettings;
  spinnerTransformStyles: string;
}) => {
  const values = spinnerTransformStyles.split('(')[1].split(')')[0].split(',');
  const a = Number(values[0]);
  const b = Number(values[1]);
  let rad = Math.atan2(b, a);

  if (rad < 0) {
    rad += 2 * Math.PI;
  }

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / gameSettings.prizeSlice);

  return { slice };
};

export const selectPrize = ({
  gameSettings,
  rotation,
}: {
  gameSettings: IGameSettings;
  rotation: number;
}) => {
  const currentRotation = rotation % 360;
  return Math.floor(currentRotation / gameSettings.prizeSlice);
};

export const spinertia = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomColors = (count: number) => {
  const colors = new Set();
  const hueStep = 360 / count;
  let hue = Math.floor(Math.random() * 360);

  while (colors.size < count) {
    const saturation = Math.floor(Math.random() * 50 + 50);
    const lightness = Math.floor(Math.random() * 30 + 50);
    colors.add(hslToHex(hue, saturation, lightness));
    hue = (hue + hueStep) % 360;
  }
  return Array.from(colors);
};

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};
