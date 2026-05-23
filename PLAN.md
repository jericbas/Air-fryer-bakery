Prompt: Refactor & Migrate Air Fryer Bread Calculator

Role: You are an Expert React TypeScript Developer and Software Architect.

Task: I have an existing single-file React application called the "Air Fryer Bread Calculator" (which I will provide). I need you to create a complete project plan and generate the code to migrate this into a brand new, scalable, production-ready React application.

🛠 Required Tech Stack

Build Tool: Vite (React + TypeScript template)

Language: TypeScript (Strict mode enabled)

Styling: Tailwind CSS

Icons: lucide-react

Linter/Formatter: Biome JS (Replacing ESLint and Prettier)

Deployment: GitHub Pages (via GitHub Actions)

🏗 Architectural Requirements (SOLID Principles)

You must refactor the existing monolithic App.jsx to adhere to SOLID principles:

Single Responsibility Principle (SRP):

Separate the UI components from the business logic (math/calculations).

Break the UI down into smaller, focused components (e.g., <SetupForm>, <DoughProfile>, <IngredientsList>, <Instructions>).

Open/Closed Principle (OCP):

The baker's percentages, flour types, and hydration rates should be stored in a configuration object or separate constants file so new flours or add-ins can be added without changing the core calculation logic.

Interface Segregation Principle (ISP):

Create strict, focused TypeScript interfaces for component props and state. Do not pass massive state objects to components that only need one or two values.

Dependency Inversion Principle (DIP):

Abstract the state management and calculation logic into a custom hook (e.g., useBreadCalculator()). The UI components should only consume the hook, not perform the math themselves.

💡 Best Practice Suggestions to Implement

State Management: Migrate the multiple useState calls into a single useReducer or a custom hook to manage the complex, interdependent recipe state.

Type Safety: Define exact types for FlourType, LiquidBase, Technique, and MixinType using TypeScript Unions or Enums.

Testing Readiness: Keep the pure math functions (hydration calculations, tangzhong math) in a pure utility file (src/utils/calculator.ts) so they can be easily unit-tested in the future.

📋 Deliverables Required

Please generate the following files and configuration steps:

Phase 1: Setup & Configuration

The exact terminal commands to initialize the Vite + React + TS project and install Tailwind, Lucide, and Biome.

The biome.json configuration file set up for a React/TypeScript project.

The tailwind.config.ts setup.

Phase 2: Domain Logic & Types (The "Core")

src/types/index.ts: All TypeScript interfaces and types.

src/constants/recipeConfig.ts: The hydration rates and baker's percentages.

src/utils/calculations.ts: Pure functions for calculating ingredient weights.

Phase 3: State Management (The "Hook")

src/hooks/useBreadCalculator.ts: A custom hook that manages the form state and calls the calculation utilities.

Phase 4: UI Components (The "View")

Create the component structure in src/components/:

Header.tsx

ScoreBar.tsx (Reusable UI component)

SetupForm.tsx (Inputs)

DoughProfile.tsx (Scoring UI)

IngredientsList.tsx (Output logic)

SmartInstructions.tsx (Dynamic instructions)

SourcesFooter.tsx

src/App.tsx: The main layout that brings the components together.

Phase 5: GitHub Pages Deployment

Generate a .github/workflows/deploy.yml file configured to build the Vite project using Biome checks, and deploy to GitHub Pages.

Specify any vite.config.ts changes needed for GitHub pages (e.g., setting the base path).


my  INITIAL old code 


