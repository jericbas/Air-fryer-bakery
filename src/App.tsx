import { Wheat, Cake, Cookie, Flame, Croissant } from 'lucide-react';
import { useBakingCalculator } from './hooks/useBreadCalculator.js';
import { Ingredient, RecipeMode } from './types.js';
import { SetupForm } from './components/SetupForm.js';
import { ScoreBar } from './components/ScoreBar.js';

const App: React.FC = () => {
  const { config, updateConfig, setRecipeMode, ingredients, profile } = useBakingCalculator();

  const modes: Array<{ id: RecipeMode; label: string; icon: React.ReactNode; color: string }> = [
    { id: 'fruitCake', label: 'Fruit Cake', icon: <Cake size={20} />, color: 'bg-red-500' },
    { id: 'bread', label: 'Bread Dough', icon: <Wheat size={20} />, color: 'bg-amber-500' },
    { id: 'cookies', label: 'Cookies', icon: <Cookie size={20} />, color: 'bg-orange-500' },
    { id: 'brownies', label: 'Brownies & Bars', icon: <Flame size={20} />, color: 'bg-amber-900' },
    { id: 'empanada', label: 'Empanada', icon: <Croissant size={20} />, color: 'bg-yellow-600' },
  ];

  const getIconForMode = (mode: RecipeMode) => {
    return modes.find((m) => m.id === mode)?.icon;
  };

  const getColorForMode = (mode: RecipeMode) => {
    return modes.find((m) => m.id === mode)?.color || 'bg-amber-500';
  };

  return (
    <div className="min-h-screen bg-orange-50 text-stone-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className={`inline-flex items-center justify-center p-3 ${getColorForMode(config.recipeMode)} rounded-full text-white mb-2 shadow-lg`}>
            {getIconForMode(config.recipeMode)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 tracking-tight">Air Fryer Bakery</h1>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setRecipeMode(mode.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                config.recipeMode === mode.id
                  ? `${mode.color} text-white shadow-lg scale-105`
                  : 'bg-white text-stone-700 border-2 border-stone-200 hover:border-stone-400'
              }`}
            >
              <span className="hidden sm:inline">{mode.label}</span>
              <span className="sm:hidden">{mode.icon}</span>
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Flour Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Base Flour (grams)</label>
            <input
              type="number"
              name="baseFlour"
              value={config.baseFlour}
              onChange={(e) => updateConfig('baseFlour', Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none"
              min="10"
            />
          </div>

          {/* Diabetic Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Dietary Options</label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.isDiabetic}
                onChange={(e) => updateConfig('isDiabetic', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Diabetic-Friendly</span>
            </label>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Parameters */}
          <div className="lg:col-span-1">
            <SetupForm config={config} updateConfig={updateConfig} />
            
            {/* Warnings */}
            {ingredients.warnings && ingredients.warnings.highLiquidWarning && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-semibold">⚠️ Too much liquid!</p>
                <p className="text-red-600 text-sm">Ideal: ~{ingredients.warnings.idealLiquidWeight}mL</p>
              </div>
            )}

            {ingredients.warnings && ingredients.warnings.lowLiquidWarning && (
              <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-amber-700 font-semibold">⚠️ Too little liquid!</p>
                <p className="text-amber-600 text-sm">Ideal: ~{ingredients.warnings.idealLiquidWeight}mL</p>
              </div>
            )}

            {/* Dough Profile (Bread mode only) */}
            {config.recipeMode === 'bread' && (
              <div className="mt-6 bg-stone-800 rounded-2xl p-6 text-stone-100">
                <h2 className="text-lg font-semibold text-white mb-5">Predicted Dough Profile</h2>
                <ScoreBar label="Pillowy Softness" score={profile.softness} colorClass="bg-blue-400" />
                <ScoreBar label="Richness & Flavor" score={profile.richness} colorClass="bg-yellow-400" />
                <ScoreBar label="Chewiness (Gluten)" score={profile.chewiness} colorClass="bg-orange-500" />
              </div>
            )}
          </div>

          {/* Right Columns: Ingredients Output */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <h2 className="text-xl font-semibold text-amber-900 mb-6">Scaled Ingredients</h2>
              <div className="space-y-3">
                {ingredients.ingredients && Object.entries(ingredients.ingredients as Record<string, Ingredient>).map(([key, ingredient]) => (
                  <div
                    key={key}
                    className={`flex justify-between items-center py-2 px-3 rounded border border-stone-100 ${ingredient.bg || 'bg-stone-50'}`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-stone-800">{ingredient.label}</div>
                      {ingredient.note && <div className="text-xs text-stone-500">{ingredient.note}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-amber-900">{ingredient.grams}g</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;