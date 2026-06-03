export type FlourType = 'ap' | 'bread' | 'wheat';
export type LiquidBase = 'water' | 'milk' | 'evap' | 'condensed';
export type Technique = 'none' | 'egg' | 'tangzhong';
export type MixinType = 'none' | 'Raisins (Pasas)' | 'Chocolate Chips' | 'Cheese (Cheddar/Edam)' | 'Mozzarella Cheese' | 'Mixed Nuts';

export interface RecipeConfig {
  flourWeight: number;
  flourType: FlourType;
  liquidBase: LiquidBase;
  technique: Technique;
  mixin: MixinType;
}

export interface CalculatedIngredients {
  mainFlour: number;
  mainLiquid: number;
  saltWeight: number;
  yeastWeight: number;
  oilWeight: number;
  sugarWeight: number;
  condensedWeight: number;
  mixinWeight: number;
  eggCount: number;
  tzFlour: number;
  tzLiquid: number;
  liquidName: string;
}

export interface DoughProfile {
  softness: number;
  richness: number;
  chewiness: number;
}