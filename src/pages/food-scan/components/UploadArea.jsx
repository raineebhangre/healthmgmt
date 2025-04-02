import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { GiChefToque } from 'react-icons/gi';

const UploadArea = ({ onAnalyze, isProcessing }) => {
  const [foodText, setFoodText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodText.trim()) {
      setError('Please enter food description');
      return;
    }
    setError(null);
    onAnalyze(foodText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md"
          >
            <textarea
              value={foodText}
              onChange={(e) => setFoodText(e.target.value)}
              placeholder="Describe your meal (e.g., '200g grilled salmon with roasted vegetables')"
              className="w-full p-4 rounded-xl border-none bg-transparent focus:ring-2 focus:ring-orange-500"
              rows="3"
              disabled={isProcessing}
            />
          </motion.div>
          
          <motion.button
            type="submit"
            disabled={isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-4 right-4 bg-orange-600 text-white p-3 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <FiSearch className="animate-pulse" />
            ) : (
              <>
                <GiChefToque />
                <span>Analyze</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {error && (
        <motion.div
          className="text-red-500 text-sm flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiSearch />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadArea;