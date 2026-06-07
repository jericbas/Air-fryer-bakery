// src/components/CalculatorPage.tsx
import React from 'react';
import { useBakingCalculator } from '../hooks/useBakingCalculator.js';

/**
 * Main page component responsible for orchestrating the UI based on calculated state.
 * This component consumes the custom hook and renders the dynamic interface elements.
 */
const CalculatorPage: React.FC = () => {
    const { config } = useBakingCalculator();

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-amber-900">Air Fryer Bakery Calculator</h1>
            <div className="rounded-xl border border-stone-200 p-6 bg-white">
                <p className="text-stone-700">Recipe mode: <strong>{config.recipeMode}</strong></p>
                <p className="text-stone-500 mt-2">This component is a placeholder for the rebuilt calculator page.</p>
            </div>
        </div>
    );
};

    // Conditional Rendering (Section 31/32 - Example using 'bread')
    const RecipeInputs = () => (
        <section className="p-4 bg-teal-50 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Input Controls</h2>
            {/* Input for Flour Weight */}
            <div>
                <label htmlFor="flourWeight" className="block text-sm font-medium text-gray-700">Flour Weight (g):</label>
                <input
                    id="flourWeight"
                    type="number"
                    value={inputs.flourWeight}
                    onChange={(e) => setInput('flourWeight', parseFloat(e.target.value))}
                    className="mt-1 block w-full border p-2 rounded focus:ring-teal-500 focus:border-teal-500"
                />
            </div>
            {/* Placeholder for Recipe Mode selector */}
        </section>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-amber-900">Air Fryer Bakery Calculator</h1>

            {/* Input Area */}
            <div className="lg:col-span-1 p-6 bg-gray-50 rounded shadow-md mr-6">
                <RecipeInputs />
            </div>

            {/* Output Area (Results) */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-amber-900 border-b pb-2">Calculated Ingredients</h2>
                <div className="bg-white p-4 rounded shadow-md overflow-auto max-h-[70vh]">
                    {Object.entries(results.weights).map(([name, weight]) => (
                        <div key={name} className="flex justify-between py-2 border-b last:border-b-0">
                            <span className="font-medium text-gray-600">{name.charAt(0).toUpperCase() + name.slice(1)}:</span>
                            <span className={`text-lg font-bold ${weight.grams > 0 ? 'text-teal-700' : 'text-red-500'}`}>
                                {`${Math.round(weight.grams)} g`}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Display special rule warnings here */}
            </div>
        </div>
    );
};

export default CalculatorPage;