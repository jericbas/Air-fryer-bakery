Here is a comprehensive suite of 55 End-to-End (E2E) UI test cases designed for an automated testing framework (like Playwright or Cypress) or for manual QA validation.
These cases cover component mounting, state reactivity, boundary limits, and dynamic DOM updates across all modules of the application.
### Suite 1: Global Rendering & Navigation Navigation (Cases 1-6)
 1. **Initial Mount State:** Verify the app loads without crashing, defaults to the "Fruit Cake" mode, and sets the base flour input to 250g.
 2. **Mode Switcher - Bread:** Click the "Bread Dough" button. Verify the UI transitions to display Bread parameters (Flour Type, Liquid Base, Technique) and updates the active button style.
 3. **Mode Switcher - Cookies:** Click the "Cookies" button. Verify the parameter panel swaps exclusively to "Cookie Style" and the ingredients list updates.
 4. **Mode Switcher - Brownies/Bars:** Click the "Brownies & Bars" button. Verify the header icon changes to the Layout square icon and the instructions update to brownie-specific baking steps.
 5. **Mode Switcher - Empanada:** Click the "Empanada Dough" button. Verify the ingredients table renders the "Cold Elements" section.
 6. **Responsive Layout Check:** Resize the viewport to mobile width (<768px). Verify the 3-column CSS grid collapses into a single-column vertical stack to prevent horizontal scrolling.
### Suite 2: Base Flour Scaling Engine (Cases 7-11)
 7. **Scale Up Calculation:** Input 500 into the Base Flour input. Verify the Bread mode outputs 500g of Flour, 10g of Salt (2%), and 7.5g of Yeast (1.5%).
 8. **Scale Down Calculation:** Input 100 into the Base Flour input. Verify the Cookie mode outputs 60g of Softened Butter (60%) and 80g of Sugar (80%).
 9. **Zero Value Handling:** Input 0 into the Base Flour input. Verify the app does not crash and all ingredient outputs calculate to 0g.
 10. **Empty String Handling:** Delete all text in the Base Flour input. Verify the math engine falls back safely to 0 instead of rendering NaN in the DOM.
 11. **Negative Number Handling:** Input -50 into the Base Flour input. Verify the Math.max(0, val) logic forces the underlying state to treat it as 0, outputting 0g for all ingredients.
### Suite 3: Diabetic-Friendly Global State (Cases 12-16)
 12. **Toggle Activation:** Click the Diabetic-Friendly toggle. Verify the pill toggle slides right and changes to the teal active state.
 13. **Sugar Label Replacement:** With Diabetic mode ON, check the Bread mode ingredients. Verify the text "Sugar" is replaced by "Baking Sweetener".
 14. **Fruit Cake Sugar-Free Swap:** With Diabetic mode ON, check the Fruit Cake ingredients. Verify "Mixed Dried Fruits" changes to "Nuts & Sugar-Free Seeds".
 15. **Condensada Interception:** In Bread mode, select "Condensada" while Diabetic mode is ON. Verify the red warning box appears stating "Condensada is mostly sugar! Swapped to Unsweetened Milk."
 16. **Diabetic Condensada Math Override:** Verify that triggering the state in Case 15 forces the liquid name in the ingredients list to "Unsweetened Milk (Diabetic-Safe)" and reverts the sugar calculation back to 8% sweetener.
### Suite 4: Bread Dough Module (Cases 17-23)
 17. **Flour Hydration - All Purpose:** Set Flour Type to AP. Verify liquid calculates at 60% of flour weight.
 18. **Flour Hydration - Whole Wheat:** Set Flour Type to Whole Wheat. Verify liquid automatically increases to 73% of flour weight.
 19. **Standard Condensada Logic:** Turn Diabetic mode OFF and select Condensada. Verify normal sugar drops to 0g, Condensada weight appears, and liquid water volume drops by 30% of the condensada weight.
 20. **Technique - Add Egg:** Select "Add Egg". Verify the liquid output drops by 50mL per egg calculated to accommodate the egg's moisture.
 21. **Technique - Tangzhong:** Select "Tangzhong". Verify the Tangzhong sub-panel appears showing exactly 5% of the total flour and a 1:5 liquid ratio.
 22. **Tangzhong Subtraction:** Verify the Main Dough flour amount is dynamically reduced by the exact amount sent to the Tangzhong paste.
 23. **Earthquake Cheese Instruction:** Select "Mozzarella Cheese" as the Add-in. Verify the purple highlighted text appears in Step 1 of the instructions regarding folding in cheese cubes.
