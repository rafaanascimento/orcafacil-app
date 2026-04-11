export const safeNumber = (value: number, minimum = 0): number => {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(value, minimum);
};

export const round2 = (value: number): number => Math.round((safeNumber(value) + Number.EPSILON) * 100) / 100;

export const ceil2 = (value: number): number => Math.ceil(safeNumber(value) * 100) / 100;

export const daysFromProductivity = (area: number, productivityPerDay: number): number => {
  if (productivityPerDay <= 0) return 0;
  return ceil2(area / productivityPerDay);
};
