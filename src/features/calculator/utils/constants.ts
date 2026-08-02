/**
 * Core calculation constants - Baker's Percentages and Hydration Rates
 * Single source of truth for all recipe calculations.
 */

import { FlourType, LiquidBase, Technique, MixinType, RecipeMode } from '../types';

// Hydration rates by flour type (Baker's Percentage of liquid to flour)
export const HYDRATION_RATES: Record<FlourType, number> = {
  ap: 0.60,
  bread: 0.65,
  wheat: 0.73
};

// Base Baker's Percentages (relative to flour = 100%)
export const BASE_BAKERS_PERCENTAGES = {
  SALT: 0.02,
  YEAST: 0.015,
  OIL: 0.08,
  SUGAR: 0.08,
  MIXIN: 0.20,
} as const;

// Recipe mode specific percentages
export const RECIPE_MODE_PERCENTAGES: Record<RecipeMode, {
  liquid: number;
  sugar: number;
  fat: number;
  eggs: number;
}> = {
  bread: {
    liquid: 0, // Uses HYDRATION_RATES instead
    sugar: 0.08,
    fat: 0.08,
    eggs: 0,
  },
  cake: {
    liquid: 0.60,
    sugar: 0.75,
    fat: 0.50,
    eggs: 0.50, // ~50% egg weight to flour
  },
  cookie: {
    liquid: 0.40,
    sugar: 1.20,
    fat: 0.60,
    eggs: 0.25,
  },
};

// Liquid base adjustments
export const LIQUID_BASE_CONFIG: Record<LiquidBase, { 
  name: string; 
  condensedFactor?: number; 
  waterContent?: number;
  sugarContent?: number;
}> = {
  water: { name: 'Water', waterContent: 1.0 },
  milk: { name: 'Fresh Milk', waterContent: 0.87, sugarContent: 0.05 },
  evap: { name: 'Evaporated Milk', waterContent: 0.74, sugarContent: 0.10 },
  condensed: { name: 'Sweetened Condensed Milk', condensedFactor: 0.20, waterContent: 0.30, sugarContent: 0.45 },
};

// Technique adjustments
export const TECHNIQUE_CONFIG: Record<Technique, {
  name: string;
  flourRatio?: number;
  liquidRatio?: number;
  eggCount?: (flourWeight: number) => number;
}> = {
  none: { name: 'None' },
  egg: { 
    name: 'Egg Wash / Boost',
    eggCount: (flourWeight: number) => Math.max(1, Math.round(flourWeight / 400)),
  },
  tangzhong: { 
    name: 'Tangzhong (Pre-cook)',
    flourRatio: 0.05,
    liquidRatio: 5.0,
  },
};

// Mixin configurations
export const MIXIN_CONFIG: Record<MixinType, { 
  name: string; 
  percentage: number;
  isFruit?: boolean;
  soakingRatio?: number;
}> = {
  none: { name: 'None', percentage: 0 },
  'Raisins (Pasas)': { name: 'Raisins', percentage: 0.20, isFruit: true, soakingRatio: 0.27 },
  'Chocolate Chips': { name: 'Chocolate Chips', percentage: 0.20 },
  'Cheese (Cheddar/Edam)': { name: 'Cheese Cubes', percentage: 0.20 },
  'Mozzarella Cheese': { name: 'Shredded Mozzarella', percentage: 0.15 },
  'Mixed Nuts': { name: 'Mixed Nuts', percentage: 0.15 },
};

// Diabetic substitutions
export const DIABETIC_SUBSTITUTIONS = {
  sugar: {
    erythritol: { ratio: 1.3, label: 'Erythritol' },
    monkfruit: { ratio: 0.5, label: 'Monkfruit Blend' },
    allulose: { ratio: 1.0, label: 'Allulose' },
  },
  flour: {
    almond: { ratio: 0.5, label: 'Almond Flour', hydrationAdjustment: 0.1 },
    coconut: { ratio: 0.25, label: 'Coconut Flour', hydrationAdjustment: 0.5 },
  },
};

// Air fryer models with their characteristics
export const AIR_FRYER_PRESETS = {
  'generic-1500w': { name: 'Generic 1500W', wattage: 1500, capacity: 4, tempOffset: 0 },
  'generic-1800w': { name: 'Generic 1800W', wattage: 1800, capacity: 5, tempOffset: -5 },
  'ninja-1700w': { name: 'Ninja Foodi 1700W', wattage: 1700, capacity: 6, tempOffset: -10 },
  'cosori-1700w': { name: 'Cosori 1700W', wattage: 1700, capacity: 5.8, tempOffset: -5 },
  'philips-1400w': { name: 'Philips 1400W', wattage: 1400, capacity: 4.1, tempOffset: 10 },
} as const;

// Conversion constants
export const CONVERSION = {
  // Volume conversions (grams to volume)
  GRAMS_PER_CUP_FLOUR: 125,
  GRAMS_PER_CUP_SUGAR: 200,
  GRAMS_PER_CUP_BUTTER: 227,
  GRAMS_PER_TBSP: 14.3,
  GRAMS_PER_TSP: 4.7,
  // Density approximations for spoon conversions
  DENSITY: {
    salt: 5.0,
    yeast: 5.0,
    baking_powder: 4.5,
    baking_soda: 4.5,
    sugar: 12.5,
    flour: 8.0,
    oil: 13.0,
  },
} as const;

// Fruit soaking safety thresholds
export const FRUIT_SOAKING = {
  TARGET_ABSORPTION_RATIO: 0.27,
  MIN_MULTIPLIER: 0.8,
  MAX_MULTIPLIER: 1.5,
} as const;