import { describe, test, expect } from 'vitest';
import { calculateIngredients } from '../../features/calculator/utils/calculations';
import { RecipeConfig } from '../../features/calculator/types';

describe('Baking Calculations Engine', () => {
  const baseConfig: RecipeConfig = {
    flourWeight: 1000,
    flourType: 'ap',
    liquidBase: 'water',
    technique: 'none',
    mixin: 'none',
    recipeMode: 'bread',
  };

  test('should calculate standard bread weights correctly', () => {
    const config: RecipeConfig = { ...baseConfig, flourType: 'bread' };
    const result = calculateIngredients(config);
    
    expect(result.mainFlour).toBe(1000);
    expect(result.mainLiquid).toBe(1000 * 0.65); // hydration for bread
    expect(result.saltWeight).toBe(1000 * 0.02);
    expect(result.yeastWeight).toBe(1000 * 0.015);
    expect(result.oilWeight).toBe(1000 * 0.08);
    expect(result.sugarWeight).toBe(1000 * 0.08);
  });

  test('should apply Condensada Rule correctly', () => {
    const config: RecipeConfig = { ...baseConfig, liquidBase: 'condensed' };
    const result = calculateIngredients(config);
    
    // Condensed weight is 20% of 1000 = 200
    expect(result.condensedWeight).toBe(200);
    // Sugar weight should be 0
    expect(result.sugarWeight).toBe(0);
    // baseLiquidAmount = totalLiquid - (condensedWeight * 0.30)
    // totalLiquid = 1000 * 0.60 = 600
    // expected = 600 - (200 * 0.30) = 540
    expect(result.mainLiquid).toBe(540);
  });

  test('should handle Tangzhong technique', () => {
    const config: RecipeConfig = { ...baseConfig, technique: 'tangzhong' };
    const result = calculateIngredients(config);
    
    // tzFlour = 1000 * 0.05 = 50
    expect(result.tzFlour).toBe(50);
    // tzLiquid = 50 * 5 = 250
    expect(result.tzLiquid).toBe(250);
    // mainFlour = 1000 - 50 = 950
    expect(result.mainFlour).toBe(950);
    // mainLiquid = 600 - 250 = 350
    expect(result.mainLiquid).toBe(350);
  });

  test('should handle Egg technique', () => {
    const config: RecipeConfig = { ...baseConfig, technique: 'egg' };
    const result = calculateIngredients(config);
    
    // eggCount = Math.max(1, Math.round(1000 / 400)) = 3
    expect(result.eggCount).toBe(3);
    // eggLiquid = 3 * 50 = 150
    // mainLiquid = 600 - 150 = 450
    expect(result.mainLiquid).toBe(450);
  });
});