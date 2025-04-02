import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const AnimatedProgressBar = ({ 
  percentage = 0,
  value,
  unit,
  duration = 0.8
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.min(Math.max(percentage, 0), 100));
  }, [percentage]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-orange-700 dark:text-orange-300">
          {value} {unit}
        </span>
        <span className="text-orange-600 dark:text-orange-400">
          {Math.round(percentage)}% of Daily Value Goal
        </span>
      </div>
      <div className="h-2.5 bg-orange-100 dark:bg-gray-600 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
            animate={{
              x: ['-100%', '150%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

AnimatedProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  duration: PropTypes.number
};

export default AnimatedProgressBar;