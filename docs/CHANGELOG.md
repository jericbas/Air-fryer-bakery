# Changelog

All notable changes to this project will be documented in this format.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-08-03

### Added
- **DaisyUI 5 Integration**: Full migration to DaisyUI 5 with custom "bakery" theme using OKLCH color space
- **Feature-Based Architecture**: Reorganized codebase into `src/features/calculator/` with colocated components, hooks, types, and utils
- **Unified Calculator Hook**: `useBakeryCalculator` replaces `useBreadCalculator` and `useBakingCalculator`
- **Shared UI Component Library**: Reusable DaisyUI 5 components in `src/shared/components/ui.tsx` (Card, Stat, Badge, Alert, Input, Select, Toggle, Divider, Loading, Collapse, Tooltip, Table)
- **Recipe Modes**: Support for Bread, Cake, and Cookie modes with mode-specific baker's percentages
- **Diabetic Mode**: Sugar substitution with erythritol/monkfruit/allulose options
- **Air Fryer Presets**: 5 common models (Generic 1500W/1800W, Ninja, Cosori, Philips) with wattage/capacity/tempOffset
- **Recipe Scaling**: Target weight input with comparison table
- **Smart Instructions**: Contextual warnings (fruit soaking, condensed milk), tips (technique-specific), step metadata (temp/time icons)
- **Dough Profile Visualization**: Three Stat bars with emoji indicators (softness/richness/chewiness)
- **Path Aliases**: `@/` maps to `src/` via Vite + TypeScript config
- **Comprehensive Documentation**: `docs/architecture.md`, updated `docs/README.md`

### Changed
- **BREAKING**: Removed `tailwind.config.js` - now using CSS-first Tailwind v4 with `@import "tailwindcss"; @plugin "daisyui";`
- **BREAKING**: Consolidated types from `src/types/index.ts` + `src/types/ICalculationEngine.ts` → `src/features/calculator/types/index.ts`
- **BREAKING**: Consolidated calculation logic from `src/utils/calculations.ts` + `src/utils/bakingMath.ts` + `src/utils/bakingRules.ts` → `src/features/calculator/utils/calculations.ts`
- **BREAKING**: Removed `src/services/BakerCalculatorService.ts` (unused interface implementation)
- **BREAKING**: Updated all imports to use new feature-based paths and `@/` alias
- **UI**: Migrated from custom Tailwind classes to DaisyUI 5 components throughout
- **Theme**: Custom warm "bakery" theme replaces generic orange/stone palette
- **Layout**: 3-column responsive grid (setup | ingredients + instructions + scaling)
- **Package Manager**: Added `"type": "module"` to package.json for ES modules

### Removed
- `src/components/SetupForm.tsx` → `features/calculator/components/RecipeSetupForm`
- `src/components/CalculatorPage.tsx` → removed (was placeholder)
- `src/components/ScoreBar.tsx` → `shared/components/ui.tsx` (Stat + legacy ScoreBar)
- `src/hooks/useBreadCalculator.ts` → `features/calculator/hooks/useBakeryCalculator.ts`
- `src/hooks/useBakingCalculator.tsx` → `features/calculator/hooks/useBakeryCalculator.ts`
- `src/utils/calculations.ts` → `features/calculator/utils/calculations.ts`
- `src/utils/bakingMath.ts` → `features/calculator/utils/calculations.ts`
- `src/utils/bakingRules.ts` → `features/calculator/utils/calculations.ts` (inline functions)
- `src/services/BakerCalculatorService.ts` → removed (unused)
- `src/types/index.ts` → `features/calculator/types/index.ts`
- `src/types/ICalculationEngine.ts` → removed (unused)
- `src/constants/recipeConfig.ts` → `features/calculator/utils/constants.ts`
- `tailwind.config.js` / `tailwind.config.ts` → removed
- `src/components/tsconfig.json` → removed (unused)

### Fixed
- TypeScript strict mode compliance throughout
- Build warnings (removed deprecated `--hot` flag from dev script)
- Test imports updated to new architecture paths
- Tooltip component type safety (ReactNode instead of ReactElement)

## [1.1.0] - 2025-08-02 (Pre-refactor)

### Added
- Core calculation engine with Baker's Percentages
- Condensada Rule (condensed milk handling)
- Tangzhong technique support
- Egg technique support
- Basic React UI with Tailwind CSS
- Vitest unit tests (8 tests passing)
- GitHub Pages deployment workflow

### Changed
- Initial project scaffold with Vite + React + TypeScript
- Biome for linting/formatting

## [1.0.0] - 2025-08-01

### Added
- Initial project setup
- Basic bread calculator functionality
- Single-file prototype

---

## Migration Guide (v1.x → v2.0)

### Import Path Changes

| Old Import | New Import |
|------------|------------|
| `import { useBreadCalculator } from './hooks/useBreadCalculator'` | `import { useBakeryCalculator } from '@/features/calculator/hooks/useBakeryCalculator'` |
| `import { calculateIngredients } from './utils/calculations'` | `import { calculateIngredients } from '@/features/calculator/utils/calculations'` |
| `import { RecipeConfig } from './types'` | `import { RecipeConfig } from '@/features/calculator/types'` |
| `import { ScoreBar } from './components/ScoreBar'` | `import { ScoreBar } from '@/shared/components/ui'` |

### Hook API Changes

**Old (`useBreadCalculator`):**
```typescript
const { config, updateConfig, ingredients, profile } = useBreadCalculator();
// updateConfig(key, value)
```

**New (`useBakeryCalculator`):**
```typescript
const { 
  config, formInputs, ingredients, profile, instructions,
  updateConfig, updateFormInput, resetConfig, resetFormInputs,
  scaleToWeight, formatIngredient,
  flourTypes, liquidBases, techniques, mixins, recipeModes, airFryerPresets
} = useBakeryCalculator();
// updateConfig(key, value) - same
// updateFormInput(key, value) - new, for form-only state
```

### Component Replacements

| Old Component | New Component |
|---------------|---------------|
| `<SetupForm />` | `<RecipeSetupForm />` |
| `<ScoreBar />` | `<Stat />` or `<ScoreBar />` (both in shared/ui) |
| N/A | `<IngredientsList />`, `<SmartInstructionsPanel />`, `<DoughProfilePanel />`, `<AirFryerPanel />`, `<ScalingPanel />`, `<SourcesFooter />` |

### Theme Migration

**Old:** Custom Tailwind config with `bg-orange-50`, `text-stone-800`, etc.
**New:** DaisyUI 5 semantic colors: `bg-base-200`, `text-base-content`, `btn-primary`, `card`, `alert`, etc.

### CSS Config

**Old:** `tailwind.config.js` + `postcss.config.js` with `@tailwindcss/postcss`
**New:** `src/index.css` with:
```css
@import "tailwindcss";
@plugin "daisyui";
@plugin "daisyui/theme" { /* bakery theme config */ }
```