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
