export const doubleFadedStyle = (leftStop = 15, rightStop = 85) => ({
  position: 'relative',
  maskImage: `linear-gradient(to right, transparent, white ${leftStop}%, white ${rightStop}%, transparent)`,
  maskRepeat: 'no-repeat',
  maskSize: '100% 100%',
});

export const leftFadedStyle = (stop = 25) => ({
  position: 'relative',
  maskImage: `linear-gradient(to right, transparent, white ${stop}%)`,
  maskRepeat: 'no-repeat',
  maskSize: '100% 100%',
});

export const rightFadedStyle = (stop = 25) => ({
  position: 'relative',
  maskImage: `linear-gradient(to left, transparent, white ${stop}%)`,
  maskRepeat: 'no-repeat',
  maskSize: '100% 100%',
});
