import { useState, useMemo } from 'react';
import { RecipeConfig, RecipeMode } from '../types.js';
import { calculateIngredients, calculateProfile } from '../utils/calculations.js';

export const useBakingCalculator = () => {
  const [config, setConfig] = useState<RecipeConfig>({
    baseFlour: 250,
    recipeMode: 'fruitCake',
    isDiabetic: false,
    // Bread defaults
    flourType: 'ap',
    liquidBase: 'water',
    breadTechnique: 'none',
    breadMixin: 'none',
    // Fruit Cake defaults
    cakeStyle: 'traditional',
    jamType: 'none',
    soakLiquid: 'none',
    useCustomLiquid: false,
    // Cookie defaults
    cookieStyle: 'classic',
    // Brownie defaults
    brownieStyle: 'fudgy',
    // Empanada defaults
    fatType: 'butter',
  });

  const updateConfig = <K extends keyof RecipeConfig>(key: K, value: RecipeConfig[K]) => {
    setConfig((prev: RecipeConfig) => ({ ...prev, [key]: value }));
  };

  const setRecipeMode = (mode: RecipeMode) => {
    updateConfig('recipeMode', mode);
  };

  const ingredients = useMemo(() => calculateIngredients(config), [config]);
  const profile = useMemo(() => calculateProfile(config), [config]);

  return {
    config,
    updateConfig,
    setRecipeMode,
    ingredients,
    profile,
  };
};

// Keep old export for backwards compatibility
export { useBakingCalculator as useBreadCalculator };