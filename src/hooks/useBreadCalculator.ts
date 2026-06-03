import { useState, useMemo } from 'react';
import { RecipeConfig, FlourType, LiquidBase, Technique, MixinType } from '../types';
import { calculateIngredients, calculateProfile } from '../utils/calculations';

export const useBreadCalculator = () => {
  const [config, setConfig] = useState<RecipeConfig>({
    flourWeight: 500,
    flourType: 'ap',
    liquidBase: 'water',
    technique: 'none',
    mixin: 'none'
  });

  const updateConfig = <K extends keyof RecipeConfig>(key: K, value: RecipeConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const ingredients = useMemo(() => calculateIngredients(config), [config]);
  const profile = useMemo(() => calculateProfile(config), [config]);

  return { config, updateConfig, ingredients, profile };
};