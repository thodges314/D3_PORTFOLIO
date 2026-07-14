export const formatToMil = (num) => {
  // convert numbers above 999999 to use 'M' with comma seperators
  // Add $ and % if appropriate
  const output =
    Math.abs(num) > 999999
      ? `${Math.sign(num) * (Math.abs(num) / 1000000).toFixed(2)}M`
      : Math.sign(num) * Math.abs(num).toFixed(2);

  return output;
};
