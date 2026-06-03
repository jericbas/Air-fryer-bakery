# 🍞 Air Fryer Bakery App

## 📖 Project Overview
The Air Fryer Bakery is a web application designed to calculate and guide users through the perfect baking process for various bread types using an air fryer. It accepts core ingredient data (flour, sugar, leavening agents) and calculates optimized cooking times, temperatures, and preparation instructions tailored for the specific dimensions and power of common air fryers. The goal is to provide reliable, recipe-driven digital guidance directly in a modern, interactive web interface.

---

## 🚀 Tech Stack
This application leverages a modern JavaScript ecosystem for optimal performance and developer experience:

*   **Framework:** React (React Hooks)
*   **Build Tool & Runtime:** Vite & Bun (using Bun provides superior speed and native compatibility with the module structure).
*   **Language:** TypeScript / JavaScript
*   **Styling:** Tailwind CSS or styled-components (depending on implementation choice, currently favoring a component-driven approach).

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
4.  **Run Development Server:** Start the local development server. This command runs Vite/Bun hot module replacement (HMR).
    ```bash
    bun run dev
    ```
5.  **Access:** Open your browser to `http://localhost:3000` (or the port indicated by the console).

## 🧪 Usage Guide (The Baking Workflow)
1.  **Select Bread Type:** Choose the bread type you wish to bake from the provided dropdown/selector. This action loads the base recipe template and default parameters.
2.  **Input Ingredients:** Use the ingredient panel to input actual measured amounts of your materials (e.g., Flour: 300g, Sugar: 15g). The app updates dynamically.
3.  **Calculate Instructions:** Click the "Generate Baking Guide" button. The system runs the core calculation logic (`src/utils/calculations.ts`) against the entered ingredients and selected air fryer model.
4.  **Review Output:** The results will populate the **Smart Instructions** panel, providing step-by-step timing (e.g., *Bake at 160°C for 8 minutes*, *Cool completely*).

---

