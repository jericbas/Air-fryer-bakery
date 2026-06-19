import { HYDRATION_RATES, BAKERS_PERCENTAGES } from '../constants/recipeConfig';
import { RecipeConfig, CalculatedIngredients, DoughProfile } from '../types/index';
import { applyCondensadaRule } from './bakingRules';

/**
 * Performs core baking calculations based on the RecipeConfig.
 * Adheres to Baker's Math (Flour = 100%).
 */
export const calculateIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const { flourWeight: weight, flourType, liquidBase, technique } = config;
  
  // Standard Baker's Percentages
  const totalLiquid = weight * HYDRATION_RATES[flourType];
  const saltWeight = weight * BAKERS_PERCENTAGES.SALT;
  const yeastWeight = weight * BAKERS_PERCENTAGES.YEAST;
  const oilWeight = weight * BAKERS_PERCENTAGES.OIL;
  const mixinWeight = weight * BAKERS_PERCENTAGES.MIXIN;

  let sugarWeight = weight * BAKERS_PERCENTAGES.SUGAR;
  let condensedWeight = 0;
  let liquidName = 'Water';
  let baseLiquidAmount = totalLiquid;

  // Liquid Base Specific Logic
  if (liquidBase === 'milk') {
    liquidName = 'Fresh Milk';
  } else if (liquidBase === 'evap') {
    liquidName = 'Evaporated (Evap)';
  } else if (liquidBase === 'condensed') {
    condensedWeight = weight * 0.20;
    // Apply Condensada Rule: reduce liquid by 30% of condensed milk weight, sugar to 0
    [baseLiquidAmount, sugarWeight] = applyCondensadaRule(baseLiquidAmount, condensedWeight);
  }

  let eggCount = 0;
  let tzFlour = 0;
  let tzLiquid = 0;
  let mainFlour = weight;
  let mainLiquid = baseLiquidAmount;

  // Handle Flour Substitutions
  if (config.substitutes?.flourAlternative) {
    const { ratioFactor } = config.substitutes.flourAlternative;
    mainFlour = weight * ratioFactor;
  }

  // Technique Specific Logic
  if (technique === 'egg') {
    eggCount = Math.max(1, Math.round(weight / 400));
    const eggLiquid = eggCount * 50;
    mainLiquid = Math.max(0, mainLiquid - eggLiquid);
  } else if (technique === 'tangzhong') {
    tzFlour = weight * 0.05;
    tzLiquid = tzFlour * 5;
    mainFlour = weight - tzFlour;
    mainLiquid = Math.max(0, mainLiquid - tzLiquid);
  }

  return {
    mainFlour, mainLiquid, saltWeight, yeastWeight, oilWeight, sugarWeight,
    condensedWeight, mixinWeight, eggCount, tzFlour, tzLiquid, liquidName
  };
};

/**
 * Calculates a Dough Profile (softness, richness, chewiness)
 * based on ingredient types and techniques.
 */
export const calculateProfile = (config: RecipeConfig): DoughProfile => {
  const { flourType, liquidBase, technique, mixin } = config;

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
export const formatCups = (g: number) => `~${(g / 125).toFixed(1)} cups 🥛`;
export const formatTbsp = (g: number, density: number) => `~${(g / density).toFixed(1)} Tbsp 🥄`;
export const formatTsp = (g: number, density: number) => `~${(g / density).toFixed(1)} tsp 🤏`;
export const formatMl = (g: number) => `${Math.round(g)} mL 💧`;
