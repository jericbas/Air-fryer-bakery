import { describe, it, expect } from 'vitest';
import { calculateIngredients } from '../utils/calculations.js';
import { RecipeConfig } from '../types.js';

describe('calculateIngredients', () => {
  it('should calculate traditional fruit cake ingredients correctly', () => {
    const config: RecipeConfig = {
      baseFlour: 500,
      recipeMode: 'fruitCake',
      isDiabetic: false,
      cakeStyle: 'traditional',
      jamType: 'none',
      soakLiquid: 'none',
      useCustomLiquid: false,
    };

    const result = calculateIngredients(config);

    expect(result.ingredients.flour.grams).toBe(500);
    expect(result.ingredients.butter.grams).toBe(500);
    expect(result.ingredients.sugar.grams).toBe(500);
  });
});