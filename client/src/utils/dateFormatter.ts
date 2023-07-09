const dateFormatter = (serialisedDate: number) => {
  const dateObj = new Date(serialisedDate);
  const formattedDate = `${dateObj.getDate()}.${
    dateObj.getMonth() + 1
  }.${dateObj.getFullYear()}`;
  const formattedTime = `${dateObj.getHours()}:${
    dateObj.getMinutes() < 10
      ? '0' + dateObj.getMinutes()
      : dateObj.getMinutes()
  }`;
  return { formattedDate, formattedTime };
};

export default dateFormatter;
