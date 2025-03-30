import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  IconHeartbeat, 
  IconReportMedical, 
  IconNotebook, 
  IconRun, 
  IconNews,
  IconUsersGroup,
  IconCamera,
  IconX
} from '@tabler/icons-react';

function HealthHero() {
  const { login, authenticated } = usePrivy();
  const [activeFeature, setActiveFeature] = useState(null);

  if (authenticated) return null;

  // Feature details data
  const featureDetails = {
    community: {
      title: "Community Hub",
      description: "Connect with others on similar health journeys",
      longDescription: "Our community hub allows you to connect with others facing similar health challenges. Join support groups, participate in discussions, and share your experiences in a safe, moderated environment. Features include private messaging and topic-based forums.",
      icon: <IconUsersGroup size={40} />,
      color: "purple"
    },
    analysis: {
      title: "Report Analysis",
      description: "AI-powered insights for your medical reports",
      longDescription: "Upload your medical reports and receive instant AI-powered analysis. Our system identifies key health indicators, explains medical terminology in simple language, and highlights areas that may need attention. Track changes over time and get personalized recommendations based on your results.",
      icon: <IconReportMedical size={40} />,
      color: "blue"
    },
    journal: {
      title: "Health Journal",
      description: "Track symptoms, medications and daily notes",
      longDescription: "Maintain a comprehensive health journal to track symptoms, medications, appointments, and daily notes. Set reminders for medications, log side effects, and generate printable reports for your healthcare providers. Visualize trends in your health data over time.",
      icon: <IconNotebook size={40} />,
      color: "green"
    },
    exercise: {
      title: "Exercise Plans",
      description: "Personalized workouts for your condition",
      longDescription: "Get customized exercise plans tailored to your specific health conditions and fitness level. Our plans include video demonstrations, adaptive difficulty levels, and progress tracking. Specialized routines available for rehabilitation, chronic conditions, and general wellness.",
      icon: <IconRun size={40} />,
      color: "orange"
    },
    news: {
      title: "Health News",
      description: "Curated medical updates and research",
      longDescription: "Stay informed with our carefully curated health news feed. We filter through the latest medical research, breaking health news, and wellness trends to bring you reliable, evidence-based information. Customize your feed based on your health interests and conditions.",
      icon: <IconNews size={40} />,
      color: "red"
    },
    nutrition: {
      title: "Nutrition Scanner",
      description: "Scan food items for dietary analysis",
      longDescription: "Use your camera to scan food packaging and instantly get detailed nutritional analysis. Our system identifies potential allergens, tracks macronutrients, and suggests healthier alternatives based on your dietary needs and health goals. Works with both packaged and whole foods.",
      icon: <IconCamera size={40} />,
      color: "yellow"
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-[#0f0f15] dark:to-[#1a1a25]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-300/20 animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-300/15 animate-float2"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full text-center">
        {/* Hero Section with Wellness 360° Logo */}
        <div className="mb-16 p-8 rounded-2xl backdrop-blur-sm bg-white/80 dark:bg-[#13131a]/80 border border-gray-200/30 dark:border-gray-800/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              className="px-8 py-3 bg-gradient-to-r from-[#1dc071] to-[#8c6dfd] text-white rounded-xl hover:shadow-lg transition-all shadow-md hover:scale-105 transform-gpu"
            >
              Get Started / Login
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {Object.entries(featureDetails).map(([key, feature], index) => (
            <FlashCard 
              key={key}
              feature={feature}
              onClick={() => setActiveFeature(key)}
              delay={`${index * 0.1}s`}
            />
          ))}
        </div>
      </div>

      {/* Feature Detail Modal */}
      {activeFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative max-w-2xl w-full rounded-2xl overflow-hidden bg-white dark:bg-[#1e1e2a] shadow-2xl border border-gray-200/50 dark:border-gray-700/50`}>
            <button 
              onClick={() => setActiveFeature(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <IconX size={24} />
            </button>
            
            <div className={`h-2 bg-gradient-to-r ${colorClasses[featureDetails[activeFeature].color]}`}></div>
            
            <div className="p-8">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${colorClasses[featureDetails[activeFeature].color]} flex items-center justify-center text-white mb-6`}>
                {featureDetails[activeFeature].icon}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {featureDetails[activeFeature].title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {featureDetails[activeFeature].longDescription}
              </p>
              
              <button
                onClick={login}
                className={`px-6 py-2 bg-gradient-to-r ${colorClasses[featureDetails[activeFeature].color]} text-white rounded-lg hover:shadow-lg transition-all`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Color classes mapping
const colorClasses = {
  purple: 'from-purple-500 to-pink-500',
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-orange-500 to-amber-500',
  red: 'from-red-500 to-pink-500',
  yellow: 'from-yellow-500 to-amber-500'
};

// FlashCard Component
const FlashCard = ({ feature, onClick, delay }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl p-6 bg-white dark:bg-[#1e1e2a] border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:z-10 group`}
      style={{ 
        animation: `fadeInUp 0.5s ease-out ${delay} both`,
        transformStyle: 'preserve-3d'
      }}
    >
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r ${colorClasses[feature.color]} transition-opacity duration-300 -z-10`}></div>
      
      <div className="relative z-10 w-full h-full flex flex-col items-center">
        <div 
          className={`w-20 h-20 rounded-full bg-gradient-to-r ${colorClasses[feature.color]} flex items-center justify-center text-white mb-6 group-hover:rotate-[15deg] transition-transform duration-300`}
        >
          {feature.icon}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 relative pb-2">
          {feature.title}
          <span className={`absolute bottom-0 left-1/2 h-1 w-8 bg-gradient-to-r ${colorClasses[feature.color]} transform -translate-x-1/2 group-hover:w-16 transition-all duration-300`}></span>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 transition-opacity duration-300 group-hover:opacity-90">
          {feature.description}
        </p>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r ${colorClasses[feature.color]} text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-md`}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

// Global styles
const globalStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-float1 {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float2 {
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
`;

// Inject global styles
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

export default HealthHero;