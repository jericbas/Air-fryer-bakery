import {
  BREAD_HYDRATION_RATES,
  BREAD_BAKERS_PERCENTAGES,
  CAKE_BAKERS_PERCENTAGES,
  COOKIE_BAKERS_PERCENTAGES,
  BROWNIE_BAKERS_PERCENTAGES,
  FFTG_BAKERS_PERCENTAGES,
  EMPANADA_BAKERS_PERCENTAGES,
  JAM_PERCENTAGES,
  FRUIT_SOAK_RATIO,
  CONVERSIONS,
  DIABETIC_SWAPS,
} from '../constants/recipeConfig.js';
import { RecipeConfig, CalculatedIngredients, DoughProfile, Ingredient, WarningState } from '../types.js';

// Calculate ingredients based on recipe mode
export const calculateIngredients = (config: RecipeConfig): CalculatedIngredients => {
  switch (config.recipeMode) {
    case 'bread':
      return calculateBreadIngredients(config);
    case 'fruitCake':
      return calculateCakeIngredients(config);
    case 'cookies':
      return calculateCookieIngredients(config);
    case 'brownies':
      return calculateBrownieIngredients(config);
    case 'empanada':
      return calculateEmpanadaIngredients(config);
    default:
      return { ingredients: {}, warnings: {} };
  }
};

// Bread mode calculation
const calculateBreadIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const flour = config.baseFlour;
  const flourType = config.flourType || 'ap';
  const liquidBase = config.liquidBase || 'water';
  const technique = config.breadTechnique || 'none';
  const mixin = config.breadMixin || 'none';

  let totalLiquid = flour * BREAD_HYDRATION_RATES[flourType];
  const salt = flour * BREAD_BAKERS_PERCENTAGES.SALT;
  const yeast = flour * BREAD_BAKERS_PERCENTAGES.YEAST;
  const oil = flour * BREAD_BAKERS_PERCENTAGES.OIL;

  let sugar = flour * BREAD_BAKERS_PERCENTAGES.SUGAR;
  let condensed = 0;
  let liquidName = 'Water';
  let mainFlour = flour;
  let mainLiquid = totalLiquid;

  // Handle liquid base
  if (liquidBase === 'milk') {
    liquidName = 'Fresh Milk';
  } else if (liquidBase === 'evap') {
    liquidName = 'Evaporated Milk (Evap)';
  } else if (liquidBase === 'condensed') {
    condensed = flour * 0.20;
    sugar = 0;
    mainLiquid = totalLiquid - (condensed * 0.30);
    liquidName = 'Sweetened Condensed Milk';
  }

  // Apply Diabetic swaps
  if (config.isDiabetic && liquidBase === 'condensed') {
    liquidName = 'Unsweetened Milk (Diabetic-Safe)';
    condensed = 0; // Swap to unsweetened
  }

  // Handle techniques
  let tzFlour = 0;
  let tzLiquid = 0;
  let eggCount = 0;

  if (technique === 'egg') {
    eggCount = Math.max(1, Math.round(flour / 400));
    mainLiquid = Math.max(0, mainLiquid - eggCount * 50);
  } else if (technique === 'tangzhong') {
    tzFlour = flour * 0.05;
    tzLiquid = tzFlour * 5;
    mainFlour = flour - tzFlour;
    mainLiquid = Math.max(0, mainLiquid - tzLiquid);
  }

  const ingredients: Record<string, Ingredient> = {
    mainFlour: { label: 'Main Flour', grams: Math.round(mainFlour) },
    salt: { label: 'Salt', grams: Math.round(salt) },
    yeast: { label: 'Yeast (Instant)', grams: Math.round(yeast * 100) / 100 },
    oil: { label: 'Olive Oil', grams: Math.round(oil) },
    sugar: sugar > 0 ? { label: 'Sugar', grams: Math.round(sugar) } : undefined,
    condensed: condensed > 0 ? { label: liquidName, grams: Math.round(condensed) } : undefined,
    mainLiquid: { label: liquidName, grams: Math.round(mainLiquid) },
  };

  if (eggCount > 0) {
    ingredients.eggs = { label: `Eggs`, grams: eggCount, note: `${eggCount} large egg${eggCount > 1 ? 's' : ''}` };
  }

  if (tzFlour > 0) {
    ingredients.tzFlour = { label: 'Tangzhong Flour', grams: Math.round(tzFlour), bg: 'bg-amber-50' };
    ingredients.tzLiquid = { label: 'Tangzhong Liquid', grams: Math.round(tzLiquid), bg: 'bg-amber-50' };
  }

  if (mixin !== 'none') {
    const mixinWeight = flour * 0.20;
    ingredients.mixin = { label: mixin, grams: Math.round(mixinWeight) };
  }

  return { ingredients: Object.fromEntries(Object.entries(ingredients).filter(([_, v]) => v)), warnings: {} };
};

