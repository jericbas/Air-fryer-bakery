import React from 'react';
import { Wheat } from 'lucide-react';
import { useBreadCalculator } from './hooks/useBreadCalculator';
import { SetupForm } from './components/SetupForm';
import { ScoreBar } from './components/ScoreBar';
// Import other separated components here...

const App: React.FC = () => {
  const { config, updateConfig, ingredients, profile } = useBreadCalculator();

  return (
    <div className="min-h-screen bg-orange-50 text-stone-800 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-full text-white mb-2 shadow-lg">
            <Wheat size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 tracking-tight">Air Fryer Bread Calculator</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <SetupForm config={config} updateConfig={updateConfig} />
            
            {/* Dough Profile UI */}
            <div className="bg-stone-800 rounded-2xl p-6 text-stone-100">
              <h2 className="text-lg font-semibold text-white mb-5">Predicted Dough Profile</h2>
              <ScoreBar label="Pillowy Softness" score={profile.softness} colorClass="bg-blue-400" />
              <ScoreBar label="Richness & Flavor" score={profile.richness} colorClass="bg-yellow-400" />
              <ScoreBar label="Chewiness (Gluten)" score={profile.chewiness} colorClass="bg-orange-500" />
            </div>
          </div>
          <div className="xl:col-span-2 space-y-6">
            {/* Render <IngredientsList ingredients={ingredients} /> 
              Render <SmartInstructions ingredients={ingredients} config={config} /> 
              Render <SourcesFooter /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;