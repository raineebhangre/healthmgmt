import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";

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
    <div className="flex min-h-screen items-center justify-center bg-[#13131a]">
      <div className="w-full max-w-md rounded-xl bg-[#1c1c24] p-8 shadow-lg">
        <h2 className="mb-2 text-center text-5xl font-bold text-white">👋 </h2>
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Welcome! Let's get started
        </h2>
        <form onSubmit={handleOnboarding}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="mb-2 block text-sm text-gray-300">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="mb-2 block text-sm text-gray-300"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            🩺 Smart Health Starts Here !
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;