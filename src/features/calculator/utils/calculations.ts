/**
 * Core Calculation Engine - Pure mathematical functions for baking calculations.
 * Consolidates logic from calculations.ts and bakingMath.ts
 * All functions are pure (no side effects) for easy testing.
 */

import {
  RecipeConfig,
  CalculatedIngredients,
  DoughProfile,
  SmartInstructions,
  InstructionStep,
  ScalingResult,
  IngredientWeight,
  FormInputs,
} from '../types';

import {
  HYDRATION_RATES,
  BASE_BAKERS_PERCENTAGES,
  RECIPE_MODE_PERCENTAGES,
  LIQUID_BASE_CONFIG,
  TECHNIQUE_CONFIG,
  MIXIN_CONFIG,
  DIABETIC_SUBSTITUTIONS,
  AIR_FRYER_PRESETS,
  CONVERSION,
  FRUIT_SOAKING,
} from './constants';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Rounds to specified decimal places */
export const round = (value: number, decimals = 1): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/** Clamps a value between min and max */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/** Converts grams to cups */
export const gramsToCups = (grams: number, gramsPerCup: number): string =>
  `~${round(grams / gramsPerCup, 1)} cups`;

/** Converts grams to tablespoons */
export const gramsToTbsp = (grams: number, density: number): string =>
  `~${round(grams / density, 1)} Tbsp`;

/** Converts grams to teaspoons */
export const gramsToTsp = (grams: number, density: number): string =>
  `~${round(grams / density, 1)} tsp`;

/** Formats grams as mL (assuming 1g = 1ml for liquids) */
export const gramsToMl = (grams: number): string => `${round(grams)} mL`;

// ============================================================================
// CONDENSADA RULE
// ============================================================================

/**
 * Applies the Condensada Rule:
 * - Condensed milk is ~30% water, ~45% sugar
 * - Reduces base liquid by 30% of condensed milk weight
 * - Sets added sugar to 0 (condensed milk provides sugar)
 */
export const applyCondensadaRule = (
  baseLiquidAmount: number,
  condensedWeight: number
): { adjustedLiquid: number; sugarWeight: number } => {
  const waterReduction = condensedWeight * LIQUID_BASE_CONFIG.condensed.waterContent!;
  return {
    adjustedLiquid: Math.max(0, baseLiquidAmount - waterReduction),
    sugarWeight: 0,
  };
};

// ============================================================================
// FRUIT SOAKING RULE
// ============================================================================

/**
 * Validates fruit soaking liquid amount.
 * Fruit can absorb ~27% of its weight.
 * Safe range: 0.8x to 1.5x of ideal absorption.
 */
export const validateFruitSoaking = (
  liquidAmount: number,
  fruitWeight: number
): { isSafe: boolean; message: string; idealRange: { min: number; max: number } } => {
  const target = fruitWeight * FRUIT_SOAKING.TARGET_ABSORPTION_RATIO;
  const minSafe = target * FRUIT_SOAKING.MIN_MULTIPLIER;
  const maxSafe = target * FRUIT_SOAKING.MAX_MULTIPLIER;

  const isSafe = liquidAmount >= minSafe && liquidAmount <= maxSafe;
  
  let message = '';
  if (!isSafe) {
    if (liquidAmount < minSafe) {
      message = `⚠️ Low liquid (${round(liquidAmount)}g) for ${round(fruitWeight)}g fruit. Fruit may not hydrate properly. Add ${round(minSafe - liquidAmount)}g more liquid.`;
    } else {
      message = `⚠️ Excess liquid (${round(liquidAmount)}g) for ${round(fruitWeight)}g fruit. May cause soggy texture. Reduce by ${round(liquidAmount - maxSafe)}g.`;
    }
  }

  return { isSafe, message, idealRange: { min: round(minSafe), max: round(maxSafe) } };
};

// ============================================================================
// MAIN CALCULATION ENGINE
// ============================================================================

/**
 * Calculates all ingredient weights based on recipe configuration.
 * This is the core pure function - no React dependencies.
 */