// Fruit Cake calculation
const calculateCakeIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const flour = config.baseFlour;
  const style = config.cakeStyle || 'traditional';
  const jamType = config.jamType || 'none';
  const soakLiquid = config.soakLiquid || 'none';

  const percentages = CAKE_BAKERS_PERCENTAGES[style === 'traditional' ? 'TRADITIONAL' : 'LIGHT'];

  const butter = flour * percentages.BUTTER;
  const sugar = flour * percentages.SUGAR;
  const salt = flour * percentages.SALT;

  let ingredients: Record<string, Ingredient> = {
    flour: { label: 'Flour', grams: Math.round(flour) },
    butter: { label: 'Butter', grams: Math.round(butter) },
    sugar: { label: config.isDiabetic ? 'Baking Sweetener' : 'Brown Sugar', grams: Math.round(sugar) },
    salt: { label: 'Salt', grams: Math.round(salt) },
  };

  // Add eggs
  const eggCount = Math.round(flour / 50);
  ingredients.eggs = { label: 'Eggs', grams: eggCount, note: `${eggCount} large eggs` };

  // Light cake gets milk
  if (style === 'light') {
    const milk = flour * percentages.MILK;
    ingredients.milk = { label: 'Milk (Batter Liquid)', grams: Math.round(milk) };
  }

  // Add dried fruits
  const fruitsLabel = config.isDiabetic ? 'Nuts & Sugar-Free Seeds' : 'Mixed Dried Fruits';
  ingredients.fruits = { label: fruitsLabel, grams: Math.round(flour * 0.60) };

  // Add jam if selected
  if (jamType && jamType !== 'none') {
    const jamWeight = flour * (JAM_PERCENTAGES[jamType as keyof typeof JAM_PERCENTAGES] || 0.20);
    ingredients.jam = { label: jamType, grams: Math.round(jamWeight) };
    // Reduce sugar by half the jam weight
    ingredients.sugar.grams = Math.round(ingredients.sugar.grams - jamWeight / 2);
  }

  // Add soak liquid
  if (soakLiquid && soakLiquid !== 'none') {
    const liquidLabel = soakLiquid === 'Juice' && config.isDiabetic 
      ? 'Unsweetened Pineapple/Orange'
      : soakLiquid === 'Dark Rum' ? 'Dark Rum'
      : 'Pineapple / Orange Juice';
    
    ingredients.soakLiquid = { 
      label: liquidLabel, 
      grams: Math.round(flour * 0.27),
      note: 'For soaking fruits overnight'
    };
  }

  // Handle custom liquid if enabled
  let warnings: WarningState = {};
  if (config.useCustomLiquid) {
    const customFruit = config.customFruitWeight || flour * 0.60;
    const customLiquid = config.customLiquidWeight || 0;
    const idealLiquid = customFruit * FRUIT_SOAK_RATIO;
    
    warnings.idealLiquidWeight = Math.round(idealLiquid);
    
    if (customLiquid > idealLiquid * 1.5) {
      warnings.highLiquidWarning = true;
      warnings.warningMessage = 'Too much liquid! May result in soggy cake.';
    } else if (customLiquid < idealLiquid * 0.8) {
      warnings.lowLiquidWarning = true;
      warnings.warningMessage = 'Too little liquid. Fruits may dry out.';
    }
  }

  return { ingredients, warnings };
};

// Cookie calculation
const calculateCookieIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const flour = config.baseFlour;
  const style = config.cookieStyle || 'classic';

  const butter = flour * COOKIE_BAKERS_PERCENTAGES.BUTTER;
  const sugar = flour * COOKIE_BAKERS_PERCENTAGES.SUGAR;
  const salt = flour * COOKIE_BAKERS_PERCENTAGES.SALT;
  const eggs = flour * COOKIE_BAKERS_PERCENTAGES.EGGS;

  let ingredients: Record<string, Ingredient> = {
    flour: { label: 'Flour', grams: Math.round(flour) },
    butter: { label: 'Softened Butter', grams: Math.round(butter) },
    sugar: { label: 'Sugar', grams: Math.round(sugar) },
    eggs: { label: 'Eggs', grams: Math.round(eggs), note: `~${Math.round(eggs / 50)} large egg(s)` },
    salt: { label: 'Salt', grams: Math.round(salt) },
    bakingPowder: { label: 'Baking Powder', grams: Math.round(flour * COOKIE_BAKERS_PERCENTAGES.BAKING_POWDER) },
  };

  if (style === 'classic') {
    const chocolate = flour * COOKIE_BAKERS_PERCENTAGES.CHOCOLATE_CHIPS;
    ingredients.chocolate = { label: 'Chocolate Chips', grams: Math.round(chocolate) };
  } else if (style === 'ube') {
    const ubeExtract = flour * COOKIE_BAKERS_PERCENTAGES.UBE_EXTRACT;
    const powdered = flour * COOKIE_BAKERS_PERCENTAGES.POWDERED_SUGAR;
    ingredients.ubeExtract = { label: 'Ube Extract', grams: Math.round(ubeExtract) };
    ingredients.powderedSugar = { label: 'Powdered Sugar (Rolling)', grams: Math.round(powdered) };
  }

  return { ingredients, warnings: {} };
};

