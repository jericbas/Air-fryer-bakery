// Bread hydration rates
export const BREAD_HYDRATION_RATES = {
  ap: 0.60,
  bread: 0.65,
  wheat: 0.73
} as const;

// Baker's percentages for different modes
export const BREAD_BAKERS_PERCENTAGES = {
  SALT: 0.02,
  YEAST: 0.015,
  OIL: 0.08,
  SUGAR: 0.08,
} as const;

// Fruit Cake calculations
export const CAKE_BAKERS_PERCENTAGES = {
  TRADITIONAL: {
    BUTTER: 1.0,    // 100%
    SUGAR: 1.0,     // 100%
    EGGS: 1.0,      // 100% (by count, roughly 50g per 250g flour)
    SALT: 0.01,
  },
  LIGHT: {
    BUTTER: 0.60,   // 60%
    SUGAR: 0.60,    // 60%
    MILK: 0.40,     // 40% milk liquid
    EGGS: 0.60,
    SALT: 0.01,
  }
} as const;

// Jam additions (percentage of flour)
export const JAM_PERCENTAGES = {
  'Orange Marmalade': 0.20,
  'Pineapple Jam': 0.20,
  'Apricot Jam': 0.20,
} as const;

// Cookie calculations
export const COOKIE_BAKERS_PERCENTAGES = {
  BUTTER: 0.60,    // 60%
  SUGAR: 0.80,     // 80%
  EGGS: 0.20,
  VANILLA: 0.01,
  SALT: 0.01,
  BAKING_POWDER: 0.015,
  CHOCOLATE_CHIPS: 0.30,
  UBE_EXTRACT: 0.04,
  POWDERED_SUGAR: 0.50, // For Ube rolling
} as const;

// Brownie calculations
export const BROWNIE_BAKERS_PERCENTAGES = {
  BUTTER: 1.20,       // 120%
  SUGAR: 1.50,        // 150%
  EGGS: 0.80,
  COCOA: 0.40,        // For fudgy
  CHOCOLATE: 0.30,    // For fudgy
  BAKING_POWDER: 0.01,
  SALT: 0.01,
} as const;

// Food for the Gods (FFTG) brownie alternative
export const FFTG_BAKERS_PERCENTAGES = {
  BUTTER: 1.20,
  SUGAR: 1.50,
  EGGS: 0.80,
  DATES: 0.80,
  WALNUTS: 0.70,
  BAKING_POWDER: 0.01,
  SALT: 0.01,
} as const;

// Empanada pastry (shortcrust)
export const EMPANADA_BAKERS_PERCENTAGES = {
  FAT: 0.50,         // 50% (cold butter or shortening)
  WATER: 0.25,       // 25% (ice water)
  SALT: 0.01,
} as const;

// Diabetic-friendly ingredient swaps
export const DIABETIC_SWAPS = {
  'Sugar': 'Baking Sweetener',
  'Mixed Dried Fruits': 'Nuts & Sugar-Free Seeds',
  'Pineapple / Orange Juice': 'Unsweetened Pineapple/Orange',
  'Brown Sugar': 'Brown Sweetener',
} as const;

// Conversion constants
export const CONVERSIONS = {
  CUPS_PER_GRAM_FLOUR: 1 / 125,
  CUPS_PER_GRAM_BUTTER: 1 / 227,
  CUPS_PER_GRAM_SUGAR: 1 / 125,
  TBSP_PER_GRAM: 1 / 14,
  TSP_PER_GRAM: 1 / 5,
  ML_PER_GRAM: 1,
} as const;

// Fruit soaking ratio
export const FRUIT_SOAK_RATIO = 0.27; // Fruits absorb ~27% of their weight in liquid

export type FlourType = 'ap' | 'bread' | 'wheat';