export const calculateIngredients = (config: RecipeConfig): CalculatedIngredients => {
  const { flourWeight, flourType, liquidBase, technique, mixin, substitutes, isDiabetic, customFruitWeight, customLiquidVolume } = config;
  
  // Base hydration from flour type
  const hydrationRate = HYDRATION_RATES[flourType];
  const totalLiquid = flourWeight * hydrationRate;
  
  // Base baker's percentages
  const saltWeight = flourWeight * BASE_BAKERS_PERCENTAGES.SALT;
  const yeastWeight = flourWeight * BASE_BAKERS_PERCENTAGES.YEAST;
  const oilWeight = flourWeight * BASE_BAKERS_PERCENTAGES.OIL;
  let sugarWeight = flourWeight * BASE_BAKERS_PERCENTAGES.SUGAR;
  
  // Handle diabetic substitutions
  let sugarLabel = 'Sugar';
  if (isDiabetic) {
    // Default to erythritol at 1.3x ratio
    sugarWeight = flourWeight * BASE_BAKERS_PERCENTAGES.SUGAR * DIABETIC_SUBSTITUTIONS.sugar.erythritol.ratio;
    sugarLabel = DIABETIC_SUBSTITUTIONS.sugar.erythritol.label;
  }
  
  // Handle flour substitutes
  let mainFlour = flourWeight;
  if (substitutes?.flourAlternative) {
    mainFlour = flourWeight * substitutes.flourAlternative.ratioFactor;
  }
  
  // Liquid base configuration
  const liquidConfig = LIQUID_BASE_CONFIG[liquidBase];
  let liquidName = liquidConfig.name;
  let condensedWeight = 0;
  let baseLiquidAmount = totalLiquid;
  
  // Handle condensed milk special case
  if (liquidBase === 'condensed') {
    condensedWeight = flourWeight * (liquidConfig.condensedFactor || 0.20);
    const { adjustedLiquid, sugarWeight: newSugarWeight } = applyCondensadaRule(baseLiquidAmount, condensedWeight);
    baseLiquidAmount = adjustedLiquid;
    sugarWeight = newSugarWeight;
    sugarLabel = 'Condensed Milk (provides sugar)';
  }
  
  // Technique adjustments
  let eggCount = 0;
  let tzFlour = 0;
  let tzLiquid = 0;
  let mainLiquid = baseLiquidAmount;
  
  const techniqueConfig = TECHNIQUE_CONFIG[technique];
  
  if (technique === 'egg') {
    eggCount = techniqueConfig.eggCount ? techniqueConfig.eggCount(flourWeight) : 0;
    const eggLiquid = eggCount * 50; // ~50g per egg
    mainLiquid = Math.max(0, mainLiquid - eggLiquid);
  } else if (technique === 'tangzhong') {
    tzFlour = flourWeight * (techniqueConfig.flourRatio || 0.05);
    tzLiquid = tzFlour * (techniqueConfig.liquidRatio || 5.0);
    mainFlour = flourWeight - tzFlour;
    mainLiquid = Math.max(0, mainLiquid - tzLiquid);
  }
  
  // Handle custom liquid volume override
  if (customLiquidVolume && customLiquidVolume > 0) {
    mainLiquid = customLiquidVolume;
  }
  
  // Mixin handling
  const mixinConfig = MIXIN_CONFIG[mixin];
  const mixinWeight = flourWeight * mixinConfig.percentage;
  const mixinLabel = mixinConfig.name;
  
  // Calculate totals
  const totalWeight = mainFlour + mainLiquid + tzFlour + tzLiquid + saltWeight + yeastWeight + oilWeight + sugarWeight + condensedWeight + mixinWeight + (eggCount * 50);
  const calcTotalLiquid = mainLiquid + tzLiquid + condensedWeight + (eggCount * 50);
  
  return {
    mainFlour: round(mainFlour),
    tzFlour: round(tzFlour),
    mainLiquid: round(mainLiquid),
    tzLiquid: round(tzLiquid),
    liquidName,
    condensedWeight: round(condensedWeight),
    saltWeight: round(saltWeight),
    yeastWeight: round(yeastWeight),
    oilWeight: round(oilWeight),
    sugarWeight: round(sugarWeight),
    eggCount,
    mixinWeight: round(mixinWeight),
    mixinLabel,
    totalWeight: round(totalWeight),
    totalLiquid: round(calcTotalLiquid),
  };
};

/**
 * Calculates dough profile scores (0-5 scale) based on ingredients and technique.
 */
