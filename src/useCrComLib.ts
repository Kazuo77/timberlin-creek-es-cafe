export const pulse = (join: string) => {
  window.CrComLib.publishEvent('b', join, true);
  setTimeout(() => window.CrComLib.publishEvent('b', join, false), 100);
};

//Hold 
let holdTimer: ReturnType<typeof setInterval> | null = null;

export function hold(join: string, state: boolean) {
  if (state) {
    window.CrComLib.publishEvent('o', join, { repeatdigital: true });
    holdTimer = setInterval(() => {
      window.CrComLib.publishEvent('o', join, { repeatdigital: true });
    }, 250);
  } else {
    if (holdTimer) {
      clearInterval(holdTimer);
      holdTimer = null;
    }
    window.CrComLib.publishEvent('o', join, { repeatdigital: false });
  }
}

/*export const hold = (join: string, value: boolean) =>
  window.CrComLib.publishEvent('b', join, value);*/

export const sendAnalog = (join: string, value: number) =>
  window.CrComLib.publishEvent('n', join, Number(value));

export const sendSerial = (join: string, value: string) =>
  window.CrComLib.publishEvent('s', join, value);


