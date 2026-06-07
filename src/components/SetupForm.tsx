import React from 'react';
import { Scale, Milk, Feather, Calculator } from 'lucide-react';
import { RecipeConfig } from '../types.js';

interface Props {
  config: RecipeConfig;
  updateConfig: <K extends keyof RecipeConfig>(key: K, value: RecipeConfig[K]) => void;
}

export const SetupForm: React.FC<Props> = ({ config, updateConfig }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
      <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
        <Calculator size={20} className="text-amber-500" />
        Recipe Parameters
      </h2>
      <div className="space-y-4">
        
        {/* Bread Mode Parameters */}
        {config.recipeMode === 'bread' && (
          <>
            {/* Flour Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">Flour Type</label>
              <select
                value={config.flourType || 'ap'}
                onChange={(e) => updateConfig('flourType', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
              >
                <option value="ap">All-Purpose</option>
                <option value="bread">Bread Flour</option>
                <option value="wheat">Whole Wheat</option>
              </select>
            </div>

            {/* Liquid Base */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">Liquid Base</label>
              <select
                value={config.liquidBase || 'water'}
                onChange={(e) => updateConfig('liquidBase', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
              >
                <option value="water">Water</option>
                <option value="milk">Milk</option>
                <option value="evap">Evaporated Milk</option>
                <option value="condensed">Sweetened Condensed Milk</option>
              </select>
            </div>

            {/* Technique */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">Technique</label>
              <select
                value={config.breadTechnique || 'none'}
                onChange={(e) => updateConfig('breadTechnique', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
              >
                <option value="none">None</option>
                <option value="egg">Egg Wash / Boost</option>
                <option value="tangzhong">Tangzhong (Pre-cook)</option>
              </select>
            </div>

            {/* Add-in */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">Add-in (Optional)</label>
              <select
                value={config.breadMixin || 'none'}
                onChange={(e) => updateConfig('breadMixin', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
              >
                <option value="none">None</option>
                <option value="Raisins (Pasas)">Raisins</option>
                <option value="Chocolate Chips">Chocolate Chips</option>
                <option value="Cheese (Cheddar/Edam)">Cheese Cubes</option>
                <option value="Mozzarella Cheese">Shredded Mozzarella</option>
                <option value="Mixed Nuts">Mixed Nuts</option>
              </select>
            </div>
          </>
        )}

        {/* Fruit Cake Parameters */}
        {config.recipeMode === 'fruitCake' && (
          <>
            {/* Cake Style */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">Cake Style</label>
              <select
                value={config.cakeStyle || 'traditional'}
                onChange={(e) => updateConfig('cakeStyle', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
              >
                <option value="traditional">Traditional (Dense)</option>
                <option value="light">Light & Fluffy</option>
              </select>
            </div>

            {/* Jam Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">Add Jam (Optional)</label>
              <select
                value={config.jamType || 'none'}
                onChange={(e) => updateConfig('jamType', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
              >
                <option value="none">None</option>
                <option value="Orange Marmalade">Orange Marmalade</option>
                <option value="Pineapple Jam">Pineapple Jam</option>
                <option value="Apricot Jam">Apricot Jam</option>
              </select>
            </div>

            {/* Soak Liquid */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700">Soak Liquid</label>
              <select
                value={config.soakLiquid || 'none'}
                onChange={(e) => updateConfig('soakLiquid', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
              >
                <option value="none">None</option>
                <option value="Dark Rum">Dark Rum</option>
                <option value="Juice">Pineapple/Orange Juice</option>
              </select>
            </div>

            {/* Custom Liquid Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useCustomLiquid || false}
                  onChange={(e) => updateConfig('useCustomLiquid', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Custom Fruit & Liquid Amounts</span>
              </label>
            </div>

            {config.useCustomLiquid && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Fruit Weight (grams)</label>
                  <input
                    type="number"
                    value={config.customFruitWeight || 0}
                    onChange={(e) => updateConfig('customFruitWeight', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Soaking Liquid (mL)</label>
                  <input
                    type="number"
                    value={config.customLiquidWeight || 0}
                    onChange={(e) => updateConfig('customLiquidWeight', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Cookies Parameters */}
        {config.recipeMode === 'cookies' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Cookie Style</label>
            <select
              value={config.cookieStyle || 'classic'}
              onChange={(e) => updateConfig('cookieStyle', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
            >
              <option value="classic">Classic Chocolate Chip</option>
              <option value="ube">Ube Crinkles</option>
            </select>
          </div>
        )}

        {/* Brownies Parameters */}
        {config.recipeMode === 'brownies' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Brownie Style</label>
            <select
              value={config.brownieStyle || 'fudgy'}
              onChange={(e) => updateConfig('brownieStyle', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
            >
              <option value="fudgy">Fudgy Chocolate Brownies</option>
              <option value="foodForTheGods">Food for the Gods</option>
            </select>
          </div>
        )}

        {/* Empanada Parameters */}
        {config.recipeMode === 'empanada' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Fat Type</label>
            <select
              value={config.fatType || 'butter'}
              onChange={(e) => updateConfig('fatType', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
            >
              <option value="butter">Cold Butter</option>
              <option value="shortening">Shortening</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};