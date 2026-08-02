import { Wheat, Settings } from 'lucide-react';
import { useBakeryCalculator } from './features/calculator/hooks/useBakeryCalculator';
import {
  RecipeSetupForm,
  IngredientsList,
  SmartInstructionsPanel,
  DoughProfilePanel,
  AirFryerPanel,
  ScalingPanel,
  SourcesFooter,
} from './features/calculator/components';

const App: React.FC = () => {
  const {
    config,
    formInputs,
    ingredients,
    profile,
    instructions,
    updateConfig,
    updateFormInput,
    scaleToWeight,
    formatIngredient,
    flourTypes,
    liquidBases,
    techniques,
    mixins,
    recipeModes,
    airFryerPresets,
  } = useBakeryCalculator();

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-content mb-2 shadow-lg">
            <Wheat size={36} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-base-content tracking-tight">
            Air Fryer Bakery
          </h1>
          <p className="text-base-content/60 max-w-2xl mx-auto text-balance">
            Professional baker's math calculator optimized for air fryers.
            Enter your flour weight, choose your ingredients, and let science handle the rest.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <span className="badge badge-primary badge-outline">Baker's Math</span>
            <span className="badge badge-accent badge-outline">Hydration Control</span>
            <span className="badge badge-info badge-outline">Air Fryer Ready</span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Setup */}
          <div className="lg:col-span-1 space-y-6">
            <RecipeSetupForm
              config={config}
              formInputs={formInputs}
              updateConfig={updateConfig}
              updateFormInput={updateFormInput}
              flourTypes={flourTypes}
              liquidBases={liquidBases}
              techniques={techniques}
              mixins={mixins}
              recipeModes={recipeModes}
            />
            
            {/* Dough Profile */}
            <DoughProfilePanel profile={profile} />
            
            {/* Air Fryer Settings */}
            <AirFryerPanel config={config} presets={airFryerPresets} />
          </div>
          
          {/* Right Column: Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ingredients */}
            <IngredientsList 
              ingredients={ingredients} 
              formatIngredient={formatIngredient} 
            />
            
            {/* Smart Instructions */}
            <SmartInstructionsPanel 
              instructions={instructions} 
              config={config} 
            />
            
            {/* Scaling */}
            <ScalingPanel 
              ingredients={ingredients} 
              scaleToWeight={scaleToWeight} 
            />
          </div>
        </div>
        
        {/* Footer */}
        <SourcesFooter />
      </div>
    </div>
  );
};

export default App;