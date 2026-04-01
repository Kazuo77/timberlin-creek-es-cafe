export const pulse = (join: string) => {
  window.CrComLib.publishEvent('b', join, true);
  setTimeout(() => window.CrComLib.publishEvent('b', join, false), 100);
};

export const sendAnalog = (join: string, value: number) =>
  window.CrComLib.publishEvent('n', join, Number(value));

export const sendSerial = (join: string, value: string) =>
  window.CrComLib.publishEvent('s', join, value);