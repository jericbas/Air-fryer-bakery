/**
 * Unified Bakery Calculator Hook
 * Consolidates useBreadCalculator and useBakingCalculator into a single comprehensive hook.
 * Manages all state, calculations, and derived values for the baking calculator.
 */

import { useState, useMemo, useCallback } from 'react';
import {
  RecipeConfig,
  CalculatedIngredients,
  DoughProfile,
  SmartInstructions,
  FormInputs,
  RecipeMode,
  FlourType,
  LiquidBase,
  Technique,
  MixinType,
  ScalingResult,
} from '../types';
import {
  calculateIngredients,
  calculateProfile,
  generateInstructions,
  calculateScaling,
  formatIngredient,
} from '../utils/calculations';
import { AIR_FRYER_PRESETS } from '../utils/constants';

// Default initial state
const DEFAULT_CONFIG: RecipeConfig = {
  flourWeight: 500,
  flourType: 'ap',
  liquidBase: 'water',
  technique: 'none',
  mixin: 'none',
  isDiabetic: false,
  customFruitWeight: 100,
  customLiquidVolume: 0,
  recipeMode: 'bread',
};

const DEFAULT_FORM_INPUTS: FormInputs = {
  flourWeight: 500,
  recipeMode: 'bread',
  flourType: 'ap',
  liquidBase: 'water',
  technique: 'none',
  mixin: 'none',
  isDiabetic: false,
  customFruitWeight: 100,
  customLiquidVolume: 0,
};

interface UseBakeryCalculatorReturn {
  // Raw config state
  config: RecipeConfig;
  formInputs: FormInputs;
  
  // Computed values
  ingredients: CalculatedIngredients;
  profile: DoughProfile;
  instructions: SmartInstructions;
  
  // Actions
  updateConfig: <K extends keyof RecipeConfig>(key: K, value: RecipeConfig[K]) => void;
  updateFormInput: <K extends keyof FormInputs>(key: K, value: FormInputs[K]) => void;
  resetConfig: () => void;
  resetFormInputs: () => void;
  
  // Scaling
  scaleToWeight: (targetWeight: number) => ScalingResult;
  
  // Formatting helpers
  formatIngredient: (name: string, grams: number, type?: 'flour' | 'sugar' | 'butter' | 'liquid' | 'small' | 'spice') => string;
  
  // Constants for UI
  airFryerPresets: typeof AIR_FRYER_PRESETS;
  flourTypes: FlourType[];
  liquidBases: LiquidBase[];
  techniques: Technique[];
  mixins: MixinType[];
  recipeModes: RecipeMode[];
}

/**
 * Main hook for the Air Fryer Bakery Calculator.
 * Provides all state management and derived calculations.
 */
export const useBakeryCalculator = (): UseBakeryCalculatorReturn => {
  const [config, setConfig] = useState<RecipeConfig>(DEFAULT_CONFIG);
  const [formInputs, setFormInputs] = useState<FormInputs>(DEFAULT_FORM_INPUTS);
  
  // Sync form inputs to config (config is the source of truth for calculations)
  const updateConfig = useCallback(<K extends keyof RecipeConfig>(key: K, value: RecipeConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    // Also update form inputs if the key exists there
    setFormInputs(prev => ({ ...prev, [key as string]: value }));
  }, []);
  
  const updateFormInput = useCallback(<K extends keyof FormInputs>(key: K, value: FormInputs[K]) => {
    setFormInputs(prev => ({ ...prev, [key]: value }));
    // Sync to config
    setConfig(prev => ({ ...prev, [key as string]: value }));
  }, []);
  
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);
  
  const resetFormInputs = useCallback(() => {
    setFormInputs(DEFAULT_FORM_INPUTS);
    setConfig(DEFAULT_CONFIG);
  }, []);
  
  // Memoized calculations - only recompute when config changes
  const ingredients = useMemo(() => calculateIngredients(config), [config]);
  
  const profile = useMemo(() => calculateProfile(config, ingredients), [config, ingredients]);
  
  const instructions = useMemo(() => generateInstructions(config, ingredients), [config, ingredients]);
  
  // Scaling function
  const scaleToWeight = useCallback((targetWeight: number): ScalingResult => {
    return calculateScaling(ingredients, targetWeight);
  }, [ingredients]);
  
  // Return all state and actions
  return {
    config,
    formInputs,
    ingredients,
    profile,
    instructions,
    updateConfig,
    updateFormInput,
    resetConfig,
    resetFormInputs,
    scaleToWeight,
    formatIngredient,
    airFryerPresets: AIR_FRYER_PRESETS,
    flourTypes: ['ap', 'bread', 'wheat'] as FlourType[],
    liquidBases: ['water', 'milk', 'evap', 'condensed'] as LiquidBase[],
    techniques: ['none', 'egg', 'tangzhong'] as Technique[],
    mixins: ['none', 'Raisins (Pasas)', 'Chocolate Chips', 'Cheese (Cheddar/Edam)', 'Mozzarella Cheese', 'Mixed Nuts'] as MixinType[],
    recipeModes: ['bread', 'cake', 'cookie'] as RecipeMode[],
  };
};