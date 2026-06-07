// src/components/CalculatorPage.tsx
import React from 'react';
import { useBakingCalculator } from '../hooks/useBakingCalculator';

/**
 * Main page component responsible for orchestrating the UI based on calculated state.
 * This component consumes the custom hook and renders the dynamic interface elements.
 */
const CalculatorPage: React.FC = () => {
    // 24. State Hook consumption
    const { inputs, results, validationWarnings, setInput } = useBakingCalculator();

    if (!results.success) {
        return <div className="text-red-600 p-4">Error: {results.message}</div>;
    }

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
        <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr]_2/3 gap-8">
            {/* Input Area */}
            <div className="lg:col-span-1 p-6 bg-gray-50 rounded shadow-md">
                <RecipeInputs />
            </div>

            {/* Output Area (Results) */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-amber-900 border-b pb-2">Calculated Ingredients</h2>
                <div className="bg-white p-4 rounded shadow-md overflow-auto max-h-[70vh]">
                    {Object.entries(results.weights).map(([name, weight]) => (
                        <div key={name} className="flex justify-between items-center py-2 border-b last:border-b-0 group">
                            <span className="font-medium text-gray-600 flex-grow">{name.charAt(0).toUpperCase() + name.slice(1)}:</span>
                            <div className="flex items-end space-x-4 min-w-[200px] justify-end">
                                {/* Warning Badge */}
                                {validationWarnings[name] && (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${validationWarnings[name].type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} shadow`}>
                                        {validationWarnings[name].message}
                                    </span>
                                )}
                                {/* Weight Display: Grams (Primary) */}
                                <div className="text-right">
                                    <span className={`text-xl font-bold ${weight.grams > 0 ? 'text-teal-700' : 'text-gray-500'}'}>
                                        {`${Math.round(weight.grams)} g`}
                                    </span>
                                </div>
                                {/* Unit Conversions */}
                                <div className="flex flex-col items-end text-sm space-y-1">
                                    <span className="text-gray-500">{/* Placeholder for US Cup/Tablespoon equivalent logic */}</span>
                                    <span className={`${weight.cups ? 'text-teal-600' : 'text-gray-400'} ${weight.tablespoons > 0 && !validationWarnings[name] ? 'font-medium' : ''}`}>
                                        ${weight.cups ? `${Math.round(weight.cups * 2)} cup`} : ''
                                    </span>
                                    <span className={`${weight.tablespoons ? 'text-teal-600' : 'text-gray-400'} ${weight.tablespoons > 0 && !validationWarnings[name] ? 'font-medium' : ''}`}>
                                        {weight.tablespoons ? `${Math.round(weight.tablespoons)} tbsp` : ''}
                                    </span>
                                </div>
                            </div>
                        </div >
                    ))}
                </div>

                {/* Display special rule warnings here */}
            </div>
        </divs>
    );
};

export default CalculatorPage;