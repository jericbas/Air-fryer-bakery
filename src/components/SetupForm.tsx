import React from 'react';
import { Scale, Milk, Feather, Calculator } from 'lucide-react';
import { RecipeConfig, FlourType, LiquidBase, Technique, MixinType } from '../types';

interface Props {
  config: RecipeConfig;
  updateConfig: <K extends keyof RecipeConfig>(key: K, value: RecipeConfig[K]) => void;
}

export const SetupForm: React.FC<Props> = ({ config, updateConfig }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
      <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
        <Calculator size={20} className="text-amber-500" />
        Recipe Setup
      </h2>
      <div className="space-y-4">
        
        {/* Flour Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Flour (grams)</label>
          <div className="relative">
            <input
              type="number"
              value={config.flourWeight}
              onChange={(e) => updateConfig('flourWeight', Number(e.target.value))}
              className="w-full pl-10 pr-2 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none"
            />
            <Scale className="absolute left-3 top-3 text-stone-400" size={18} />
          </div>
        </div>

        {/* Flour Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Flour Type</label>
          <select
            value={config.flourType}
            onChange={(e) => updateConfig('flourType', e.target.value as FlourType)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
          >
            <option value="ap">All-Purpose</option>
            <option value="bread">Bread Flour</option>
            <option value="wheat">Whole Wheat</option>
          </select>
        </div>

        {/* Technique */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Technique</label>
          <select
            value={config.technique}
            onChange={(e) => updateConfig('technique', e.target.value as Technique)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
          >
            <option value="none">None</option>
            <option value="egg">Egg Wash / Boost</option>
            <option value="tangzhong">Tangzhong (Pre-cook)</option>
          </select>
        </div>

         {/* Liquid Base */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Liquid Base</label>
          <select
            value={config.liquidBase}
            onChange={(e) => updateConfig('liquidBase', e.target.value as LiquidBase)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 outline-none bg-white"
          >
            <option value="water">Water</option>
            <option value="milk">Milk</option>
            <option value="evap">Evaporated Milk (Evap)</option>
            <option value="condensed">Sweetened Condensed Milk</option>
          </select>
        </div>

        {/* Mixin */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Mix-ins (Optional)</label>
          <select
            value={config.mixin}
            onChange={(e) => updateConfig('mixin', e.target.value as MixinType)}
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
      </div>
    </div>
  );
};