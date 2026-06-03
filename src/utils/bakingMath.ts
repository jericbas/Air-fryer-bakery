// src/utils/bakingMath.ts
/**
 * Pure mathematical engine for calculating ingredient weights based on Baker's Percentages.
 * All calculations are relative to the base flour weight (100%).
 */

export type RecipeMode = 'bread' | 'cake' | 'cookie';

export interface IngredientWeight {
    grams: number;
    unit?: string; // e.g., "ml", "tsp" - if unit is provided, it suggests the primary measure.
}

/**
 * Calculates all required ingredient weights based on flour weight and recipe mode.
 * @param baseFlour The total weight of flour used in grams (this is 100% by definition).
 * @param recipeMode The specific baking context ('bread', 'cake', or 'cookie').
 * @returns A map where keys are ingredient names and values are their scaled weights.
 */
export function calculateIngredientWeights(baseFlour: number, recipeMode: RecipeMode): Record<string, IngredientWeight> {
    if (typeof baseFlour !== 'number' || isNaN(baseFlour) || baseFlour <= 0) {
        throw new Error("Base flour weight must be a positive number.");
    }

    // Initialize results map
    const weights: Record<string, IngredientWeight> = {};

    console.log(\`--- Calculating Weights for \${recipeMode} mode with \${baseFlour}g flour ---\`);

    switch (recipeMode) {
        case 'bread':
            weights['flour'] = { grams: baseFlour };
            // 16. Hydration Logic (Bread): Must handle specific hydration rates based on flourType
            const hydrationRate = 0.65; // Example rate for high protein flour
            weights['liquid'] = { grams: baseFlour * hydrationRate, unit: 'grams/ml' };

            // Add other bread components (e.g., salt)
            weights['salt'] = { grams: baseFlour * 0.015 };
            break;

        case 'cake':
            weights['flour'] = { grams: baseFlour };
            // Example cake liquid calculation
            weights['liquid'] = { grams: baseFlour * 0.6, unit: 'grams/ml' };
            weights['sugar'] = { grams: baseFlour * 0.75 };
            break;

        case 'cookie':
            weights['flour'] = { grams: baseFlour };
            // Example cookie calculation
            weights['liquid'] = { grams: baseFlour * 0.4, unit: 'grams/ml' };
            weights['sugar'] = { grams: baseFlour * 1.2 };
            break;

        default:
            throw new Error("Unsupported recipe mode.");
    }


    // --- Special Rule Handling Simulation (Placeholder Logic) ---

    // 18. Condensada Rule: If liquidBase === 'condensed', subtract 30% of input weight, and sugar weights must be zero.
    const isCondensedLiquidUsed = false; // In a real app, this would check the current state/input props
    if (isCondensedLiquidUsed) {
        console.log("Applying Condensada Rule: Liquid adjusted and Sugar set to 0.");
        // Simulation of adjustment
        weights['liquid'] = { grams: weights['liquid'].grams * 0.7, unit: 'grams/ml' };
        delete weights['sugar']; // Assuming sugar key exists for all modes
    }

    // 19. Fruit Soaking Rule: Calculate an ideal range for custom liquids
    const customFruitWeight = baseFlour * 0.1; // Dummy calculation for demonstration
    const idealCustomLiquid = customFruitWeight * 0.27;
    console.log(\`Ideal Custom Liquid Range calculated: \${idealCustomLiquid}g\`);

    // The function returns the final, scaled weights.
    return weights;
}