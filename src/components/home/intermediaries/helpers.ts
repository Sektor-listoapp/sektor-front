const MAX_RATING = 5;

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

export const formatSatisfactionPercentage = (value: number): string => {
  return `+${Math.round(value)}%`;
};

export const calculateSatisfactionPercentage = (
  ratings: Array<number | null | undefined>
): number | null => {
  const validRatings = ratings.filter(
    (rating): rating is number =>
      typeof rating === "number" && rating > 0
  );

  if (!validRatings.length) {
    return null;
  }

  const averageRating =
    validRatings.reduce((total, rating) => total + rating, 0) /
    validRatings.length;

  return (averageRating / MAX_RATING) * 100;
};
