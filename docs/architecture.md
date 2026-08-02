# Air Fryer Bakery - Architecture Documentation

## Overview
This document describes the current architecture of the Air Fryer Bakery application as of v2.0 (feature-based refactor with DaisyUI 5).

## Tech Stack
- **Framework**: React 18 + TypeScript 6 (strict)
- **Build**: Vite 5 + Bun
- **Styling**: Tailwind CSS 4 (CSS-first) + DaisyUI 5
- **Testing**: Vitest
- **Linting**: Biome
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                          # App entry point (future expansion)
├── features/calculator/          # Calculator feature module (domain)
│   ├── components/
│   │   └── index.tsx             # All calculator UI components
│   ├── hooks/
│   │   └── useBakeryCalculator.ts # Unified state + derived calculations
│   ├── types/
│   │   └── index.ts              # Domain types (RecipeConfig, CalculatedIngredients, etc.)
│   └── utils/
│       ├── constants.ts          # Baker's percentages, hydration rates, presets
│       └── calculations.ts       # Pure calculation engine (no React deps)
├── shared/
│   └── components/
│       └── ui.tsx                # Reusable DaisyUI 5 component library
├── __tests__/                    # Integration tests
└── utils/__tests__/              # Unit tests for calculations
```

## Feature: Calculator

### Types (`features/calculator/types/index.ts`)
Core domain types:
- `RecipeConfig` - Input configuration (flourWeight, flourType, liquidBase, technique, mixin, recipeMode, isDiabetic, etc.)
- `CalculatedIngredients` - Computed weights (mainFlour, mainLiquid, saltWeight, yeastWeight, oilWeight, sugarWeight, condensedWeight, mixinWeight, eggCount, tzFlour, tzLiquid, totals)
- `DoughProfile` - Texture prediction (softness, richness, chewiness: 0-5)
- `SmartInstructions` - Step-by-step instructions with warnings/tips
- `FormInputs` - UI form state (mirrors config + extras)
- `RecipeMode` - 'bread' | 'cake' | 'cookie'

### Constants (`features/calculator/utils/constants.ts`)
- `HYDRATION_RATES` - Per flour type (AP: 60%, Bread: 65%, Wheat: 73%)
- `BASE_BAKERS_PERCENTAGES` - Salt 2%, Yeast 1.5%, Oil 8%, Sugar 8%, Mixin 20%
- `RECIPE_MODE_PERCENTAGES` - Per mode (bread/cake/cookie) liquid/sugar/fat/egg ratios
- `LIQUID_BASE_CONFIG` - Water/milk/evap/condensed properties
- `TECHNIQUE_CONFIG` - none/egg/tangzhong
- `MIXIN_CONFIG` - Mix-in percentages and properties
- `DIABETIC_SUBSTITUTIONS` - Erythritol/monkfruit/allulose ratios
- `AIR_FRYER_PRESETS` - 5 common models with wattage/capacity/tempOffset
- `CONVERSION` - Grams to cups/tbsp/tsp densities
- `FRUIT_SOAKING` - 27% absorption, 0.8x-1.5x safe range

### Calculation Engine (`features/calculator/utils/calculations.ts`)
Pure functions (framework-agnostic):

**Special Rules:**
- `applyCondensadaRule()` - Condensed milk: -30% liquid, 0 added sugar
- `validateFruitSoaking()` - Warns if liquid outside 80%-150% of 27% fruit weight

**Core Calculations:**
- `calculateIngredients(config)` - Returns CalculatedIngredients
- `calculateProfile(config, ingredients)` - Returns DoughProfile (0-5 scores)
- `generateInstructions(config, ingredients)` - Returns SmartInstructions (steps + warnings + tips)
- `calculateScaling(ingredients, targetWeight)` - Returns ScalingResult

**Formatting:**
- `formatIngredient(name, grams, type)` - Multi-unit display (g + cups/tbsp/tsp/ml)

### Hook (`features/calculator/hooks/useBakeryCalculator.ts`)
Single state hook managing:
- `config` (RecipeConfig) - Source of truth for calculations
- `formInputs` (FormInputs) - UI form state
- Derived: `ingredients`, `profile`, `instructions`
- Actions: `updateConfig`, `updateFormInput`, `resetConfig`, `resetFormInputs`
- Utility: `scaleToWeight()`, `formatIngredient()`
- Constants for UI: flourTypes, liquidBases, techniques, mixins, recipeModes, airFryerPresets

### Components (`features/calculator/components/index.tsx`)
- `RecipeSetupForm` - Mode selector (tabs), flour weight, dropdowns (flour/liquid/technique/mixin), diabetic toggle, advanced collapse
- `IngredientsList` - Grouped display (flour, liquids, core, mix-ins) with multi-unit formatting + summary stats
- `SmartInstructionsPanel` - Numbered steps with temp/time icons, warnings (alert), tips (collapse)
- `DoughProfilePanel` - Three Stat bars (softness/richness/chewiness) + emoji indicators
- `AirFryerPanel` - Model selector + calculated temp/time/wattage/capacity stats
- `ScalingPanel` - Target weight input + comparison table
- `SourcesFooter` - References, science notes, disclaimer

## Shared UI Components (`shared/components/ui.tsx`)
DaisyUI 5 wrapper components:
- `Card` - Container with optional title/subtitle/action
- `Stat` - Label + value + progress bar (color variants)
- `ScoreBar` - Legacy compatible score bar
- `Badge` - DaisyUI badge wrapper
- `Alert` - DaisyUI alert (variant/style/direction)
- `Input` - Labeled input with icon/error/helper support
- `Select` - Labeled select with error/helper
- `Toggle` - Checkbox toggle with label/description
- `Divider` - Section divider
- `Loading` - Spinner/dots/ring/etc.
- `Collapse` - Accordion with radio input
- `Tooltip` - Hover tooltip
- `Table` - Generic typed table with columns/render

## DaisyUI 5 Theme
Custom "bakery" theme (OKLCH color space):
- `base-100/200/300` - Creamy off-whites
- `primary` - Warm amber (brand)
- `secondary` - Terracotta
- `accent` - Muted brown
- `info/success/warning/error` - Semantic feedback
- Radius: selector 1rem, field 0.5rem, box 1rem
- Depth: 1 (subtle shadows)
- Noise: 0

## Testing
- `src/__tests__/calculations.test.ts` - 4 integration tests
- `src/utils/__tests__/calculations.test.ts` - 4 unit tests
- All 8 tests passing
- Tests cover: basic bread, Tangzhong, Condensada Rule, flour substitution, standard weights, Egg technique

## Build & Deploy
```bash
bun run dev      # Vite dev server (port 5173)
bun test         # Vitest
bun run build    # Clean + tsc --noEmit + Vite build
bun run preview  # Preview dist/
```
- Output: `dist/` with base path `/Air-fryer-bakery/` for GitHub Pages
- TypeScript strict, no errors
- Bundle: ~180KB JS, ~97KB CSS (gzipped: ~57KB / ~16KB)