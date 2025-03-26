import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PastRecordsGrid = ({ records, onDelete }) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (records.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <div className="inline-block bg-columnBackgroundColor p-6 rounded-2xl shadow-lg border border-gray-700">
          <div className="text-4xl mb-4 animate-pulse">📄</div>
          <p className="text-gray-400 font-poppins">
            No records available. Add a new record to see it here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="rounded-xl overflow-hidden border border-gray-700 shadow-lg"
    >
      <table className="w-full border-collapse bg-columnBackgroundColor">
        <thead>
          <tr className="bg-gray-800 text-neonGreen">
            <th className="p-4 font-epilogue">Height (cm)</th>
            <th className="p-4 font-epilogue">Weight (kg)</th>
            <th className="p-4 font-epilogue">Sex</th>
            <th className="p-4 font-epilogue">BMI</th>
            <th className="p-4 font-epilogue">Category</th>
            <th className="p-4 font-epilogue">Date</th>
            <th className="p-4 font-epilogue">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <motion.tr
              key={index}
              variants={rowVariants}
              className="border-t border-gray-700 group hover:bg-gray-800/30 transition-colors"
            >
              <td className="p-4 text-gray-300 font-poppins">{record.height}</td>
              <td className="p-4 text-gray-300 font-poppins">{record.weight}</td>
              <td className="p-4 text-gray-300 font-poppins">{record.sex}</td>
              <td className="p-4 text-neonGreen font-semibold">{record.bmi}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-poppins ${getCategoryStyle(record.category)}`}>
                  {record.category}
                </span>
              </td>
              <td className="p-4 text-gray-400 font-poppins">
                {new Date(record.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaTrash className="inline-block" />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

// Helper function for category styles
const getCategoryStyle = (category) => {
    const styles = {
      "Severe Thinness": "bg-red-900/20 text-red-300",
      "Moderate Thinness": "bg-red-700/20 text-red-300",
      "Mild Thinness": "bg-yellow-500/20 text-yellow-300",
      "Normal": "bg-green-500/20 text-green-300",
      "Overweight": "bg-yellow-400/20 text-yellow-300",
      "Obese Class I": "bg-yellow-600/20 text-yellow-300",
      "Obese Class II": "bg-red-600/20 text-red-300",
      "Obese Class III": "bg-red-900/20 text-red-300"
    };
    return styles[category] || 'bg-gray-500/20 text-gray-400';
  };
export default PastRecordsGrid;