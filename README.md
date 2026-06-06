# Air-Fryer Bakery Project

## 🍪 Overview (What is it?)
This application simulates an intelligent baking assistant using the concept of "Dough Formulas." Users input ingredients, and the system calculates the precise ratios needed to create various baked goods (e.g., Brownies, Cookies, Empanadas) that are optimized for air-frying. The core logic relies on accurate mathematical scaling of recipes based on ingredient weights and desired yields.

## ⚙️ Tech Stack (How is it built?)
*   **Frontend:** React + Vite (Vite-React SPA).
*   **Styling:** Tailwind CSS.
*   **Language:** TypeScript/JavaScript.
*   **Math Core:** Custom state management and utility functions implemented in `src/utils` for all recipe calculations.
*   **Dependencies:** Uses component structures in `src/components` to handle different dough types (`BreadDoughForm`, `BrownieDoughForm`, etc.).

## 🚀 Setup Guide (Local Installation)
Follow these steps to run the project locally:

1.  **Prerequisites:** Ensure you have Node.js and Bun installed.
    ```bash
    npm install bun # Or use your preferred package manager
    ```
2.  **Install Dependencies:** Navigate into the project directory and install required packages.
    ```bash
    bun install
    ```
3.  **Run Development Server:** Start the local development environment.
    ```bash
    bun run dev
    # The app will typically be available at http://localhost:5173/
    ```
4.  **Build for Production (Optional):** To create static assets for deployment.
    ```bash
    bun build
    ```

## 🧑‍🍳 Usage Workflow (The primary user interaction flow)
1.  **Select Recipe:** On the main page, select the desired baked good type (e.g., Brownie). This selects the appropriate dough form component.
2.  **Input Ingredients:** Enter the base ingredients and their current available weights in the corresponding input fields. The system maintains a master list of all used ingredients via the `IngredientList`.
3.  **Calculate Ratios:** Click the "Calculate Dough" button (or equivalent trigger). The `bakingMath` utilities process these inputs to determine the required scaling factors for the chosen dough type.
4.  **Review Output:** The application displays the optimized ingredient list, detailing how much of each original ingredient is needed to achieve the target yield while maintaining perfect ratios across all components.

***
*Note: All complex baking logic resides in `src/utils/bakingMath.ts`.*