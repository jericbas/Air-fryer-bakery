import { describe, it, expect } from 'vitest';
import { calculateIngredients } from '../utils/calculations';
import { RecipeConfig, FlourType, LiquidBase, Technique, MixinType, SubstituteInputs } from '../types';

// --- Test Cases for standard calculations (Smoke check) ---

describe('calculateIngredients', () => {
    it('should correctly calculate ingredients for a basic AP bread recipe (no substitutes)', () => {
        const config: RecipeConfig = {
            flourWeight: 500,
            flourType: 'ap',
            liquidBase: 'water',
            technique: 'none',
            mixin: 'none'
        };
        const ingredients = calculateIngredients(config);

        // Assert basic calculations based on constants (checking for the right magnitude)
        expect(ingredients.mainFlour).toBeCloseTo(500, 1); // Should be close to original weight if no subs applied
        expect(ingredients.saltWeight).toBeCloseTo(10, 1); // 500 * 0.02
        expect(ingredients.yeastWeight).toBeCloseTo(7.5, 1); // 500 * 0.015
        expect(ingredients.oilWeight).toBeCloseTo(40, 1); // 500 * 0.08
    });

    it('should correctly calculate ingredients for a Tangzhong bread recipe', () => {
        const config: RecipeConfig = {
            flourWeight: 600,
            flourType: 'bread',
            liquidBase: 'water',
            technique: 'tangzhong',
            mixin: 'none'
        };
        const ingredients = calculateIngredients(config);

        // Tangzhong requires initial flour adjustment and liquid reduction
        expect(ingredients.tzFlour).toBeCloseTo(30, 1); // 600 * 0.05
        expect(ingredients.mainFlour).toBeCloseTo(570, 1); // 600 - 30
    });

    it('should handle condensed milk substitution correctly', () => {
        const config: RecipeConfig = {
            flourWeight: 400,
            flourType: 'ap',
            liquidBase: 'condensed',
            technique: 'none',
            mixin: 'none'
        };
        const ingredients = calculateIngredients(config);

        // Check that sugar is zeroed out and condensed weight is calculated
        expect(ingredients.sugarWeight).toBeCloseTo(0, 1);
        expect(ingredients.condensedWeight).toBeCloseTo(8, 1); // 400 * 0.20
    });

    it('should incorporate advanced flour alternative substitution (e.g., whole-wheat)', () => {
        const config: RecipeConfig = {
            flourWeight: 500,
            flourType: 'ap',
            liquidBase: 'water',
            technique: 'none',
            mixin: 'none'
        };
        const substitutes: SubstituteInputs = { flourAlternative: { type: 'whole-wheat', ratioFactor: 0.9 } };

        const ingredients = calculateIngredients({ ...config, substitutes });

        // Main flour should be reduced by the substitute factor (500 * 0.9)
        expect(ingredients.mainFlour).toBeCloseTo(450, 1); 
    });
});