### Suite 5: Fruit Cake Core Module (Cases 24-30)
 24. **Traditional Style Math:** Select "Traditional (Dense)". Verify Butter and Sugar weights are exactly 100% of the Flour weight.
 25. **Light Style Math:** Select "Light & Fluffy". Verify Butter and Sugar drop to 60%, and the "Milk (Batter Liquid)" row appears in the DOM.
 26. **Jam Addition Deduction:** Select "Orange Marmalade" from the Add Jam dropdown. Verify the jam row appears in the ingredients at 20% of flour weight, and the base brown sugar is reduced by half the jam weight.
 27. **Soak Liquid Selection:** Select "Dark Rum". Verify the soak liquid label changes and the icon color switches to amber/brown (text-amber-800).
 28. **Diabetic Juice Swap:** Turn Diabetic mode ON and select "Juice". Verify the label changes from "Pineapple / Orange Juice" to "Unsweetened Pineapple/Orange".
 29. **Instruction Injection - Light Mode:** In "Light & Fluffy" mode, verify Step 3 instructions include the phrase "(alternating with the milk to keep the batter smooth)".
 30. **Instruction Injection - Jam:** Select a Jam. Verify Step 2 instructions include the phrase "along with the [Jam Name]".
### Suite 6: Custom Fruit/Liquid Warning Engine (Cases 31-36)
 31. **Enable Custom Mode:** Check the "Custom Fruit & Liquid Amounts" box. Verify the custom input grid expands smoothly into the DOM.
 32. **High Liquid Danger Trigger:** Input 100g fruits and 250mL liquid. Verify the red "Too much liquid!" warning box renders on the left panel.
 33. **High Liquid Instruction Warning:** With the danger state active, verify Step 3 in the instructions changes to the bold, red "CRITICAL STEP: DRAIN the... raisins!" warning.
 34. **Low Liquid Warning Trigger:** Input 100g fruits and 10mL liquid. Verify the amber "Too little liquid!" warning box renders on the left panel.
 35. **Low Liquid Instruction Warning:** With the low liquid state active, verify Step 3 updates to the amber "WARNING: Low soaking liquid may result in a dry..." text.
 36. **Auto-Fix Execution:** Click the "Auto-fix to 27mL" button inside either warning box. Verify the Custom Liquid input updates instantly to 27, and all warning boxes disappear from the DOM.
### Suite 7: Cookies & Crinkles Module (Cases 37-41)
 37. **Classic Cookie Math:** Verify standard cookie mode calculates Butter at 60% and Sugar at 80% of base flour.
 38. **Choc Chip Add-in:** Verify "Classic Chocolate Chip" style renders the Chocolate Chips row at 30% of flour weight.
 39. **Ube Crinkle State Change:** Select "Ube Crinkles". Verify Chocolate Chips disappear and are replaced by "Ube Extract" and "Powdered Sugar (Rolling)".
 40. **Ube Instruction Update:** Verify selecting Ube Crinkles updates Step 1 instructions to mention rolling balls in powdered sugar.
 41. **Mandatory Chilling Step:** Verify Step 2 of the cookie instructions explicitly requires chilling the dough for 30 minutes.
### Suite 8: Brownies & Bars Module (Cases 42-46)
 42. **Heavy Batter Base Math:** Verify brownie mode calculates a heavy fat/sugar ratio (Butter 120%, Sugar 150% of flour weight).
 43. **Brownie Cocoa Load:** Select "Fudgy Chocolate Brownies". Verify the rendering of Cocoa Powder (40%) and Melted Chocolate (30%).
 44. **Food for the Gods Integration:** Select "Food for the Gods". Verify Cocoa/Chocolate rows unmount and are replaced by Chopped Dates (80%) and Chopped Walnuts (70%).
 45. **Instruction Update - FFTG:** Verify Food for the Gods mode updates Step 1 with a purple highlight about the massive amount of dates and thick batter.
 46. **Foil Sling Instruction:** Verify Step 2 correctly instructs the user to prep the pan with a foil sling for easy removal from an air fryer basket.
### Suite 9: Empanada Pastry Module (Cases 47-50)
 47. **Shortcrust Ratio Verification:** Verify the math correctly sets Cold Fat to 50% and Ice Water to 25% of the flour weight.
 48. **Cold Element Emphasizing:** Verify the fat and water rows render with a distinct blue background (bg-blue-50) to emphasize temperature importance.
 49. **Fat Label Reactivity:** Change Fat Type from "Cold Butter" to "Shortening". Verify the ingredient label directly updates to say "COLD SHORTENING 🧈".
 50. **Pastry Instructions:** Verify the instructions detail cutting the cold fat with a pastry cutter and resting the dough in the fridge.
### Suite 10: Formatting & Edge Case Validation (Cases 51-55)
 51. **Small Decimal Rendering:** Input 10 into the Base Flour. Verify that ingredients calculating to very small numbers (e.g., 0.15g yeast) are rounded intelligently or formatted cleanly by Math.round.
 52. **Conversion Tooltips - Spoons:** Verify that an output of 14g of butter or oil properly renders the conversion badge as ~1.0 tbsp 🥄.
 53. **Conversion Tooltips - Cups:** Input 250 into Base Flour. Verify the flour row renders the cup conversion badge as ~2.0 cups 🥛.
 54. **CSS Grid Class Assertion:** Using a test runner, assert that the main wrapper <div> contains grid-cols-1 and lg:grid-cols-3 to confirm responsive layout logic is intact.
 55. **Rapid Mode Switching Validation:** Programmatically click through all 5 mode buttons repeatedly at 50ms intervals. Verify the application does not experience memory leaks or race conditions, and settles on the correct final state DOM structure.
