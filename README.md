# 🍞 Air Fryer Bakery App

## 📖 Project Overview
The Air Fryer Bakery is a web application designed to calculate and guide users through the perfect baking process for various bread types using an air fryer. It accepts core ingredient data (flour, sugar, leavening agents) and calculates optimized cooking times, temperatures, and preparation instructions tailored for the specific dimensions and power of common air fryers. The goal is to provide reliable, recipe-driven digital guidance directly in a modern, interactive web interface.

---

## 🚀 Tech Stack
This application leverages a modern JavaScript ecosystem for optimal performance and developer experience:

*   **Framework:** React 18 (React Hooks)
*   **Build Tool & Runtime:** Vite 5 + Bun
*   **Language:** TypeScript 6 (strict mode)
*   **Styling:** Tailwind CSS 4 + DaisyUI 5 (CSS-first config, no tailwind.config.js)
*   **Testing:** Vitest

---

## 🏗️ Architecture

```
src/
├── app/                          # App entry point (future)
├── features/calculator/          # Calculator feature module
│   ├── components/               # Feature-specific components
│   │   └── index.tsx             # RecipeSetupForm, IngredientsList, SmartInstructionsPanel, etc.
│   ├── hooks/
│   │   └── useBakeryCalculator.ts # Unified calculator state & logic hook
│   ├── types/
│   │   └── index.ts              # Types: RecipeConfig, CalculatedIngredients, DoughProfile, etc.
│   └── utils/
│       ├── constants.ts          # Baker's percentages, hydration rates, presets
│       └── calculations.ts       # Pure calculation engine (no React deps)
├── shared/
│   └── components/
│       └── ui.tsx                # Reusable DaisyUI 5 components (Card, Stat, Badge, etc.)
├── __tests__/                    # Integration tests
└── utils/__tests__/              # Unit tests for calculations
```

### Key Design Principles
- **Feature-based organization**: Colocated components, hooks, types, and utils per feature
- **Pure calculation engine**: All math in `features/calculator/utils/calculations.ts` is framework-agnostic
- **Single state hook**: `useBakeryCalculator` manages all config, form inputs, and derived state
- **DaisyUI 5 components**: Custom warm "bakery" theme with semantic color tokens
- **Path aliases**: `@/` maps to `src/` via Vite + TypeScript config

---

## ⚙️ Installation and Setup
Follow these steps to get the Air Fryer Bakery running locally.

1.  **Prerequisites:** Ensure you have Bun installed globally:
    ```bash
    bun install -g bun
    ```
2.  **Clone Repository:** Clone the project repository into your local machine.
    ```bash
    git clone <repo-url> air-fryer-bakery
    cd air-fryer-bakery
    ```
3.  **Install Dependencies:** Install all required Node modules using Bun.
    ```bash
    bun install
    ```
4.  **Run Development Server:** Start the local development server with HMR.
    ```bash
    bun run dev
    ```
5.  **Access:** Open your browser to `http://localhost:5173` (or the port indicated by the console).

---

## 🧪 Available Scripts

```bash
# Development
bun run dev           # Start Vite dev server with HMR

# Testing
bun test              # Run Vitest unit/integration tests

# Production Build
bun run build         # Clean + type-check + Vite production build
bun run preview       # Preview production build locally
```

---

## 🧠 Core Concepts

### Baker's Math (Baker's Percentages)
All calculations use professional baker's percentages where **flour = 100%**:
- Hydration = Liquid / Flour × 100
- Salt = 2% of flour weight
- Yeast = 1.5% of flour weight
- Oil = 8% of flour weight
- Sugar = 8% of flour weight (varies by recipe mode)

### Special Rules Implemented
1. **Condensada Rule**: When using sweetened condensed milk:
   - Condensed milk = 20% of flour weight
   - Reduces base liquid by 30% of condensed milk weight
   - Added sugar = 0 (condensed milk provides ~45% sugar)

2. **Fruit Soaking Rule**: For raisins/fruit:
   - Target absorption = 27% of fruit weight
   - Safe range = 80%–150% of target
   - Warns if liquid is outside safe range

3. **Tangzhong (Water Roux)**: 
   - 5% of flour pre-cooked with 5× water
   - Increases softness, extends shelf life

### Recipe Modes
| Mode | Hydration | Sugar | Fat | Leavening |
|------|-----------|-------|-----|-----------|
| Bread | 60-73% (by flour type) | 8% | 8% | Yeast |
| Cake | 60% | 75% | 50% | Baking powder/soda |
| Cookie | 40% | 120% | 60% | Baking powder/soda |

---

## 🎨 UI Components (DaisyUI 5)

The app uses a custom **bakery theme** (OKLCH color space) with warm, comforting tones:
- `base-100/200/300`: Creamy off-whites
- `primary`: Warm amber (brand)
- `secondary`: Terracotta
- `accent`: Muted brown
- `info/success/warning/error`: Semantic feedback colors

Reusable components in `src/shared/components/ui.tsx`:
- `Card`, `Stat`, `Badge`, `Alert`, `Input`, `Select`, `Toggle`, `Divider`, `Loading`, `Collapse`, `Tooltip`, `Table`

---

## 🧪 Testing

```bash
bun test
```
- Tests in `src/__tests__/` and `src/utils/__tests__/`
- Pure calculation functions tested in isolation
- React components tested via integration tests (future)

---

## 📦 Production Deployment

```bash
bun run build
# Output in ./dist/
```
- Static assets served from `dist/`
- Base path configured for GitHub Pages: `/Air-fryer-bakery/`
- Works with any static hosting (Netlify, Vercel, GitHub Pages, etc.)

---

## 📄 License
MIT