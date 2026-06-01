export type FlourType = 'ap' | 'bread' | 'wheat' | 'sub';
export type LiquidBase = 'water' | 'milk' | 'evap' | 'condensed' | 'flaxegg';
export type Technique = 'none' | 'egg' | 'tangzhong' | 'flax';
export type MixinType = 'none' | 'Raisins (Pasas)' | 'Chocolate Chips' | 'Cheese (Cheddar/Edam)' | 'Mozzarella Cheese' | 'Mixed Nuts';

// Substitution inputs for advanced modeling
export interface SubstituteInputs {
    eggSubstituteWeightGrams?: number; // e.g., Flax egg replacement weight
    flourAlternative?: { type: 'whole-wheat' | 'rye', ratioFactor: 0.9 }; // e.g., Whole wheat flour substitution
}

export interface RecipeConfig {
    flourWeight: number;
    flourType: FlourType;
    liquidBase: LiquidBase;
    technique: Technique;
    mixin: MixinType;
    substitutes?: SubstituteInputs; // Added for advanced modeling
}