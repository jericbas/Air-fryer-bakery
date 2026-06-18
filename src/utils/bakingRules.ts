/**
 * Special baking rules as defined in PLAN2.md.
 * These rules handle specific ingredient interactions and safety checks.
 */

import { LiquidBase } from '../types';

/**
 * The Condensada Rule:
 * If condensed milk is used as the liquid base:
 * - Subtract 30% of the condensed milk weight from the base liquid amount.
 * - Set the sugar weight to 0.
 * 
 * @param baseLiquidAmount - The initially calculated liquid amount.
 * @param condensedWeight - The weight of the condensed milk component.
 * @returns {number, number} - Tuple of [adjustedLiquidAmount, sugarWeight]
 */
export const applyCondensadaRule = (
  baseLiquidAmount: number, 
  condensedWeight: number
): [number, number] => {
  const reduction = condensedWeight * 0.30;
  const adjustedLiquid = Math.max(0, baseLiquidAmount - reduction);
  const sugarWeight = 0;
  
  return [adjustedLiquid, sugarWeight];
};

/**
 * The Fruit Soaking Rule:
 * Validates if the liquid amount for fruit-heavy recipes is within a safe range.
 * The rule flags a "liquid danger" if the liquid is outside 0.8x - 1.5x of 
 * 27% of the fruit weight.
 * 
 * @param liquidAmount - Total liquid weight in grams.
 * @param fruitWeight - Total weight of fruit/mixins in grams.
 * @returns {boolean, string} - Tuple of [isSafe, warningMessage]
 */
export const validateFruitSoaking = (
  liquidAmount: number,
  fruitWeight: number
): [boolean, string] => {
  // Rule: 0.8x to 1.5x of (27% of fruit weight)
  const target = fruitWeight * 0.27;
  const minSafe = target * 0.8;
  const maxSafe = target * 1.5;

  if (liquidAmount < minSafe || liquidAmount > maxSafe) {
    return [false, `Liquid amount (${liquidAmount}g) is outside the safe soaking range for ${fruitWeight}g of fruit. (Ideal: ${minSafe.toFixed(1)}g - ${maxSafe.toFixed(1)}g)`.replace(/\s+/g, ' ').trim()];
  }

  return [true, ""];
};