// Brownie calculation
const calculateBrownieIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const flour = config.baseFlour;
  const style = config.brownieStyle || 'fudgy';

  let percentages = BROWNIE_BAKERS_PERCENTAGES;
  if (style === 'foodForTheGods') {
    percentages = FFTG_BAKERS_PERCENTAGES;
  }

  const butter = flour * percentages.BUTTER;
  const sugar = flour * percentages.SUGAR;
  const salt = flour * percentages.SALT;
  const eggs = flour * (percentages.EGGS || 0.80);

  let ingredients: Record<string, Ingredient> = {
    flour: { label: 'Flour', grams: Math.round(flour) },
    butter: { label: 'Butter', grams: Math.round(butter) },
    sugar: { label: 'Sugar', grams: Math.round(sugar) },
    eggs: { label: 'Eggs', grams: Math.round(eggs), note: `~${Math.round(eggs / 50)} large egg(s)` },
    salt: { label: 'Salt', grams: Math.round(salt) },
    bakingPowder: { label: 'Baking Powder', grams: Math.round(flour * percentages.BAKING_POWDER) },
  };

  if (style === 'fudgy') {
    const cocoa = flour * BROWNIE_BAKERS_PERCENTAGES.COCOA;
    const chocolate = flour * BROWNIE_BAKERS_PERCENTAGES.CHOCOLATE;
    ingredients.cocoa = { label: 'Cocoa Powder', grams: Math.round(cocoa) };
    ingredients.chocolate = { label: 'Melted Chocolate', grams: Math.round(chocolate) };
  } else if (style === 'foodForTheGods') {
    const dates = flour * FFTG_BAKERS_PERCENTAGES.DATES;
    const walnuts = flour * FFTG_BAKERS_PERCENTAGES.WALNUTS;
    ingredients.dates = { label: 'Chopped Dates', grams: Math.round(dates) };
    ingredients.walnuts = { label: 'Chopped Walnuts', grams: Math.round(walnuts) };
  }

  return { ingredients, warnings: {} };
};

// Empanada calculation
const calculateEmpanadaIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const flour = config.baseFlour;
  const fatType = config.fatType || 'butter';

  const fat = flour * EMPANADA_BAKERS_PERCENTAGES.FAT;
  const water = flour * EMPANADA_BAKERS_PERCENTAGES.WATER;
  const salt = flour * EMPANADA_BAKERS_PERCENTAGES.SALT;

  const fatLabel = fatType === 'shortening' ? 'COLD SHORTENING 🧈' : 'COLD BUTTER 🧈';

  let ingredients: Record<string, Ingredient> = {
    flour: { label: 'Flour', grams: Math.round(flour), bg: 'bg-blue-50' },
    fat: { label: fatLabel, grams: Math.round(fat), bg: 'bg-blue-50', note: 'Cut into small cubes' },
    water: { label: 'Ice Water', grams: Math.round(water), bg: 'bg-blue-50', note: 'Keep very cold' },
    salt: { label: 'Salt', grams: Math.round(salt), bg: 'bg-blue-50' },
  };

  return { ingredients, warnings: {} };
};

// Profile calculation for Bread mode
export const calculateProfile = (config: RecipeConfig): DoughProfile => {
  if (config.recipeMode !== 'bread') {
    return { softness: 3, richness: 3, chewiness: 3 };
  }

  const flourType = config.flourType || 'ap';
  const liquidBase = config.liquidBase || 'water';
  const technique = config.breadTechnique || 'none';
  const mixin = config.breadMixin || 'none';

  let softness = 2;
  if (technique === 'tangzhong') softness += 2;
  if (technique === 'egg') softness += 0.5;
  if (['milk', 'evap', 'condensed'].includes(liquidBase)) softness += 0.5;
  if (flourType === 'ap') softness += 0.5;

  let richness = 1;
  if (liquidBase === 'condensed') richness += 3;
  else if (['milk', 'evap'].includes(liquidBase)) richness += 1;
  if (technique === 'egg') richness += 1;
  if (mixin !== 'none') richness += 0.5;

  let chewiness = 1;
  if (flourType === 'bread') chewiness += 3;
  if (flourType === 'wheat') chewiness += 2;
  if (flourType === 'ap') chewiness += 1.5;
  if (technique === 'none') chewiness += 0.5;

  return {
    softness: Math.min(5, softness),
    richness: Math.min(5, richness),
    chewiness: Math.min(5, chewiness)
  };
};

// Formatting helpers
export const formatCups = (g: number) => {
  const cups = g * CONVERSIONS.CUPS_PER_GRAM_FLOUR;
  return cups > 0 ? `~${cups.toFixed(1)} cups 🥛` : '';
};

export const formatTbsp = (g: number) => {
  const tbsp = g * CONVERSIONS.TBSP_PER_GRAM;
  return tbsp > 0 ? `~${tbsp.toFixed(1)} tbsp 🥄` : '';
};

export const formatTsp = (g: number) => {
  const tsp = g * CONVERSIONS.TSP_PER_GRAM;
  return tsp > 0 ? `~${tsp.toFixed(1)} tsp 🤏` : '';
};

export const formatMl = (g: number) => {
  const ml = g * CONVERSIONS.ML_PER_GRAM;
  return ml > 0 ? `${Math.round(ml)} mL 💧` : '';
};