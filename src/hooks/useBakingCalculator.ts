import { useState, useEffect, useMemo } from 'react';
import { calculateIngredientWeights, RecipeMode, FlourType, IngredientWeight } from '../utils/bakingMath';

/**
 * Calculates structural warning states based on ingredient ratios (e.g., liquid balance).
 * @param liquidGrams The calculated weight of the primary liquid component in grams.
 * @param flourGrams The base flour weight used for calculation.
 * @returns A string describing any detected warnings, or null if all are nominal.
 */
const calculateLiquidWarning = (liquidGrams: number, flourGrams: number): string | null => {
    if (flourGrams === 0) return "Cannot determine liquid balance without flour weight.";

    // Assume standard safe ratio range based on common baking practices (e.g., 55% to 75%)
    const MIN_RATIO = 0.55;
    const MAX_RATIO = 0.80;
    
    const actualRatio = liquidGrams / flourGrams;

    if (actualRatio < MIN_RATIO) {
        return `⚠️ WARNING: Low Liquid Content Detected (${(actualRatio * 100).toFixed(0)}%). Increase liquid to prevent dry dough.`;
    } else if (actualRatio > MAX_RATIO) {
        return `💧 WARNING: High Liquid Content Detected (${(actualRatio * 100).toFixed(0)}%). Reduce liquid or increase flour base.`;
    }

    // Check for the specific Condensada rule violation warning state (if implemented later)
    // if (/* check for complex rule failure */ ) {
    //     return "⚠️ WARNING: Complex rule conflict detected. Review ingredient interactions.";
    // }

    return null; // No warnings found
}


/**
 * Custom hook that handles all ingredient weight calculations for baking recipes.
 * Includes logic to adjust weights based on dietary constraints like diabetic mode.
 * @param initialFlourWeight The base flour weight (e.g., 500g).
 * @param recipeMode The intended use case ('bread', 'cake', or 'cookie').
 * @param flourType The type of flour used.
 * @param isDiabeticMode A boolean flag indicating if diabetic dietary guidelines should be applied.
 * @returns An object containing the calculated ingredient weights and a function to recalculate them, along with validation warnings.
 */
export const useBakingCalculator = (
    initialFlourWeight: number, 
    recipeMode: RecipeMode, 
    flourType: FlourType, 
    isDiabeticMode: boolean = false
) => {
    // State for managing the core calculation parameters
    const [currentFlourWeight, setCurrentFlourWeight] = useState(initialFlourWeight);

    /**
     * Core function to calculate weights using the utility library.
     * This hook uses the external calculation logic which now supports diabetic mode and complex rulesets.
     */
    const calculateWeights = (flourWeight: number, isDiabeticModeFlag: boolean): Record<string, IngredientWeight> => {
        // Pass all necessary parameters, including the new boolean flag
        return calculateIngredientWeights(flourWeight, recipeMode, flourType, isDiabeticModeFlag);
    };

    /**
     * Calculates and memoizes the results whenever dependencies change.
     */
    const calculatedWeights = useMemo(() => {
        // Calculate weights based on current state and mode flag
        return calculateWeights(currentFlourWeight, isDiabeticMode);
    }, [currentFlourWeight, recipeMode, flourType, isDiabeticMode]);

    /**
     * Function to update the flour weight and trigger a recalculation.
     * @param newWeight The new base flour weight in grams.
     */
    const setFlourWeight = (newWeight: number) => {
        setCurrentFlourWeight(Math.max(0, newWeight));
    };

    // Return the state and setter functions for consumption by components, plus warnings.
    return {
        calculatedWeights,
        setFlourWeight,
        validationWarnings: calculateLiquidWarning(calculatedWeights['liquid']?.grams || 0, currentFlourWeight)
    };
}