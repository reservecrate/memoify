const getRandomGradient = () => {
  const getRandomColour = () => Math.floor(Math.random() * 256);

  const red1 = getRandomColour();
  const green1 = getRandomColour();
  const blue1 = getRandomColour();
  const colour1 = `rgb(${red1},${green1},${blue1})`;

  const red2 = getRandomColour();
  const green2 = getRandomColour();
  const blue2 = getRandomColour();
  const colour2 = `rgb(${red2},${green2},${blue2})`;

  return `linear-gradient(to right,${colour1},${colour2})`;
};

export default getRandomGradient;
