/**
 * ICalculationEngine.ts
 * Defines the mandatory contract for all calculation services within the air-fryer bread calculator project.
 * Adheres to the Dependency Inversion Principle (DIP).
 */

// --- Types ---

export interface BreadIngredients {
  flourWeightGrams: number; // e.g., 500g
  liquidVolumeMl: number;   // e.g., 300ml
  yeastType: 'instant' | 'active';
  restTimeHours: number;    // Time for initial proofing (hours)
}

export interface ProfileInput {
  recipeName: string;
  profileModifiers: {
    highProtein?: boolean; // e.g., adding whey isolate
    lowCarb?: boolean;     // e.g., replacing flour with almond meal
  };
}

/**
 * Represents the final, calculated results of the bread recipe.
 */
export interface CalculationResult {
  yieldWeightGrams: number;
  estimatedBakeTimeMinutes: number;
  suggestedRestingPeriodHours: number;
  successMessage: string; // Feedback to the user (e.g., "Perfect blend!")
}

// --- The Interface Contract ---

export interface ICalculationEngine {
  /**
   * Performs the core calculation based on mandatory ingredients and general formula rules.
   * @param ingredients - Basic measured components of the bread dough.
   * @returns CalculationResult containing optimized metrics.
   */
  calculate(ingredients: BreadIngredients): CalculationResult;

  /**
   * Executes advanced, profile-specific calculations (e.g., high protein or low carb modifications).
   * This allows for extension without breaking core functionality (Open/Closed Principle).
   * @param input - Structured data defining the recipe profile modifiers.
   * @returns CalculationResult tailored to the specific lifestyle goal.
   */
  calculateProfile(input: ProfileInput): CalculationResult;

  /**
   * Utility function for calculating required quantities based on user needs (e.g., scaling recipes).
   * @param baseWeightGrams The original recipe weight in grams.
   * @param targetYieldGrams The desired final yield weight in grams.
   * @returns The necessary scaling factor (ratio).
   */
  calculateScalingFactor(baseWeightGrams: number, targetYieldGrams: number): number;
}