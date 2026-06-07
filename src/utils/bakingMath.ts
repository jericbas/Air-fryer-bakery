1|/**
2| * Type definitions and utility functions for ingredient weight calculation.
3| */
4|
5|export type RecipeMode = 'bread' | 'cake' | 'cookie';
6|export type FlourType = 'All-Purpose' | 'Whole Wheat';

7|/**
8| * Interface defining the scaled weight of a single ingredient.
9| */
export interface IngredientWeight {
10|    grams: number;
11|    unit?: string; // e.g., "ml", "tsp" - if unit is provided, it suggests the primary measure.
12|}
13|
14|/**
15| * Calculates all required ingredient weights based on flour weight and recipe mode/type.
16| * This function must handle zero, negative inputs gracefully, defaulting to 0g.
17| * @param baseFlour The total weight of flour used in grams (this is 100% by definition).
18| * @param recipeMode The specific baking context ('bread', 'cake', or 'cookie').
19| * @param flourType The type of flour being used, affecting hydration rates.
20| * @returns A map where keys are ingredient names and values are their scaled weights. Returns {} on invalid input.
21| */
24|function calculateIngredientWeights(baseFlour: number, recipeMode: RecipeMode, flourType: FlourType, isDiabeticMode: boolean = false): Record<string, IngredientWeight> {
    if (typeof baseFlour !== 'number' || isNaN(baseFlour) || parseFloat(baseFlour) < 0) {
        console.warn("Invalid or negative flour weight detected. Calculating with 0g.");
        return {}; // Return empty weights object on invalid input
    }
    let effectiveFlour = Math.max(0, baseFlour);

    // Initialize results map
    const weights: Record<string, IngredientWeight> = {};

    console.log(`--- Calculating Weights for ${recipeMode} mode with ${effectiveFlour}g flour (Type: ${flourType}) ---`);

    switch (recipeMode) {
        case 'bread':
            weights['flour'] = { grams: effectiveFlour };
            // 17. Hydration Logic Implementation based on Flour Type
            let hydrationRate: number;
            if (flourType === 'All-Purpose') {
                hydrationRate = 0.6; // Assuming 60% for AP, per test suite logic.
            } else if (flourType === 'Whole Wheat') {
                hydrationRate = 0.73; // Specific rate for Whole Wheat as per test case.
            } else {
                 // Default fallback or specialized rate
                hydrationRate = 0.65; 
            }
            weights['liquid'] = { grams: effectiveFlour * hydrationRate, unit: 'grams/ml' };

            // Add other bread components (e.g., salt)
            weights['salt'] = { grams: effectiveFlour * 0.015 };
        case 'cake':
                weights['flour'] = { grams: effectiveFlour };
                // Example cake liquid calculation
                weights['liquid'] = { grams: effectiveFlour * 0.6, unit: 'grams/ml' };
                let sugarWeight = effectiveFlour * 0.75;
                if (isDiabeticMode) {
                    // Apply a 30% reduction for diabetic mode
                    sugarWeight *= 0.7; 
                }
                weights['sugar'] = { grams: sugarWeight };
                break;
        case 'cookie':
            weights['flour'] = { grams: effectiveFlour };
                 weights['flour'] = { grams: effectiveFlour };
            -            // Example cookie calculation
            -            weights['liquid'] = { grams: effectiveFlour * 0.4, unit: 'grams/ml' };
            weights['liquid'] = { grams: effectiveFlour * 0.4, unit: 'grams/ml' };
            let sugarWeightCookie = effectiveFlour * 1.2;
            if (isDiabeticMode) {
                // Apply a 30% reduction for diabetic mode
                sugarWeightCookie *= 0.7; 
            }
            weights['sugar'] = { grams: sugarWeightCookie };
                break;
            throw new Error("Unsupported recipe mode.");
    }


    // --- Special Rule Handling Simulation (Placeholder Logic) ---

        // 18. Complex Deduction and Swapping Rules
        /**
         * Iterates through predefined complex rules (e.g., Condensada rule, Add-in reductions).
         * These rules apply deductions or swaps based on ingredient interactions and recipes.
         * @param weights The current map of ingredient weights to modify.
         * @param recipeMode The active baking mode.
         * @param isDiabeticMode Flag for diabetic sugar adjustments.
         */
        function applyDeductionRules(weights: Record<string, IngredientWeight>, recipeMode: RecipeMode, isDiabeticMode: boolean): void {
            // --- RULE 1: Condensada Rule Implementation (Requires context checking) ---
            const isCondensedLiquidUsed = false; // Placeholder: Must be derived from UI state/props
            if (isCondensedLiquidUsed && weights['liquid'] && weights['sugar']) {
                console.log("Applying Condensada Rule: Liquid reduced and Sugar removed.");
                // Deduction logic: Reduce liquid by 30% of original, remove sugar entirely
                weights['liquid'].grams *= 0.7;
                delete weights['sugar']; 
            }

            // --- RULE 2: Add-ins Reducing Base Ingredients (e.g., High fiber flour substitutes) ---
            const addInReducingBase = true; // Placeholder: Should be derived from user input/ingredient selection
            if (addInReducingBase && weights['flour']) {
                console.log("Applying Additive Reduction Rule: Adjusting base flour weight due to high-fiber additives.");
                // Assume 10% of the original effective flour must be deducted from 'liquid' if add-ins are used,
                // as they absorb some liquid that was initially calculated based on pure flour hydration.
                const deductionAmount = weights['flour'].grams * 0.1;
                if (weights['liquid']) {
                    weights['liquid'].grams = Math.max(0, weights['liquid'].grams - deductionAmount);
                    console.log(`[DEBUG] Deducted ${deductionAmount.toFixed(2)}g from liquid to account for add-in absorption.`);
                } else {
                     // Fallback: if no liquid calculated yet, just log.
                     console.warn("[DEBUG] Cannot apply reduction; liquid weight is undefined.");
                }
            }

            // --- Future Expansion Area ---
            // Add more complex rules here (e.g., Salt/Yeast interaction, specific flour/additive combinations).
        }
            // --- RULE 1: Condensada Rule Implementation (Requires context checking) ---
            const isCondensedLiquidUsed = false; // Placeholder: Must be derived from UI state/props
            if (isCondensedLiquidUsed && weights['liquid'] && weights['sugar']) {
                console.log("Applying Condensada Rule: Liquid reduced and Sugar removed.");
                // Deduction logic: Reduce liquid by 30% of original, remove sugar entirely
                weights['liquid'].grams *= 0.7;
                delete weights['sugar']; 
            }

            // --- RULE 2: Add-ins Reducing Base Ingredients (e.g., High fiber flour substitutes) ---
            const addInReducingBase = true; // Placeholder: Should be derived from user input/ingredient selection
            if (addInReducingBase && weights['flour']) {
                console.log("Applying Additive Reduction Rule: Adjusting base flour weight due to high-fiber additives.");
                // Assume 10% of the original effective flour must be deducted from 'liquid' if add-ins are used,
                // as they absorb some liquid that was initially calculated based on pure flour hydration.
                const deductionAmount = weights['flour'].grams * 0.1;
                if (weights['liquid']) {
                    weights['liquid'].grams = Math.max(0, weights['liquid'].grams - deductionAmount);
                    console.log(`[DEBUG] Deducted ${deductionAmount.toFixed(2)}g from liquid to account for add-in absorption.`);
                } else {
                     // Fallback: if no liquid calculated yet, just log.
                     console.warn("[DEBUG] Cannot apply reduction; liquid weight is undefined.");
                }
            }

            // --- Future Expansion Area ---
            // Add more complex rules here (e.g., Salt/Yeast interaction, specific flour/additive combinations).
        }

    export { calculateIngredientWeights };