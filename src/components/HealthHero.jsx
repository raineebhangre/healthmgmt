import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  IconHeartbeat, 
  IconReportMedical, 
  IconNotebook, 
  IconRun, 
  IconNews,
  IconUsersGroup,
  IconCamera // Using IconCamera instead of IconCameraScan
} from '@tabler/icons-react';

function HealthHero() {
  const { login, authenticated } = usePrivy();

  // Don't show if already authenticated
  if (authenticated) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-[#0f0f15] dark:to-[#1a1a25]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-300/20 animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-300/15 animate-float2"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-16 p-8 rounded-2xl backdrop-blur-sm bg-white/80 dark:bg-[#13131a]/80 border border-gray-200/30 dark:border-gray-800/30 shadow-lg">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <IconHeartbeat size={60} className="text-[#1dc071] animate-pulse" />
              <h1 className="font-bold text-5xl md:text-6xl bg-gradient-to-r from-[#1dc071] to-[#8c6dfd] bg-clip-text text-transparent">
                Wellness 360°
              </h1>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Your comprehensive health companion for a balanced lifestyle and empowered wellness journey.
            </p>
            <button
              onClick={login}
              className="px-8 py-3 bg-gradient-to-r from-[#1dc071] to-[#8c6dfd] text-white rounded-xl hover:shadow-lg transition-all shadow-md hover:scale-105"
            >
              Get Started / Login
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <FeatureCard 
            icon={<IconUsersGroup size={40} className="text-purple-500" />}
            title="Community Hub"
            description="Connect with others, share experiences and find support"
            color="from-purple-500 to-pink-500"
          />
          
          <FeatureCard 
            icon={<IconReportMedical size={40} className="text-blue-500" />}
            title="Report Analysis"
            description="AI-powered insights for your medical reports"
            color="from-blue-500 to-teal-500"
          />
          
          <FeatureCard 
            icon={<IconNotebook size={40} className="text-green-500" />}
            title="Health Journal"
            description="Track symptoms, medications and daily notes"
            color="from-green-500 to-emerald-500"
          />
          
          <FeatureCard 
            icon={<IconRun size={40} className="text-orange-500" />}
            title="Exercise Plans"
            description="Personalized workouts for your condition"
            color="from-orange-500 to-amber-500"
          />
          
          <FeatureCard 
            icon={<IconNews size={40} className="text-red-500" />}
            title="Health News"
            description="Curated medical updates and research"
            color="from-red-500 to-pink-500"
          />
          
          <FeatureCard 
            icon={<IconCamera size={40} className="text-yellow-500" />}  /* Changed to IconCamera */
            title="Nutrition Scanner"
            description="Scan food items for dietary analysis"
            color="from-yellow-500 to-amber-500"
          />
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => (
  <div className={`p-6 rounded-xl bg-white dark:bg-[#1e1e2a] border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col items-center text-center`}>
    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default HealthHero;