export const calculateProfile = (config: RecipeConfig, ingredients: CalculatedIngredients): DoughProfile => {
  const { flourType, liquidBase, technique, mixin } = config;
  
  let softness = 2;
  if (technique === 'tangzhong') softness += 2;
  if (technique === 'egg') softness += 0.5;
  if (['milk', 'evap', 'condensed'].includes(liquidBase)) softness += 0.5;
  if (flourType === 'ap') softness += 0.5;
  if (mixin === 'Mozzarella Cheese') softness += 1; // Cheese adds moisture
  
  let richness = 1;
  if (liquidBase === 'condensed') richness += 3;
  else if (['milk', 'evap'].includes(liquidBase)) richness += 1;
  if (technique === 'egg') richness += 1;
  if (mixin !== 'none') richness += 0.5;
  if (mixin === 'Cheese (Cheddar/Edam)' || mixin === 'Mozzarella Cheese') richness += 1;
  if (mixin === 'Chocolate Chips') richness += 1;
  
  let chewiness = 1;
  if (flourType === 'bread') chewiness += 3;
  if (flourType === 'wheat') chewiness += 2;
  if (flourType === 'ap') chewiness += 1.5;
  if (technique === 'none') chewiness += 0.5;
  if (technique === 'tangzhong') chewiness -= 0.5; // Tangzhong reduces chewiness
  
  return {
    softness: clamp(round(softness, 1), 0, 5),
    richness: clamp(round(richness, 1), 0, 5),
    chewiness: clamp(round(chewiness, 1), 0, 5),
  };
};

/**
 * Generates smart, contextual baking instructions based on recipe configuration.
 */
export const generateInstructions = (config: RecipeConfig, ingredients: CalculatedIngredients): SmartInstructions => {
  const { flourWeight, flourType, liquidBase, technique, mixin, isDiabetic, recipeMode = 'bread' } = config;
  const steps: InstructionStep[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];
  
  let stepOrder = 1;
  
  // Step 1: Mixing
  steps.push({
    order: stepOrder++,
    title: 'Mix Dry Ingredients',
    description: `Combine ${round(ingredients.mainFlour)}g flour, ${round(ingredients.saltWeight)}g salt, ${round(ingredients.yeastWeight)}g yeast${ingredients.sugarWeight > 0 ? `, ${round(ingredients.sugarWeight)}g ${isDiabetic ? 'sweetener' : 'sugar'}` : ''}.`,
    icon: '🥣',
  });
  
  // Step 2: Tangzhong if applicable
  if (technique === 'tangzhong') {
    steps.push({
      order: stepOrder++,
      title: 'Prepare Tangzhong',
      description: `Cook ${round(ingredients.tzFlour)}g flour with ${round(ingredients.tzLiquid)}g ${ingredients.liquidName} over low heat until thickened (65°C/149°F). Cool completely before adding to dough.`,
      temperature: 65,
      timeMinutes: 3,
      icon: '🍲',
    });
  }
  
  // Step 3: Mix wet ingredients
  const wetDesc = [
    `${round(ingredients.mainLiquid)}g ${ingredients.liquidName}`,
    ingredients.condensedWeight > 0 ? `${round(ingredients.condensedWeight)}g condensed milk` : null,
    ingredients.eggCount > 0 ? `${ingredients.eggCount} egg${ingredients.eggCount > 1 ? 's' : ''}` : null,
    `${round(ingredients.oilWeight)}g oil`,
  ].filter(Boolean).join(', ');
  
  steps.push({
    order: stepOrder++,
    title: 'Combine Wet Ingredients',
    description: `Whisk together: ${wetDesc}.${ingredients.tzFlour > 0 ? ' Add cooled tangzhong.' : ''}`,
    icon: '🥛',
  });
  
  // Step 4: Form dough
  steps.push({
    order: stepOrder++,
    title: 'Form Dough',
    description: 'Add wet to dry. Mix until shaggy, then knead 8-10 minutes until smooth and elastic (windowpane test).',
    timeMinutes: 10,
    icon: '🤲',
  });
  
  // Step 5: Add mix-ins
  if (mixin !== 'none') {
    const mixinAction = mixin === 'Raisins (Pasas)' ? 'Fold in gently' : 'Fold in';
    steps.push({
      order: stepOrder++,
      title: `Add ${ingredients.mixinLabel}`,
      description: `${mixinAction} ${round(ingredients.mixinWeight)}g ${ingredients.mixinLabel} during last minute of kneading.`,
      icon: '🍇',
    });
    
    // Fruit soaking warning
    if (mixin === 'Raisins (Pasas)' && ingredients.mainLiquid > 0) {
      const validation = validateFruitSoaking(ingredients.totalLiquid, ingredients.mixinWeight);
      if (!validation.isSafe) {
        warnings.push(validation.message);
      }
    }
  }
  
  // Step 6: First proof
  const proofTime = technique === 'tangzhong' ? 45 : 60;
  steps.push({
    order: stepOrder++,
    title: 'First Proof (Bulk Ferment)',
    description: `Cover and rest at room temperature until doubled in size (~${proofTime} minutes).`,
    timeMinutes: proofTime,
    icon: '⏳',
  });
  
  // Step 7: Shape
  steps.push({
    order: stepOrder++,
    title: 'Shape & Second Proof',
    description: 'Deflate gently, shape into ball/loaf. Place on parchment in air fryer basket. Proof 20-30 min.',
    timeMinutes: 25,
    icon: '🍞',
  });
  
  // Step 8: Air Fryer bake
  const bakeTemp = 160; // Base temp for bread
  const bakeTime = flourWeight <= 300 ? 12 : flourWeight <= 500 ? 15 : 18;
  steps.push({
    order: stepOrder++,
    title: 'Air Fryer Bake',
    description: `Preheat air fryer to ${bakeTemp}°C. Bake ${bakeTime} minutes. Check internal temp (95°C/203°F for bread).`,
    temperature: bakeTemp,
    timeMinutes: bakeTime,
    icon: '🔥',
  });
  
  // Step 9: Cool
  steps.push({
    order: stepOrder++,
    title: 'Cool Completely',
    description: 'Remove from basket. Cool on wire rack at least 30 minutes before slicing. This finishes the crumb set!',
    timeMinutes: 30,
    icon: '❄️',
  });
  
  // Add contextual tips
  if (technique === 'tangzhong') {
    tips.push('Tangzhong keeps bread soft for 2-3 days longer than standard method.');
  }
  if (liquidBase === 'condensed') {
    tips.push('Condensed milk adds sweetness and golden crust. No added sugar needed!');
  }
  if (flourType === 'wheat') {
    tips.push('Whole wheat absorbs more liquid. If dough feels dry, add 1 tbsp water at a time.');
  }
  if (isDiabetic) {
    tips.push('Erythritol doesn\'t brown like sugar. Brush with egg wash for color.');
  }
  if (mixin === 'Raisins (Pasas)') {
    tips.push('Soak raisins in warm water 10 min before adding for plumper fruit.');
  }
  
  return { steps, warnings, tips };
};

