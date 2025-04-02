import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FiUpload, FiImage, FiXCircle, FiClock } from 'react-icons/fi';
import { GiChefToque, GiCookingPot } from 'react-icons/gi';
import NutritionResults from './components/NutritionResults';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const FoodScanPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [healthierRecipe, setHealthierRecipe] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const analysisPrompt = {
    systemInstruction: "You are a professional nutritionist AI that analyzes food items and provides detailed nutritional information along with healthier recipe alternatives.",
    imageAnalysis: `Analyze this food image and return JSON with:
    {
      "nutrition": {
        "foodName": "string",
        "calories": number,
        "protein_g": number,
        "fat_g": number,
        "carbohydrates_g": number,
        "sugar_g": number,
        "fiber_g": number,
        "sodium_mg": number,
        "cholesterol_mg": number,
        "serving_size_g": number
      },
      "healthierAlternative": {
        "recipeName": "string",
        "ingredients": [],
        "instructions": [],
        "nutritionalBenefits": []
      }
    }`
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setError('Supported formats: JPEG, PNG, WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be <5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setNutritionData(null);
    setHealthierRecipe(null);
    setError(null);
  };

  const analyzeInput = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-pro" },
        { systemInstruction: analysisPrompt.systemInstruction }
      );

      const contents = [
        { text: analysisPrompt.imageAnalysis },
        { 
          inlineData: {
            data: await convertToBase64(selectedFile),
            mimeType: selectedFile.type
          }
        }
      ];

      const result = await model.generateContent({
        contents: [{ parts: contents }]
      });

      const text = result.response.text();
      const data = parseResponse(text);

      if (!validateResponse(data)) {
        throw new Error('Invalid API response structure');
      }

      setNutritionData(data.nutrition);
      setHealthierRecipe(data.healthierAlternative);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper functions
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseResponse = (text) => {
    try {
      const jsonString = text.replace(/(json|)/g, '').trim();
      return JSON.parse(jsonString);
    } catch (err) {
      throw new Error('Failed to parse API response');
    }
  };

  const validateResponse = (data) => {
    return data?.nutrition && data?.healthierAlternative;
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <motion.h1 
        className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GiChefToque className="inline-block mr-3 mb-1" />
        Culinary Nutrition Expert
      </motion.h1>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <GiCookingPot className="text-4xl text-orange-500 animate-bounce" />
        </div>
        
        <div className="border-2 border-dashed border-orange-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer block text-center">
            {previewUrl ? (
              <motion.img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded-lg mb-4 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            ) : (
              <motion.div
                className="py-16 text-gray-500 dark:text-gray-400"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <FiUpload className="w-12 h-12 mx-auto mb-4" />
                Click to upload food image
              </motion.div>
            )}
          </label>
          
          {selectedFile && (
            <motion.div
              className="flex items-center justify-between mt-4 p-3 bg-orange-50 dark:bg-gray-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-sm">{selectedFile.name}</span>
              <button 
                onClick={clearSelection} 
                className="text-orange-600 hover:text-orange-700"
              >
                <FiXCircle />
              </button>
            </motion.div>
          )}
        </div>

        <motion.button
          onClick={analyzeInput}
          disabled={!selectedFile || isProcessing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {isProcessing ? (
            <>
              <FiClock className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <GiCookingPot />
              Analyze Image and Generate Healthy Recipe
            </>
          )}
        </motion.button>
      </motion.div>

      {error && (
        <motion.div
          className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiXCircle />
          {error}
        </motion.div>
      )}

      <NutritionResults 
        nutrition={nutritionData}
        healthierRecipe={healthierRecipe}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default FoodScanPage;