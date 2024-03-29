export const info = (...params: string[]) => {
  if (process.env.NODE_ENV !== 'test') console.log(...params);
};

export const error = (...params: string[]) => {
  if (process.env.NODE_ENV !== 'test') console.error(...params);
};
