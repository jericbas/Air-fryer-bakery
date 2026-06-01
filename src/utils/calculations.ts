import { FOOD_TYPE_RATIOS, CRISPNESS_MODIFIERS } from './constants/recipeConfig';
import { RecipeConfig, CalculatedIngredients, DoughProfile, SubstituteInputs } from '../types';

/**
 * Calculates the required ingredients for a bread recipe, incorporating advanced substitution logic.
 * This function strictly adheres to the Single Responsibility Principle (SRP).
 * 
 * @param config The primary recipe configuration defining inputs.
 * @returns An object containing calculated ingredient amounts with substitutions applied.
 */
export const calculateIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const { flourWeight: weight, flourType, liquidBase, technique, substitutes } = config;

  // --- 1. Handle Flour Substitutions and Primary Ingredient Weighting ---
  let mainFlour = weight;
  let substituteFactor = 1.0;

  if (substitutes?.flourAlternative && ['whole-wheat', 'rye'].includes(substitutes.flourAlternative.type)) {
    const alt = substitutes.flourAlternative;
    // Calculate the actual grams of alternative flour used, adjusting for its ratio factor
    mainFlour = weight * alt.ratioFactor; 
    substituteFactor = alt.ratioFactor;
  }

  // --- 2. Standard Calculations (Base Ingredients) ---
  let totalLiquid = mainFlour * HYDRATION_RATES[flourType];
  const saltWeight = weight * BAKERS_PERCENTAGES.SALT;
  const yeastWeight = weight * BAKERS_PERCENTAGES.YEAST;
  const oilWeight = weight * BAKERS_PERCENTAGES.OIL;
  const mixinWeight = weight * BAKERS_PERCENTAGES.MIXIN;

  let sugarWeight = weight * BAKERS_PERCENTAGES.SUGAR;
  let condensedWeight = 0;
  let liquidName = 'Water';
  let baseLiquidAmount = totalLiquid;
  let eggCount = 0;
  let tzFlour = 0;
  let tzLiquid = 0;


  // --- 3. Advanced Substitutions and Liquid Adjustments (Handling Inputs) ---

  if (liquidBase === 'condensed') {
    const condensedGrams = weight * 0.20; // Example factor
    condensedWeight = condensedGrams;
    sugarWeight = 0;
    // Reduced liquid contribution from condensed milk vs simple water calculation
    baseLiquidAmount = Math.max(0, totalLiquid - (condensedGrams * 0.30)); 
  } else if (liquidBase === 'flaxegg' && substitutes?.eggSubstituteWeightGrams) {
    // Example: Flax Egg Replacement (Assuming a fixed amount of flax for this calculation model)
    const flaxWeight = substitutes.eggSubstituteWeightGrams;
    sugarWeight += 25; // Adding compensating sugar mass
    baseLiquidAmount = Math.max(0, baseLiquidAmount + 30); // Assuming liquid boost from mixing process
  } else if (liquidBase === 'milk') {
    liquidName = 'Fresh Milk';
  } else if (liquidBase === 'evap') {
    liquidName = 'Evaporated (Evap)';
  }


  // --- 4. Technique-Specific Calculations (Modifying Primary Components) ---
  if (technique === 'egg' && !substitutes?.eggSubstituteWeightGrams) {
    eggCount = Math.max(1, Math.round(weight / 400));
    const eggLiquidContribution = eggCount * 50; // ~50g per egg liquid contribution
    baseLiquidAmount = Math.max(0, baseLiquidAmount - eggLiquidContribution);
  } else if (technique === 'tangzhong') {
    tzFlour = weight * 0.05;
    tzLiquid = tzFlour * 5;
    mainFlour = mainFlour - tzFlour; // Adjust primary flour weight for tangzhong inclusion
    baseLiquidAmount = Math.max(0, baseLiquidAmount - tzLiquid);
  }

  // --- Final Ingredient Assembly (Applying Substitution Factor) ---
  return {
    mainFlour: parseFloat((mainFlour * substituteFactor).toFixed(2)), 
    mainLiquid: parseFloat(Math.max(0, baseLiquidAmount).toFixed(2)), 
    saltWeight: parseFloat((weight * BAKERS_PERCENTAGES.SALT).toFixed(2)),
    yeastWeight: parseFloat((weight * BAKERS_PERCENTAGES.YEAST).toFixed(2)),
    oilWeight: parseFloat((weight * BAKERS_PERCENTAGES.OIL).toFixed(2)),
    sugarWeight: parseFloat(Math.max(0, sugarWeight).toFixed(2)),
    condensedWeight: parseFloat(Math.max(0, condensedWeight).toFixed(2)),
    mixinWeight: parseFloat((weight * BAKERS_PERCENTAGES.MIXIN).toFixed(2)),
    eggCount: eggCount,
    tzFlour: parseFloat((tzFlour * substituteFactor).toFixed(2)), // Apply substitution factor to all flour parts
    tzLiquid: parseFloat((tzLiquid * substituteFactor).toFixed(2)),
    liquidName: liquidName,
  };
};