/**
 * Calculates scaling factor and scaled ingredients for different yield.
 */
export const calculateScaling = (
  ingredients: CalculatedIngredients,
  targetWeight: number
): ScalingResult => {
  const factor = targetWeight / ingredients.totalWeight;
  const scaledIngredients: Record<string, IngredientWeight> = {};
  
  const ingredientMap: Record<string, number> = {
    'Flour': ingredients.mainFlour,
    'Tangzhong Flour': ingredients.tzFlour,
    'Liquid': ingredients.mainLiquid,
    'Tangzhong Liquid': ingredients.tzLiquid,
    'Condensed Milk': ingredients.condensedWeight,
    'Salt': ingredients.saltWeight,
    'Yeast': ingredients.yeastWeight,
    'Oil': ingredients.oilWeight,
    'Sugar': ingredients.sugarWeight,
    'Eggs': ingredients.eggCount * 50,
    'Mix-ins': ingredients.mixinWeight,
  };
  
  for (const [name, grams] of Object.entries(ingredientMap)) {
    if (grams > 0) {
      scaledIngredients[name] = {
        grams: round(grams * factor),
        unit: name.includes('Liquid') || name.includes('Milk') ? 'ml' : 'g',
      };
    }
  }
  
  return {
    factor: round(factor, 2),
    scaledIngredients,
    newTotalWeight: round(targetWeight),
  };
};

// ============================================================================
// FORMATTING HELPERS FOR UI
// ============================================================================

/** Formats an ingredient for display with multiple unit options */
export const formatIngredient = (name: string, grams: number, type: 'flour' | 'sugar' | 'butter' | 'liquid' | 'small' | 'spice' = 'flour'): string => {
  const parts: string[] = [`${round(grams)}g`];
  
  if (grams >= 30) {
    switch (type) {
      case 'flour':
      case 'sugar':
        parts.push(gramsToCups(grams, type === 'flour' ? CONVERSION.GRAMS_PER_CUP_FLOUR : CONVERSION.GRAMS_PER_CUP_SUGAR));
        break;
      case 'butter':
        parts.push(gramsToCups(grams, CONVERSION.GRAMS_PER_CUP_BUTTER));
        break;
      case 'liquid':
        parts.push(gramsToMl(grams));
        break;
    }
  } else if (grams > 0) {
    const density = CONVERSION.DENSITY[type as keyof typeof CONVERSION.DENSITY] || 5;
    if (grams >= 5) {
      parts.push(gramsToTbsp(grams, density));
    } else {
      parts.push(gramsToTsp(grams, density));
    }
  }
  
  return parts.join(' • ');
};