/**
 * Calculator Feature Components
 * Feature-specific components for the baking calculator
 */

import React from 'react';
import {
  CalculatedIngredients,
  DoughProfile,
  SmartInstructions,
  InstructionStep,
  RecipeConfig,
  RecipeMode,
  FlourType,
  LiquidBase,
  Technique,
  MixinType,
  FormInputs,
} from '../types';
import { useBakeryCalculator } from '../hooks/useBakeryCalculator';
import {
  Card,
  Stat,
  Badge,
  Alert,
  Input,
  Select,
  Toggle,
  Divider,
  Table,
  Collapse,
  Loading,
} from '@/shared/components/ui';
import {
  Wheat,
  Droplets,
  ChefHat,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ChefHat as ChefIcon,
  Scale,
  Milk,
  Thermometer,
  Timer,
  Plus,
  Minus,
} from 'lucide-react';

// ============================================================================
// RECIPE SETUP FORM
// ============================================================================

interface RecipeSetupFormProps {
  config: RecipeConfig;
  formInputs: FormInputs;
  updateConfig: <K extends keyof RecipeConfig>(key: K, value: RecipeConfig[K]) => void;
  updateFormInput: <K extends keyof FormInputs>(key: K, value: FormInputs[K]) => void;
  flourTypes: FlourType[];
  liquidBases: LiquidBase[];
  techniques: Technique[];
  mixins: MixinType[];
  recipeModes: RecipeMode[];
}

