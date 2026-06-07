/**
 * Service class for baking calculations.
 * Handles core business logic related to baking yields and costs.
 */
export class BakerCalculatorService {

    /**
     * Calculates the total theoretical yield based on input quantity,
     * assumed efficiency rate, and base material cost.
     * 
     * @param initialQuantity The starting amount or number of items (must be positive).
     * @param efficiencyRate A decimal value (0.0 to 1.0) representing process efficiency.
     * @param unitCostPerItem The monetary cost associated with one unit/item.
     * @returns An object containing the calculated total yield and the estimated material cost.
     * @throws {Error} If initialQuantity or unitCostPerItem are non-positive numbers.
     */
    public calculateTotalYield(
        initialQuantity: number, 
        efficiencyRate: number, 
        unitCostPerItem: number
    ): { totalYield: number; materialCost: number } {
        
        // Input validation for robustness
        if (initialQuantity <= 0 || unitCostPerItem < 0) {
            throw new Error("Initial quantity must be positive and unit cost cannot be negative.");
        }
        if (efficiencyRate < 0.0 || efficiencyRate > 1.0) {
             throw new Error("Efficiency rate must be between 0.0 and 1.0.");
        }

        // Core calculation logic
        const totalYield = initialQuantity * efficiencyRate;
        const materialCost = initialQuantity * unitCostPerItem;

        return {
            totalYield: parseFloat(totalYield.toFixed(2)),
            materialCost: parseFloat(materialCost.toFixed(2))
        };
    }

    /**
     * Helper method to estimate the required baking time based on batch size.
     * @param itemsInBatch The number of items being baked.
     * @returns Estimated minutes needed for baking. Returns 0 if invalid input.
     */
    public estimateBakingTime(itemsInBatch: number): number {
        if (typeof itemsInBatch !== 'number' || itemsInBatch < 1) {
            console.warn("Invalid batch size provided for time estimation.");
            return 0;
        }
        // Simple linear scaling model assumption
        return Math.ceil(itemsInBatch * 0.5); 
    }
}