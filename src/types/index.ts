// Recipe modes
export type RecipeMode = 'fruitCake' | 'bread' | 'cookies' | 'brownies' | 'empanada';

// Bread-specific types
export type FlourType = 'ap' | 'bread' | 'wheat';
export type LiquidBase = 'water' | 'milk' | 'evap' | 'condensed';
export type BreadTechnique = 'none' | 'egg' | 'tangzhong';
export type BreadMixin = 'none' | 'Raisins (Pasas)' | 'Chocolate Chips' | 'Cheese (Cheddar/Edam)' | 'Mozzarella Cheese' | 'Mixed Nuts';

// Fruit Cake types
export type CakeStyle = 'traditional' | 'light';
export type FruitType = 'none' | 'Orange Marmalade' | 'Pineapple Jam' | 'Apricot Jam';
export type SoakLiquid = 'none' | 'Dark Rum' | 'Juice';

// Cookie types
export type CookieStyle = 'classic' | 'ube';

// Brownie types
export type BrownieStyle = 'fudgy' | 'foodForTheGods';

// Empanada types
export type FatType = 'butter' | 'shortening';

// Unified config supporting all modes
export interface RecipeConfig {
  // Common
  baseFlour: number; // Flour weight in grams
  recipeMode: RecipeMode;
  isDiabetic: boolean;

  // Bread-specific
  flourType?: FlourType;
  liquidBase?: LiquidBase;
  breadTechnique?: BreadTechnique;
  breadMixin?: BreadMixin;

  // Fruit Cake-specific
  cakeStyle?: CakeStyle;
  jamType?: FruitType;
  soakLiquid?: SoakLiquid;
  customFruitWeight?: number;
  customLiquidWeight?: number;
  useCustomLiquid?: boolean;

  // Cookie-specific
  cookieStyle?: CookieStyle;

  // Brownie-specific
  brownieStyle?: BrownieStyle;

  // Empanada-specific
  fatType?: FatType;
}

// Ingredient with metadata
export interface Ingredient {
  label: string;
  grams: number;
  cups?: string;
  spoons?: string;
  note?: string;
  bg?: string; // Background color class
}

// Complete calculated result
export interface CalculatedIngredients {
  ingredients: Record<string, Ingredient>;
  warnings: WarningState;
}

// Warning system
export interface WarningState {
  condensadaWarning?: boolean;
  highLiquidWarning?: boolean;
  lowLiquidWarning?: boolean;
  idealLiquidWeight?: number;
  warningMessage?: string;
}

export interface DoughProfile {
  softness: number;
  richness: number;
  chewiness: number;
}