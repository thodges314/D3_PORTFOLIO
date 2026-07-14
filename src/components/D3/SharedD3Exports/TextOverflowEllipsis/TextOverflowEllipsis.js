export const TextOverflowEllipsis = (str, cutoff) => {
  if (!str || !cutoff) return '';
  if (str.length >= cutoff && str.length > 3) {
    return `${str.substring(0, cutoff - 3)}...`;
  }
  return str;
};
