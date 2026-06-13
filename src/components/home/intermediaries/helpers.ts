export const formatCompactNumber = (value: number): string => {
  if (value >= 1000) {
    const compact = value / 1000;
    return Number.isInteger(compact) ? `${compact}k` : `${compact.toFixed(1)}k`;
  }

  return String(value);
};

export const formatPlusNumber = (value: number): string => {
  return `+${formatCompactNumber(value)}`;
};