export const RecipeSetupForm: React.FC<RecipeSetupFormProps> = ({
  config,
  formInputs,
  updateConfig,
  updateFormInput,
  flourTypes,
  liquidBases,
  techniques,
  mixins,
  recipeModes,
}) => {
  const flourTypeLabels: Record<FlourType, string> = {
    ap: 'All-Purpose (10-11% protein)',
    bread: 'Bread Flour (12-14% protein)',
    wheat: 'Whole Wheat (13-14% protein)',
  };
  
  const liquidBaseLabels: Record<LiquidBase, string> = {
    water: 'Water',
    milk: 'Fresh Milk',
    evap: 'Evaporated Milk',
    condensed: 'Sweetened Condensed Milk',
  };
  
  const techniqueLabels: Record<Technique, string> = {
    none: 'Standard',
    egg: 'Egg Wash / Boost',
    tangzhong: 'Tangzhong (Water Roux)',
  };
  
  const mixinLabels: Record<MixinType, string> = {
    none: 'None',
    'Raisins (Pasas)': 'Raisins (Pasas)',
    'Chocolate Chips': 'Chocolate Chips',
    'Cheese (Cheddar/Edam)': 'Cheese Cubes',
    'Mozzarella Cheese': 'Shredded Mozzarella',
    'Mixed Nuts': 'Mixed Nuts',
  };
  
  const modeLabels: Record<RecipeMode, string> = {
    bread: '🍞 Bread',
    cake: '🎂 Cake',
    cookie: '🍪 Cookies',
  };
  
  const modeDescriptions: Record<RecipeMode, string> = {
    bread: 'Yeasted doughs, proofed and baked',
    cake: 'Batter-based, chemical leavening',
    cookie: 'Low hydration, high fat/sugar',
  };

  return (
    <Card title="Recipe Setup" subtitle="Configure your bake parameters" className="space-y-6">
      {/* Recipe Mode Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-base-content">Recipe Type</label>
        <div className="flex gap-2" role="radiogroup" aria-label="Recipe type">
          {recipeModes.map(mode => (
            <label 
              key={mode} 
              className={`btn flex-1 ${config.recipeMode === mode ? 'btn-primary' : 'btn-ghost'} transition-all`}
            >
              <input 
                type="radio" 
                name="recipeMode" 
                value={mode} 
                checked={config.recipeMode === mode}
                onChange={() => {
                  updateConfig('recipeMode', mode);
                  updateFormInput('recipeMode', mode);
                }}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-medium">{modeLabels[mode]}</span>
                <span className="text-xs opacity-70">{modeDescriptions[mode]}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Divider>Basic Parameters</Divider>

      {/* Flour Weight */}
      <Input
        label="Flour Weight"
        type="number"
        min="100"
        max="2000"
        step="50"
        value={formInputs.flourWeight}
        onChange={(e) => {
          const val = Math.max(100, Math.min(2000, parseInt(e.target.value) || 100));
          updateConfig('flourWeight', val);
          updateFormInput('flourWeight', val);
        }}
        helperText="Total flour weight (100% in baker's math)"
        icon={<Scale size={18} />}
      />

      {/* Flour Type */}
      <Select
        label="Flour Type"
        value={formInputs.flourType}
        onChange={(e) => {
          updateConfig('flourType', e.target.value as FlourType);
          updateFormInput('flourType', e.target.value as FlourType);
        }}
        options={flourTypes.map(t => ({ value: t, label: flourTypeLabels[t] }))}
        helperText="Affects hydration needs and gluten development"
      />

      {/* Liquid Base */}
      <Select
        label="Liquid Base"
        value={formInputs.liquidBase}
        onChange={(e) => {
          updateConfig('liquidBase', e.target.value as LiquidBase);
          updateFormInput('liquidBase', e.target.value as LiquidBase);
        }}
        options={liquidBases.map(l => ({ value: l, label: liquidBaseLabels[l] }))}
        helperText="Changes flavor, color, and crumb structure"
      />

      {/* Technique */}
      <Select
        label="Technique"
        value={formInputs.technique}
        onChange={(e) => {
          updateConfig('technique', e.target.value as Technique);
          updateFormInput('technique', e.target.value as Technique);
        }}
        options={techniques.map(t => ({ value: t, label: techniqueLabels[t] }))}
        helperText="Advanced methods for texture control"
      />

      {/* Mix-ins */}
      <Select
        label="Mix-ins (Optional)"
        value={formInputs.mixin}
        onChange={(e) => {
          updateConfig('mixin', e.target.value as MixinType);
          updateFormInput('mixin', e.target.value as MixinType);
        }}
        options={mixins.map(m => ({ value: m, label: mixinLabels[m] }))}
        helperText="Added at end of kneading"
      />

      {/* Diabetic Mode Toggle */}
      <div className="pt-2">
        <Toggle
          label="Diabetic Friendly Mode"
          description="Substitutes sugar with erythritol, adjusts hydration"
          checked={formInputs.isDiabetic}
          onChange={(e) => {
            updateConfig('isDiabetic', e.target.checked);
            updateFormInput('isDiabetic', e.target.checked);
          }}
        />
      </div>

      {/* Advanced Options Collapse */}
      <Collapse title="Advanced Options" icon={<ChefHat size={18} />}>
        <div className="space-y-4 pt-2">
          <Input
            label="Custom Fruit Weight (g)"
            type="number"
            min="0"
            max="500"
            step="10"
            value={formInputs.customFruitWeight}
            onChange={(e) => {
              const val = Math.max(0, Math.min(500, parseInt(e.target.value) || 0));
              updateConfig('customFruitWeight', val);
              updateFormInput('customFruitWeight', val);
            }}
            helperText="For fruit soaking calculations"
            icon={<Wheat size={18} />}
          />
          
          <Input
            label="Custom Liquid Volume (ml)"
            type="number"
            min="0"
            max="1000"
            step="10"
            value={formInputs.customLiquidVolume}
            onChange={(e) => {
              const val = Math.max(0, Math.min(1000, parseInt(e.target.value) || 0));
              updateConfig('customLiquidVolume', val);
              updateFormInput('customLiquidVolume', val);
            }}
            helperText="Override calculated liquid (ml)"
            icon={<Droplets size={18} />}
          />
        </div>
      </Collapse>
    </Card>
  );
};

// ============================================================================
// INGREDIENTS LIST
// ============================================================================

interface IngredientsListProps {
  ingredients: CalculatedIngredients;
  formatIngredient: (name: string, grams: number, type?: 'flour' | 'sugar' | 'butter' | 'liquid' | 'small' | 'spice') => string;
}

