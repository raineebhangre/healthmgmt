import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from 'framer-motion';

const Onboarding = () => {
  const { createUser, currentUser, fetchUserByEmail } = useStateContext();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const navigate = useNavigate();
  const { user } = usePrivy();

  useEffect(() => {
    const checkUserExists = async () => {
      if (user?.email?.address) {
        await fetchUserByEmail(user.email.address);
        setIsCheckingUser(false);
      }
    };

    checkUserExists();
  }, [user, fetchUserByEmail]);

  useEffect(() => {
    if (currentUser && !isCheckingUser) {
      navigate("/profile"); // Redirect if user already exists
    }
  }, [currentUser, isCheckingUser, navigate]);

  const handleOnboarding = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      age: parseInt(age, 10),
      location,
      folders: [],
      treatmentCounts: 0,
      folder: [],
      createdBy: user.email.address,
    };

    const newUser = await createUser(userData);
    if (newUser) {
      navigate("/profile");
    }
  };

  if (isCheckingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#13131a]">
        <div className="w-full max-w-md rounded-xl bg-[#1c1c24] p-8 text-center text-white">
          Checking your account...
        </div>
      </div>
    );
  }

  if (currentUser) {
    return null; // Or redirect immediately
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0D1117] to-[#1a1a2e]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md rounded-2xl bg-[#1c1c24]/90 backdrop-blur-lg p-8 shadow-xl border border-[#2c2f32] relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse-slow delay-1000" />
        </div>

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8 text-center"
          >
            <h2 className="text-5xl mb-4 animate-bounce">👋</h2>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
                          bg-clip-text text-transparent animate-gradient-x">
              Welcome to Wellness 360
            </h2>
            <p className="mt-2 text-gray-400">Let's create your health profile</p>
          </motion.div>

          <form onSubmit={handleOnboarding}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <label className="block text-sm text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#2c2f32] rounded-lg text-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <label className="block text-sm text-gray-300 mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#2c2f32] rounded-lg text-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <label className="block text-sm text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#2c2f32] rounded-lg text-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg 
                          font-semibold text-white hover:from-blue-600 hover:to-purple-700 
                          transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                Get Started
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;