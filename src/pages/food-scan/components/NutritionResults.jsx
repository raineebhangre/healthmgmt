import { motion } from 'framer-motion';
import AnimatedProgressBar from './AnimatedProgressBar';
import { GiCookingPot } from 'react-icons/gi';

const NutritionResults = ({ nutrition, healthierRecipe, isProcessing }) => {
  if (!nutrition) return null;

  const dailyValues = {
    calories: 2000,
    protein_g: 50,
    fat_g: 65,
    carbohydrates_g: 300,
    sodium_mg: 2400
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 dark:opacity-5" />
        
        <div className="flex items-center gap-3 mb-6">
          <GiCookingPot className="text-3xl text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {nutrition.foodName}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(nutrition).map(([key, value], index) => {
            if (key === 'foodName' || key === 'serving_size_g') return null;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-orange-50 dark:bg-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium capitalize text-orange-800 dark:text-orange-300">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-orange-600 dark:text-orange-300">
                    {nutrition.serving_size_g}g
                  </span>
                </div>
                <AnimatedProgressBar
                  percentage={(value / dailyValues[key] || 1) * 100}
                  value={value}
                  unit={key.endsWith('_mg') ? 'mg' : 'g'}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {healthierRecipe && (
        <motion.div
          className="bg-amber-50 dark:bg-gray-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-[url('/parchment.png')] opacity-20 dark:opacity-10" />
          
          <div className="flex items-center gap-3 mb-6">
            <GiCookingPot className="text-3xl text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Chef's Special: {healthierRecipe.recipeName}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-orange-800 dark:text-orange-200">
                🧂 Ingredients
              </h4>
              <ul className="space-y-2">
                {healthierRecipe.ingredients.map((ing, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="text-orange-500">▹</span>
                    {ing}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-orange-800 dark:text-orange-200">
                👩🍳 Instructions
              </h4>
              <ol className="space-y-3">
                {healthierRecipe.instructions.map((step, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-2 text-gray-700 dark:text-gray-300"
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="font-bold text-orange-600">{i + 1}.</span>
                    {step}
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>

          {healthierRecipe.nutritionalBenefits && (
            <motion.div
              className="mt-8 pt-6 border-t border-orange-100 dark:border-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h4 className="font-semibold text-lg text-orange-800 dark:text-orange-200 mb-4">
                ✅ Nutritional Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthierRecipe.nutritionalBenefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-orange-500">✔</span>
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NutritionResults;