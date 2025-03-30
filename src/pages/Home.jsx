import React from "react";
import HealthHero from '../components/HealthHero';
import DisplayInfo from '../components/DisplayInfo';
import { usePrivy } from "@privy-io/react-auth";

const Home = () => {
  const { authenticated } = usePrivy();
  
  return (
    <div className="min-h-screen">
      {!authenticated ? (
        <HealthHero />
      ) : (
        <DisplayInfo />
      )}
    </div>
  );
};

export default Home;