```
import React, { useState } from 'react';
import { Calculator, Wheat, Droplets, Egg, Scale, Flame, ChefHat, Info, Feather, Milk, Star, BookOpen } from 'lucide-react';

/* * ==========================================
 * BREAD SCIENCE & BAKER'S MATH SOURCES
 * ==========================================
 * 1. Hydration Rates: Based on standard professional baker's math (e.g., King Arthur Baking guidelines).
 * - All-Purpose (~10-11% protein) optimally hydrates at 60%.
 * - Bread Flour (~12-14% protein) needs more water to form gluten, standard is 65%.
 * 2. Tangzhong Method: Originates from Japanese/Taiwanese baking (Yvonne Chen's "65°C Bread Doctor"). 
 * - Standard formula: 5% of total flour cooked with liquid at a 1:5 ratio by weight.
 * 3. Condensada (Sweetened Condensed Milk): A staple in Philippine bakeries (Pandesal, Ensaymada). 
 * - It contains roughly 70-74% milk solids/sugar and 26-30% water. 
 * - When used, we must subtract its water content (~30% of its weight) from the main liquid 
 * so the dough doesn't become a wet mess, and remove white sugar since it's already 40-45% sugar.
 */

const App = () => {
  const [flourWeight, setFlourWeight] = useState(500);
  const [flourType, setFlourType] = useState('ap');
  const [liquidBase, setLiquidBase] = useState('water');
  const [technique, setTechnique] = useState('none'); 
  const [mixin, setMixin] = useState('none');

  // Hydration rates based on flour type (Source: Standard Baker's Percentages)
  const hydrationRates = {
    ap: 0.60,      
    bread: 0.65,   
    wheat: 0.73    
  };

  // Standard Baker's Percentages for enriched dough
  const OIL_PERCENTAGE = 0.08;   
  const SUGAR_PERCENTAGE = 0.08; 
  const SALT_PERCENTAGE = 0.02;  
  const YEAST_PERCENTAGE = 0.015;

  // --- Base Calculations ---
  const weight = Math.max(0, Number(flourWeight) || 0);
  const totalLiquid = weight * hydrationRates[flourType];
  
  const saltWeight = weight * SALT_PERCENTAGE;
  const yeastWeight = weight * YEAST_PERCENTAGE;
  const oilWeight = weight * OIL_PERCENTAGE;
  const mixinWeight = weight * 0.20; 

  // --- Liquid & Sweetness Adjustments ---
  let sugarWeight = weight * SUGAR_PERCENTAGE;
  let condensedWeight = 0;
  let liquidName = "Water";
  let baseLiquidAmount = totalLiquid;

  if (liquidBase === 'milk') {
    liquidName = "Fresh Milk";
  } else if (liquidBase === 'evap') {
    liquidName = "Evaporated (Evap)";
  } else if (liquidBase === 'condensed') {
    // Condensada substitution logic
    condensedWeight = weight * 0.20; 
    sugarWeight = 0; 
    baseLiquidAmount = baseLiquidAmount - (condensedWeight * 0.30); 
    liquidName = "Water"; 
  }

  // --- Technique Adjustments (Egg, Tangzhong) ---
  let eggCount = 0;
  let eggLiquid = 0;
  let tzFlour = 0;
  let tzLiquid = 0;
  let mainFlour = weight;
  let mainLiquid = baseLiquidAmount;

  if (technique === 'egg') {
    // 1 standard large egg = ~50g of liquid. Subtract from total hydration.
    eggCount = Math.max(1, Math.round(weight / 400));
    eggLiquid = eggCount * 50; 
    mainLiquid = Math.max(0, mainLiquid - eggLiquid);
  } else if (technique === 'tangzhong') {
    // 1:5 ratio Tangzhong roux calculations
    tzFlour = weight * 0.05; 
    tzLiquid = tzFlour * 5;  
    mainFlour = weight - tzFlour;
    mainLiquid = Math.max(0, mainLiquid - tzLiquid);
  }

  // --- DYNAMIC BREAD PROFILE SCORING ---
  // Calculates characteristics out of 5 based on user selections
  
  // 1. Softness: Tangzhong is the biggest contributor. Milk/Egg also soften crumb.
  let softness = 2;
  if (technique === 'tangzhong') softness += 2;
  if (technique === 'egg') softness += 0.5;
  if (['milk', 'evap', 'condensed'].includes(liquidBase)) softness += 0.5;
  if (flourType === 'ap') softness += 0.5; // AP is softer than Bread/Wheat
  softness = Math.min(5, softness);

  // 2. Richness & Sweetness: Condensada and Egg drastically increase richness.
  let richness = 1;
  if (liquidBase === 'condensed') richness += 3;
  else if (['milk', 'evap'].includes(liquidBase)) richness += 1;
  if (technique === 'egg') richness += 1;
  if (mixin !== 'none') richness += 0.5;
  richness = Math.min(5, richness);

  // 3. Chewiness: Driven primarily by protein content in Bread/Wheat flour.
  let chewiness = 1;
  if (flourType === 'bread') chewiness += 3;
  if (flourType === 'wheat') chewiness += 2;
  if (flourType === 'ap') chewiness += 1.5;
  if (technique === 'none') chewiness += 0.5; // No dough conditioners = slightly more chew
  chewiness = Math.min(5, chewiness);

  // --- Formatting Helpers ---
  const formatCups = (g) => `~${(g / 125).toFixed(1)} cups 🥛`;
  const formatTbsp = (g, density) => `~${(g / density).toFixed(1)} Tablespoons 🥄`;
  const formatTsp = (g, density) => `~${(g / density).toFixed(1)} teaspoons 🤏`;
  const formatMl = (g) => `${Math.round(g)} mL 💧`;

  const ScoreBar = ({ label, score, colorClass }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold text-stone-600">
        <span className="uppercase tracking-wider">{label}</span>
        <span>{score.toFixed(1)} / 5</span>
      </div>
      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-500 ease-out`} 
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50 text-stone-800 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-full text-white mb-2 shadow-lg">
            <Wheat size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 tracking-tight">Air Fryer Bread Calculator</h1>
          <p className="text-stone-600">Smart scaling, multi-measurements, and dynamic dough profiling.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Inputs & Profile */}
          <div className="xl:col-span-1 space-y-6">
            
            {}
            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-amber-500" />
                Recipe Setup
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Flour (grams)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={flourWeight}
                      onChange={(e) => setFlourWeight(e.target.value)}
                      className="w-full pl-10 pr-2 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors outline-none text-base font-medium"
                    />
                    <Scale className="absolute left-3 top-3 text-stone-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Flour Type</label>
                  <select
                    value={flourType}
                    onChange={(e) => setFlourType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors outline-none text-base font-medium bg-white"
                  >
                    <option value="ap">All-Purpose</option>
                    <option value="bread">Bread Flour</option>
                    <option value="wheat">Whole Wheat</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Liquid Base</label>
                  <div className="relative">
                    <select
                      value={liquidBase}
                      onChange={(e) => setLiquidBase(e.target.value)}
                      className="w-full pl-10 pr-2 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors outline-none text-base font-medium bg-white appearance-none"
                    >
                      <option value="water">Water</option>
                      <option value="milk">Fresh Milk</option>
                      <option value="evap">Evaporated (Evap)</option>
                      <option value="condensed">Condensada</option>
                    </select>
                    <Milk className="absolute left-3 top-3 text-blue-500" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Technique</label>
                  <div className="relative">
                    <select
                      value={technique}
                      onChange={(e) => setTechnique(e.target.value)}
                      className="w-full pl-10 pr-2 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors outline-none text-base font-medium bg-white appearance-none"
                    >
                      <option value="none">Standard</option>
                      <option value="egg">Add Egg</option>
                      <option value="tangzhong">Tangzhong</option>
                    </select>
                    <Feather className="absolute left-3 top-3 text-amber-500" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Add-ins / Flavors</label>
                  <select
                    value={mixin}
                    onChange={(e) => setMixin(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors outline-none text-base font-medium bg-white"
                  >
                    <option value="none">None</option>
                    <option value="Raisins (Pasas)">Raisins (Pasas)</option>
                    <option value="Chocolate Chips">Chocolate Chips</option>
                    <option value="Cheese (Cheddar/Edam)">Cheese (Cheddar/Edam)</option>
                    <option value="Mozzarella Cheese">Mozzarella Cheese</option>
                    <option value="Mixed Nuts">Mixed Nuts</option>
                  </select>
                </div>
              </div>
            </div>

            {}
            {/* Dynamic Bread Profile Component */}
            <div className="bg-stone-800 rounded-2xl shadow-sm border border-stone-700 p-6 text-stone-100">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <Star size={18} className="text-yellow-400" />
                Predicted Dough Profile
              </h2>
              <div className="space-y-5">
                <ScoreBar label="Pillowy Softness" score={softness} colorClass="bg-blue-400" />
                <ScoreBar label="Richness & Flavor" score={richness} colorClass="bg-yellow-400" />
                <ScoreBar label="Chewiness (Gluten)" score={chewiness} colorClass="bg-orange-500" />
              </div>
              <p className="text-xs text-stone-400 mt-5 italic">
                *Adjust your ingredients above to see how they change the final texture of your bread!
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Ingredients & Instructions */}
          <div className="xl:col-span-2 space-y-6">
            
            {}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
                <ChefHat size={20} className="text-amber-500" />
                Ingredients List
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dry Ingredients */}
                <div className="space-y-2">
                  <h3 className="font-bold text-stone-400 uppercase tracking-wider text-xs border-b border-stone-100 pb-2">Dry Ingredients</h3>
                  
                  <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-orange-50/50 px-1 rounded transition-colors">
                    <span className="font-medium text-stone-700">Flour {technique === 'tangzhong' ? '(Main Dough)' : ''}</span>
                    <div className="text-right">
                      <span className="font-bold text-amber-700">{Math.round(mainFlour)}g</span>
                      <span className="inline-block text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full ml-2 w-24 text-center">{formatCups(mainFlour)}</span>
                    </div>
                  </div>
                  
                  {sugarWeight > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-orange-50/50 px-1 rounded transition-colors">
                      <span className="font-medium text-stone-700">White Sugar</span>
                      <div className="text-right">
                        <span className="font-bold text-amber-700">{Math.round(sugarWeight)}g</span>
                        <span className="inline-block text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full ml-2 w-24 text-center">{formatTbsp(sugarWeight, 12.5)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-orange-50/50 px-1 rounded transition-colors">
                    <span className="font-medium text-stone-700">Salt</span>
                    <div className="text-right">
                      <span className="font-bold text-amber-700">{Math.round(saltWeight)}g</span>
                      <span className="inline-block text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full ml-2 w-24 text-center">{formatTsp(saltWeight, 5)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-orange-50/50 px-1 rounded transition-colors">
                    <span className="font-medium text-stone-700">Yeast</span>
                    <div className="text-right">
                      <span className="font-bold text-amber-700">{Math.round(yeastWeight)}g</span>
                      <span className="inline-block text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full ml-2 w-24 text-center">{formatTsp(yeastWeight, 3)}</span>
                    </div>
                  </div>
                </div>

                {/* Wet Ingredients */}
                <div className="space-y-2">
                  <h3 className="font-bold text-stone-400 uppercase tracking-wider text-xs border-b border-stone-100 pb-2">Wet Ingredients</h3>
                  
                  <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-blue-50/50 px-1 rounded transition-colors">
                    <span className="font-medium text-stone-700">{liquidName} {technique === 'tangzhong' ? '(Main Dough)' : ''}</span>
                    <div className="text-right">
                      <span className="font-bold text-blue-600">{formatMl(mainLiquid)}</span>
                      <span className="inline-block text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full ml-2 w-24 text-center">~{(mainLiquid / 240).toFixed(1)} cups 🥛</span>
                    </div>
                  </div>

                  {condensedWeight > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-yellow-50/50 px-1 rounded transition-colors">
                      <span className="font-medium text-stone-700">Condensada</span>
                      <div className="text-right">
                        <span className="font-bold text-yellow-600">{Math.round(condensedWeight)}g</span>
                        <span className="inline-block text-[11px] font-medium bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full ml-2 w-24 text-center">{formatTbsp(condensedWeight, 20)}</span>
                      </div>
                    </div>
                  )}

                  {technique === 'egg' && (
                    <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-yellow-50/50 px-1 rounded transition-colors">
                      <span className="font-medium text-stone-700">Egg</span>
                      <span className="font-bold text-yellow-600">{eggCount} large 🥚</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-stone-50 hover:bg-green-50/50 px-1 rounded transition-colors">
                    <span className="font-medium text-stone-700">Oil (Olive or Veg)</span>
                    <div className="text-right">
                      <span className="font-bold text-green-600">{Math.round(oilWeight)}g</span>
                      <span className="inline-block text-[11px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full ml-2 w-24 text-center">{formatTbsp(oilWeight, 14)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tangzhong Specific */}
              {technique === 'tangzhong' && (
                <div className="mt-6 space-y-2 bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h3 className="font-bold text-amber-800 uppercase tracking-wider text-xs pb-1">For Tangzhong Paste</h3>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-stone-700">Flour</span>
                    <span className="font-bold text-amber-700">{Math.round(tzFlour)}g <span className="inline-block text-xs font-medium bg-amber-200/50 text-amber-900 px-2 py-0.5 rounded-full ml-1">{formatTbsp(tzFlour, 8)}</span></span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-stone-700">Water/Milk</span>
                    <span className="font-bold text-blue-600">{formatMl(tzLiquid)} <span className="inline-block text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-1">{formatTbsp(tzLiquid, 15)}</span></span>
                  </div>
                </div>
              )}

              {}
              {mixin !== 'none' && (
                <div className="mt-6 space-y-2 border-t border-stone-100 pt-4">
                  <h3 className="font-bold text-purple-400 uppercase tracking-wider text-xs pb-2">Add-ins</h3>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-stone-700">{mixin}</span>
                    <div className="text-right">
                      <span className="font-bold text-purple-600">{Math.round(mixinWeight)}g</span>
                      <span className="inline-block text-xs font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full ml-2">~{(mixinWeight / 15).toFixed(0)} Tablespoons 🥄</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {}
            {/* Instructions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
                <Flame size={20} className="text-amber-500" />
                Smart Instructions
              </h2>

              <div className="space-y-6">
                
                {technique === 'tangzhong' && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">T</div>
                    <div>
                      <h4 className="font-semibold text-stone-800">Make Tangzhong Roux</h4>
                      <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                        In a small pan, whisk together <strong>{Math.round(tzFlour)}g ({formatTbsp(tzFlour, 8)}) of flour</strong> and <strong>{formatMl(tzLiquid)} of liquid</strong>. Cook over medium-low heat, stirring constantly until it forms a thick paste (pudding-like). Let it cool to room temperature.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Dry Ingredients</h4>
                    <p className="text-stone-600 text-sm mt-1 mb-2">In your stand mixer bowl, combine:</p>
                    <ul className="list-disc list-inside text-sm text-stone-700 space-y-1 ml-1 border-l-2 border-stone-200 pl-3">
                      <li><strong>{Math.round(mainFlour)}g</strong> ({formatCups(mainFlour)}) flour</li>
                      {sugarWeight > 0 && <li><strong>{Math.round(sugarWeight)}g</strong> ({formatTbsp(sugarWeight, 12.5)}) sugar</li>}
                      <li><strong>{Math.round(saltWeight)}g</strong> ({formatTsp(saltWeight, 5)}) salt</li>
                      <li><strong>{Math.round(yeastWeight)}g</strong> ({formatTsp(yeastWeight, 3)}) yeast</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Wet Ingredients</h4>
                    <p className="text-stone-600 text-sm mt-1 mb-2">Add the following to the dry ingredients:</p>
                    <ul className="list-disc list-inside text-sm text-stone-700 space-y-1 ml-1 border-l-2 border-stone-200 pl-3">
                      <li><strong>{formatMl(mainLiquid)}</strong> of {liquidName.toLowerCase()}</li>
                      {condensedWeight > 0 && <li><strong>{Math.round(condensedWeight)}g</strong> ({formatTbsp(condensedWeight, 20)}) Condensada</li>}
                      <li><strong>{Math.round(oilWeight)}g</strong> ({formatTbsp(oilWeight, 14)}) oil</li>
                      {technique === 'egg' && <li><strong>{eggCount}</strong> egg(s)</li>}
                      {technique === 'tangzhong' && <li>The <strong>cooled Tangzhong paste</strong></li>}
                    </ul>
                  </div>
                </div>

                {}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Knead {mixin !== 'none' && '& Mix-ins'}</h4>
                    <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                      Using the dough hook, mix on low for 2 minutes. Increase to medium and knead for 5-8 minutes until the dough is smooth, elastic, and clears the sides of the bowl.
                      {mixin !== 'none' && mixin !== 'Mozzarella Cheese' && <strong className="block mt-2 text-purple-700">Add the {mixin}: In the last 1-2 minutes of kneading, gently fold them in until just combined.</strong>}
                      {mixin === 'Mozzarella Cheese' && <strong className="block mt-2 text-purple-700">Add the Mozzarella: For a stuffed roll, place it in the center during shaping. For an Earthquake Cheese Loaf, fold small cheese cubes into the dough during the last minute of kneading, and sprinkle extra grated cheese on top right before air frying!</strong>}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Rise & Shape</h4>
                    <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                      Cover and let rest in a warm place for 1 hour (until doubled). Punch down, shape the dough to fit your air fryer (use parchment paper), and let rise again for 30-40 mins.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Air Fry</h4>
                    <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                      Bake in the air fryer at <strong>160°C</strong> for 20-25 minutes. If the top gets brown too fast, cover loosely with foil halfway through.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {}
            {/* Baker's Science & Sources Section */}
            <div className="bg-stone-100/80 rounded-2xl p-6 md:p-8 text-stone-600 border border-stone-200 mt-2">
              <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-stone-500" />
                Baker's Math & Science Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-700">1. Hydration Rates</h4>
                  <p className="leading-relaxed">Based on standard professional baker's math (e.g., <a href="https://www.kingarthurbaking.com/learn/guides/bakers-percentage" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 hover:underline font-medium">King Arthur Baking</a> guidelines). All-Purpose flour (~10-11% protein) optimally hydrates at 60%. Bread Flour (~12-14% protein) needs more water to form gluten, so standard hydration is increased to 65%.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-700">2. Tangzhong Method</h4>
                  <p className="leading-relaxed">Originates from Asian bakery techniques (read more on the <a href="https://www.kingarthurbaking.com/blog/2018/03/26/introduction-to-tangzhong" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 hover:underline font-medium">Science of Tangzhong</a>). It pre-gelatinizes the starches in the flour. The standard formula uses 5% of total flour cooked with liquid at a 1:5 ratio by weight.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-700">3. Condensada Science</h4>
                  <p className="leading-relaxed">A staple in Philippine bakeries for making rich, sweet breads like <a href="https://panlasangpinoy.com/pandesal-recipe/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 hover:underline font-medium">Pandesal</a> and <a href="https://www.kawalingpinoy.com/ensaymada/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 hover:underline font-medium">Ensaymada</a>. It contains roughly 70% milk solids/sugar and 30% water. The calculator automatically subtracts its water content from the main liquid and removes added white sugar to keep the dough balanced.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

```
