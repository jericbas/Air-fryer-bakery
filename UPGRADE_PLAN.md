# Air Fryer Bakery App Upgrade Strategy (TypeScript Focus)

## Objective
Upgrade the existing pastry calculation application to a robust, type-safe architecture using TypeScript. The goal is to implement complex baking mathematics and dynamic UI logic while eliminating JavaScript files where possible to maintain code quality and predictability.

## 1. Technical Constraints & Standards
*   **Language:** Strictly TypeScript (`.ts` / `.tsx`).
*   **File Restriction:** No `.js` files permitted, except for necessary root entry points (e.g., `index.js`, if required by the build tool). All core logic must reside in TS files.
*   **State Management:** Use pure functional components and hooks. Calculation results must be derived **on-the-fly** during the render cycle whenever a primary input state changes, avoiding mutable global weights stored in component state.

## 2. Core Mathematical Engine (Baker's Math Implementation)
The entire system revolves around scaling recipes based on Baker's Percentages relative to flour weight ($100\%$). This logic must be encapsulated in a dedicated service/utility module (`src/utils/bakingMath.ts`).

**Key Functions:**
*   `calculateIngredientWeights(baseFlour: number, recipeMode: 'bread' | 'cake' | 'cookie'): Record<string, {grams: number; unit?: string}>`: The primary function that accepts the base flour weight and mode, returning all scaled ingredient weights.
*   **Hydration Logic (Bread):** Must handle specific hydration rates based on `flourType` (e.g., $65\%$ for high protein).
*   **Special Rules Implementation:**
    1.  **Condensada Rule:** If `liquidBase === 'condensed'`, the main liquid calculation must subtract $30\%$ of the input weight, and sugar weights must be set to zero.
    2.  **Fruit Soaking Rule:** Calculate an ideal range for custom liquids (`idealCustomLiquid = customFruitWeight * 0.27`). The UI state should flag a warning if user input falls outside $0.8 \times$ or $1.5 \times$ this ideal number.

## 3. Component Architecture & State Flow
The application structure must be broken down into highly cohesive, reusable TypeScript components to manage complexity and maintain performance.

*   **State Hook (`useBakingCalculator`):** Centralize the complex state logic in a custom hook (`src/hooks/useBakingCalculator.ts`). This hook reads primary inputs (flour weight, mode, etc.) and executes all math functions from `bakingMath.ts`, returning a derived, comprehensive result object for consumption by child components.
*   **Reusable Components:** Create TypeScript interfaces and functional wrappers for UI elements like ingredient rows (`IngRow.tsx`) to ensure consistent type handling (e.g., always accepting weight in grams).

## 4. User Interface (UX) & Styling Integration
The UI layer must be fully reactive, consuming the pure data output from `useBakingCalculator`.

*   **Layout:** Use a responsive CSS grid structure (`grid-cols-1 lg:grid-cols-3`) for clear separation of inputs and outputs.
*   **Conditional Rendering (TypeScript):** Utilize TypeScript's type checking and React conditional rendering based on the `recipeMode` to display only relevant input fields and calculations.
    ```tsx
    {recipeMode === 'bread' ? <BreadInputs /> : null}
    ```
*   **Visual Cues:** Use Tailwind CSS utilities for thematic colors (e.g., `bg-teal-50`, `text-amber-900`). Warnings must use high-contrast, structured components to stop user flow when validation fails.

## 5. Deployment and Maintenance Pipeline
The build process needs hardening to enforce the TypeScript standard before deployment.

1.  **Type Checking:** Add a mandatory step in the CI pipeline: `tsc --noEmit`. This ensures all code is type-safe before compilation.
2.  **Build Command:** Update the package scripts (`package.json`) to run both type checking and bundling (e.g., `npm run build:ts`).

## Execution Workflow Summary
1.  Refactor/Create: `src/utils/bakingMath.ts` (Pure TS math engine).
2.  Refactor/Create: `src/hooks/useBakingCalculator.tsx` (State orchestration, calling math engine).
3.  Refactor/Complete: All component files (`.tsx`) to consume the hook's output and render dynamic UI elements based on type-safe state.
4.  Finalize: Update `package.json` scripts for mandatory TypeScript build steps.