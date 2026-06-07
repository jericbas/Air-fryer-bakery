// src/hooks/useBakingCalculator.tsx
import React, { useState, useMemo } from 'react';
import { calculateIngredientWeights, RecipeMode, IngredientWeight } from '../utils/bakingMath.js';

/**
 * Defines the structure for all inputs required by the baking process.
 * This centralizes state management for primary user inputs.
 */
interface BakingInputs {
    flourWeight: number; // Primary input (grams)
    recipeMode: RecipeMode;
    liquidBase: string;  // e.g., 'water', 'condensed'
    customFruitWeight: number; // grams
}

/**
 * The core custom hook that orchestrates state management and complex calculations.
 * It reads primary inputs and derives a comprehensive, type-safe result object.
 * @returns {object} An object containing the derived state (results) and setter functions for primary inputs.
 */
export const useBakingCalculator = () => {
    const [inputs, setInputs] = useState<BakingInputs>({
        flourWeight: 500, // Default value example
        recipeMode: 'bread',
        liquidBase: 'water',
        customFruitWeight: 100,
    });

    // Memoize the calculation so it only runs when necessary inputs change
    const calculatedResults = useMemo(() => {
        try {
            // Pass relevant data to the pure math engine
            const weights = calculateIngredientWeights(inputs.flourWeight, inputs.recipeMode);

            // Combine and structure results for easy component consumption
            return {
                success: true,
                weights: weights,
                message: "Calculations successful."
            };
        } catch (error) {
            console.error("Calculation error:", error);
            return {
                success: false,
                weights: {} as any,
                message: (error as Error).message || "An unknown calculation error occurred."
            };
        }
    }, [inputs]); // Dependency array ensures recalculation on input change

    // Helper function to update a specific input state
    const setInput = (key: keyof BakingInputs, value: any) => {
        setInputs(prevInputs => ({ ...prevInputs, [key]: value }));
    };

    return {
        inputs: inputs,
        results: calculatedResults,
        setInput: setInput
    };
};