export const IngredientsList: React.FC<IngredientsListProps> = ({ 
  ingredients, 
  formatIngredient 
}) => {
  const ingredientGroups = [
    {
      title: 'Flour',
      items: [
        { name: 'Main Flour', grams: ingredients.mainFlour, type: 'flour' as const },
        { name: 'Tangzhong Flour', grams: ingredients.tzFlour, type: 'flour' as const, condition: ingredients.tzFlour > 0 },
      ],
    },
    {
      title: 'Liquids',
      items: [
        { name: ingredients.liquidName, grams: ingredients.mainLiquid, type: 'liquid' as const },
        { name: 'Tangzhong Liquid', grams: ingredients.tzLiquid, type: 'liquid' as const, condition: ingredients.tzLiquid > 0 },
        { name: 'Condensed Milk', grams: ingredients.condensedWeight, type: 'liquid' as const, condition: ingredients.condensedWeight > 0 },
      ],
    },
    {
      title: 'Core Ingredients',
      items: [
        { name: 'Salt', grams: ingredients.saltWeight, type: 'spice' as const },
        { name: 'Instant Yeast', grams: ingredients.yeastWeight, type: 'spice' as const },
        { name: 'Oil', grams: ingredients.oilWeight, type: 'liquid' as const },
        { name: 'Sugar', grams: ingredients.sugarWeight, type: 'sugar' as const, condition: ingredients.sugarWeight > 0 },
        { name: 'Eggs', grams: ingredients.eggCount * 50, type: 'flour' as const, condition: ingredients.eggCount > 0 },
      ],
    },
    {
      title: 'Mix-ins',
      items: [
        { name: ingredients.mixinLabel, grams: ingredients.mixinWeight, type: 'flour' as const, condition: ingredients.mixinWeight > 0 },
      ],
    },
  ];

  return (
    <Card title="Scaled Ingredients" subtitle={`Total: ~${ingredients.totalWeight}g • Liquid: ${ingredients.totalLiquid}ml`}>
      <div className="space-y-6">
        {ingredientGroups.map((group, groupIndex) => {
          const validItems = group.items.filter(item => !item.condition || item.grams > 0);
          if (validItems.length === 0) return null;
          
          return (
            <div key={groupIndex} className="space-y-3">
              <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
                {group.title}
              </h4>
              <div className="space-y-2">
                {validItems.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl border border-base-300/50 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-base-content">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-primary">
                        {formatIngredient(item.name, item.grams, item.type)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Stats */}
      <Divider>Summary</Divider>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Weight" value={ingredients.totalWeight} unit="g" color="primary" icon={<Scale size={16} />} />
        <Stat label="Total Liquid" value={ingredients.totalLiquid} unit="ml" color="info" icon={<Droplets size={16} />} />
        <Stat label="Hydration" value={ingredients.mainFlour > 0 ? Math.round((ingredients.totalLiquid / ingredients.mainFlour) * 100) : 0} unit="%" color="accent" icon={<Wheat size={16} />} />
        <Stat label="Eggs" value={ingredients.eggCount} unit="" color="warning" icon={<Sparkles size={16} />} />
      </div>
    </Card>
  );
};

// ============================================================================
// SMART INSTRUCTIONS
// ============================================================================

interface SmartInstructionsProps {
  instructions: SmartInstructions;
  config: RecipeConfig;
}

export const SmartInstructionsPanel: React.FC<SmartInstructionsProps> = ({ 
  instructions, 
  config 
}) => {
  const { steps, warnings, tips } = instructions;
  
  return (
    <Card title="Smart Instructions" subtitle="Step-by-step guide tailored to your recipe">
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {warnings.map((warning, index) => (
            <Alert 
              key={index} 
              variant="warning" 
              style="dash"
              className="animate-slide-in"
            >
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{warning}</span>
              </div>
            </Alert>
          ))}
        </div>
      )}
      
      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.order} 
            className="flex gap-4 p-4 bg-base-200/30 rounded-xl border border-base-300/50"
          >
            {/* Step Number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg">
              {step.order}
            </div>
            
            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-base-content">{step.title}</h4>
                {step.icon && <span className="text-lg">{step.icon}</span>}
              </div>
              <p className="text-base-content/80 text-sm">{step.description}</p>
              
              {/* Metadata */}
              {(step.temperature || step.timeMinutes) && (
                <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
                  {step.temperature && (
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5" />
                      {step.temperature}°C
                    </span>
                  )}
                  {step.timeMinutes && (
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      ~{step.timeMinutes} min
                    </span>
                  )}
                </div>
              )}
              
              {step.warning && (
                <Alert key={`${step.order}-warn`} variant="warning" style="soft" className="mt-2 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {step.warning}
                </Alert>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Tips */}
      {tips.length > 0 && (
        <Collapse title={`💡 Baker's Tips (${tips.length})`} className="mt-6">
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-base-content/80">
                <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-warning" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Collapse>
      )}
    </Card>
  );
};

// ============================================================================
// DOUGH PROFILE PANEL
// ============================================================================

interface DoughProfilePanelProps {
  profile: DoughProfile;
}

export const DoughProfilePanel: React.FC<DoughProfilePanelProps> = ({ profile }) => (
  <Card title="Predicted Dough Profile" subtitle="Texture prediction based on ingredients">
    <div className="space-y-4">
      <Stat 
        label="Pillowy Softness" 
        value={profile.softness} 
        max={5} 
        color="info" 
        icon={<Sparkles size={16} />}
      />
      <Stat 
        label="Richness & Flavor" 
        value={profile.richness} 
        max={5} 
        color="warning" 
        icon={<ChefIcon size={16} />}
      />
      <Stat 
        label="Chewiness (Gluten)" 
        value={profile.chewiness} 
        max={5} 
        color="accent" 
        icon={<Wheat size={16} />}
      />
    </div>
    
    <Divider className="my-4" />
    
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="p-3 bg-base-200/50 rounded-xl">
        <div className="text-2xl font-bold text-primary">
          {profile.softness >= 4 ? '🟢' : profile.softness >= 3 ? '🟡' : '🔴'}
        </div>
        <div className="text-xs text-base-content/60">Softness</div>
      </div>
      <div className="p-3 bg-base-200/50 rounded-xl">
        <div className="text-2xl font-bold text-warning">
          {profile.richness >= 4 ? '🟢' : profile.richness >= 3 ? '🟡' : '🔴'}
        </div>
        <div className="text-xs text-base-content/60">Richness</div>
      </div>
      <div className="p-3 bg-base-200/50 rounded-xl">
        <div className="text-2xl font-bold text-accent">
          {profile.chewiness >= 4 ? '🟢' : profile.chewiness >= 3 ? '🟡' : '🔴'}
        </div>
        <div className="text-xs text-base-content/60">Chewiness</div>
      </div>
    </div>
  </Card>
);

// ============================================================================
// SOURCES FOOTER
// ============================================================================

export const SourcesFooter: React.FC = () => (
  <footer className="mt-8 pt-6 border-t border-base-300">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-base-content/60">
      <div>
        <h4 className="font-semibold text-base-content mb-2">References</h4>
        <ul className="space-y-1">
          <li>• Baker's Percentage methodology (King Arthur, CIA)</li>
          <li>• Tangzhong method (Yvonne Chen, 65°C water roux)</li>
          <li>• Condensed milk substitution ratios (FDA standards)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-base-content mb-2">Science</h4>
        <ul className="space-y-1">
          <li>• Fruit absorption: 27% weight (USDA data)</li>
          <li>• Egg: ~50g liquid per large egg</li>
          <li>• Air fryer: ~20% faster than conventional oven</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-base-content mb-2">Disclaimer</h4>
        <p className="text-xs">
          Calculations are estimates. Air fryer models vary significantly.
          Always monitor your bake and adjust based on results.
          Internal temp 95°C+ for bread doneness.
        </p>
      </div>
    </div>
    <div className="mt-4 text-center text-xs text-base-content/40">
      Built with React + TypeScript + Tailwind CSS + DaisyUI 5
    </div>
  </footer>
);

// ============================================================================
// SCALING PANEL
// ============================================================================

interface ScalingPanelProps {
  ingredients: CalculatedIngredients;
  scaleToWeight: (targetWeight: number) => {
    factor: number;
    scaledIngredients: Record<string, { grams: number; unit?: string }>;
    newTotalWeight: number;
  };
}

export const ScalingPanel: React.FC<ScalingPanelProps> = ({ 
  ingredients, 
  scaleToWeight 
}) => {
  const [targetWeight, setTargetWeight] = React.useState(ingredients.totalWeight);
  const [scaledResult, setScaledResult] = React.useState<{
    factor: number;
    scaledIngredients: Record<string, { grams: number; unit?: string }>;
    newTotalWeight: number;
  } | null>(null);
  
  const handleScale = () => {
    if (targetWeight > 0 && targetWeight !== ingredients.totalWeight) {
      setScaledResult(scaleToWeight(targetWeight));
    } else {
      setScaledResult(null);
    }
  };
  
  return (
    <Card title="Scale Recipe" subtitle="Adjust total yield weight">
      <div className="flex items-center gap-4 mb-4">
        <Input
          label="Target Weight (g)"
          type="number"
          min="100"
          max="5000"
          step="50"
          value={targetWeight}
          onChange={(e) => setTargetWeight(Math.max(100, Math.min(5000, parseInt(e.target.value) || 100)))}
          className="w-40"
        />
        <button 
          onClick={handleScale}
          className="btn btn-primary"
          disabled={targetWeight === ingredients.totalWeight}
        >
          Calculate
        </button>
        {scaledResult && (
          <Badge color="success" variant="soft">
            Scaled: {scaledResult.factor}x
          </Badge>
        )}
      </div>
      
      {scaledResult && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <Table
            columns={[
              { key: 'name', header: 'Ingredient' },
              { key: 'original', header: 'Original', render: (item: any) => `${item.original}g` },
              { key: 'scaled', header: 'Scaled', render: (item: any) => `${item.scaled}g` },
            ]}
            data={Object.entries(scaledResult.scaledIngredients).map(([name, data]) => ({
              name,
              original: Math.round(data.grams / scaledResult.factor),
              scaled: data.grams,
            }))}
            keyExtractor={item => item.name}
          />
          <div className="font-bold text-right pt-2 border-t border-base-300">
            Total: {scaledResult.newTotalWeight}g
          </div>
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// AIR FRYER SETTINGS PANEL
// ============================================================================

interface AirFryerPanelProps {
  config: RecipeConfig;
  presets: typeof import('../hooks/useBakeryCalculator').AIR_FRYER_PRESETS;
}

export const AirFryerPanel: React.FC<AirFryerPanelProps> = ({ config, presets }) => {
  const [selectedPreset, setSelectedPreset] = React.useState<keyof typeof presets>('generic-1500w');
  
  const preset = presets[selectedPreset];
  const baseTemp = 160;
  const adjustedTemp = baseTemp + preset.tempOffset;
  const baseTime = config.flourWeight <= 300 ? 12 : config.flourWeight <= 500 ? 15 : 18;
  
  return (
    <Card title="Air Fryer Settings" subtitle="Optimized for your equipment">
      <Select
        label="Air Fryer Model"
        value={selectedPreset}
        onChange={(e) => setSelectedPreset(e.target.value as keyof typeof presets)}
        options={Object.entries(presets).map(([key, p]) => ({ 
          value: key, 
          label: `${p.name} (${p.wattage}W, ${p.capacity}L)` 
        }))}
      />
      
      <Divider>Calculated Settings</Divider>
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Temperature" value={adjustedTemp} unit="°C" color="warning" icon={<Thermometer size={16} />} />
        <Stat label="Time" value={baseTime} unit="min" color="info" icon={<Timer size={16} />} />
        <Stat label="Wattage" value={preset.wattage} unit="W" color="primary" icon={<Sparkles size={16} />} />
        <Stat label="Capacity" value={preset.capacity} unit="L" color="secondary" icon={<ChefIcon size={16} />} />
      </div>
      
      <Alert variant="info" style="soft" className="mt-4">
        <div className="flex gap-2">
          <span>💡</span>
          <span className="text-sm">
            Preheat {adjustedTemp}°C for 3 min. Check at {Math.max(baseTime - 3, 5)} min.
            Internal temp should reach 95°C for bread.
          </span>
        </div>
      </Alert>
    </Card>
  );
};