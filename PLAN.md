# Project Plan: Air-Fryer Bread Calculator (V1.2+)

## 🚀 Overall Goal
To finalize the calculation engine, deploy a polished V1.2 feature set (e.g., advanced ingredient substitutions or seasonal recipes), and ensure full production readiness for market launch.

## ✅ Status
*   **Core Architecture:** Complete (Service Layer implemented using `ICalculationEngine`).
*   **V1.1 Features:** Complete (Contextual Wizard UI).
*   **Next Milestone Target:** V1.2 Feature Implementation & Full Test Suite Coverage.

## 🗓️ Roadmap / Tasks
### [ ] Phase: V1.2 Enhancement - Advanced Substitutions
*   Identify and model 3-5 common ingredient substitutions (e.g., replacing Greek yogurt with sour cream, or flax egg substitute).
*   Update `BakerCalculatorService.ts` to handle these substitution rules while maintaining SRP compliance.

### [ ] Phase: Testing & Validation
*   Create comprehensive unit test coverage for all methods in `ICalculationEngine`.
*   Execute an end-to-end test cycle using mock data representing various real-world scenarios (e.g., "low carb," "high protein").

### [ ] Phase: Documentation & Deployment Prep
*   Finalize and review the user guide documentation.
*   Update `README.md` to reflect V1.2 release notes and deployment instructions.

## ⚙️ Technical Notes
*   **Constraint:** All development must remain confined to the `/juva/` scope.
*   **Tools:** Utilize `baking-calculator-wizard` skill for architectural guidance.