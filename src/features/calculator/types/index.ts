/**
 * Unified types for the Air Fryer Bakery calculator feature.
 * Consolidates types from types/index.ts and ICalculationEngine.ts
 */

// --- Enums / Literal Types ---
export type FlourType = 'ap' | 'bread' | 'wheat';
export type LiquidBase = 'water' | 'milk' | 'evap' | 'condensed';
export type Technique = 'none' | 'egg' | 'tangzhong';
export type MixinType = 'none' | 'Raisins (Pasas)' | 'Chocolate Chips' | 'Cheese (Cheddar/Edam)' | 'Mozzarella Cheese' | 'Mixed Nuts';
export type RecipeMode = 'bread' | 'cake' | 'cookie';

// --- Configuration Types ---
export interface SubstituteInputs {
  flourAlternative?: {
    type: string;
    ratioFactor: number;
  };
}

export interface RecipeConfig {
  flourWeight: number;
  flourType: FlourType;
  liquidBase: LiquidBase;
  technique: Technique;
  mixin: MixinType;
  recipeMode: RecipeMode;
  substitutes?: SubstituteInputs;
  // Extended options for cake/cookie modes
  isDiabetic?: boolean;
  customFruitWeight?: number;
  customLiquidVolume?: number;
}

// --- Calculation Result Types ---
export interface Weight {
  grams: number;
}

export interface IngredientWeight extends Weight {
  unit?: string; // e.g., "ml", "tsp", "cups"
  label?: string; // Display label
}

export interface CalculatedIngredients {
  // Flour breakdown
  mainFlour: number;
  tzFlour: number;
  
  // Liquid breakdown
  mainLiquid: number;
  tzLiquid: number;
  liquidName: string;
  condensedWeight: number;
  
  // Core ingredients
  saltWeight: number;
  yeastWeight: number;
  oilWeight: number;
  sugarWeight: number;
  eggCount: number;
  
  // Mix-ins
  mixinWeight: number;
  mixinLabel: string;
  
  // Totals
  totalWeight: number;
  totalLiquid: number;
}

export interface DoughProfile {
  softness: number;    // 0-5
  richness: number;    // 0-5
  chewiness: number;   // 0-5
}

// --- Smart Instructions Types ---
export interface InstructionStep {
  order: number;
  title: string;
  description: string;
  temperature?: number;
  timeMinutes?: number;
  icon?: string;
  warning?: string;
}

export interface SmartInstructions {
  steps: InstructionStep[];
  warnings: string[];
  tips: string[];
}

// --- Scaling Types ---
export interface ScalingResult {
  factor: number;
  scaledIngredients: Record<string, IngredientWeight>;
  newTotalWeight: number;
}

// --- Form Input Types (for UI state) ---
export interface FormInputs {
  flourWeight: number;
  recipeMode: RecipeMode;
  flourType: FlourType;
  liquidBase: LiquidBase;
  technique: Technique;
  mixin: MixinType;
  isDiabetic: boolean;
  customFruitWeight: number;
  customLiquidVolume: number;
  // Air fryer specific
  airFryerModel?: string;
  airFryerWattage?: number;
}