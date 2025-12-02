export const unixToString = (unixValue: number) => {
  const date = new Date(unixValue * 1000);
  return date.toISOString().split("T")[0];
};
