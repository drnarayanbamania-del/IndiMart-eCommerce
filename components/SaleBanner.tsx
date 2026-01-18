import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, Sparkles, Flame, Flag } from 'lucide-react';

type Theme = 'MIDNIGHT' | 'DIWALI' | 'HOLI' | 'INDEPENDENCE' | 'REPUBLIC' | 'DEFAULT';

const SaleBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 59, seconds: 59 });
  const [theme, setTheme] = useState<Theme>('DEFAULT');

  // Detect Occasion Logic
  useEffect(() => {
    const date = new Date();
    const month = date.getMonth(); // 0-11
    const day = date.getDate();
    const hour = date.getHours();

    // 1. Check for Specific Indian Dates
    if (month === 0 && day >= 20 && day <= 26) {
        setTheme('REPUBLIC'); // Jan 26
    } else if (month === 7 && day >= 10 && day <= 15) {
        setTheme('INDEPENDENCE'); // Aug 15
    } else if ((month === 9 && day > 20) || (month === 10 && day < 15)) {
        setTheme('DIWALI'); // Broad check for Oct/Nov
    } else if (month === 2 && day < 20) {
        setTheme('HOLI'); // Broad check for March
    } 
    // 2. Check Time for Midnight Sale (10 PM to 4 AM)
    else if (hour >= 22 || hour < 4) {
        setTheme('MIDNIGHT');
    } else {
        setTheme('DEFAULT');
    }
  }, []);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  // Theme Configs
  const styles = {
    MIDNIGHT: {
        bg: "bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900",
        icon: <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />,
        badgeBg: "bg-yellow-400 text-indigo-900",
        title: "Midnight Loot",
        sub: "Flat 50% OFF Ends Soon",
        accent: "text-yellow-300"
    },
    DIWALI: {
        bg: "bg-gradient-to-r from-red-900 via-orange-700 to-red-900",
        icon: <Flame className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />,
        badgeBg: "bg-yellow-500 text-red-900",
        title: "Diwali Dhamaka",
        sub: "Light up your home with 60% OFF",
        accent: "text-yellow-200"
    },
    HOLI: {
        bg: "bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600",
        icon: <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />,
        badgeBg: "bg-white text-purple-600",
        title: "Holi Splash Sale",
        sub: "Colors of savings! Extra 20% OFF",
        accent: "text-white"
    },
    INDEPENDENCE: {
        bg: "bg-gradient-to-r from-orange-600 via-white via-green-700 to-orange-600", // Tricolor-ish
        textOverwrite: "text-slate-900", // Dark text for visibility on white center
        icon: <Flag className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />,
        badgeBg: "bg-blue-600 text-white",
        title: "Freedom Sale",
        sub: "Celebrate Independence with Big Deals",
        accent: "text-blue-800 font-bold"
    },
    REPUBLIC: {
         bg: "bg-gradient-to-r from-orange-500 via-blue-900 to-green-600",
         icon: <Flag className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />,
         badgeBg: "bg-white text-blue-900",
         title: "Republic Day Sale",
         sub: "Grand Indian Sale - Jai Hind!",
         accent: "text-white"
    },
    DEFAULT: {
        bg: "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",
        icon: <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />,
        badgeBg: "bg-red-500 text-white",
        title: "Mega Saving Days",
        sub: "Best Prices on Electronics & Fashion",
        accent: "text-white"
    }
  };

  const currentStyle = styles[theme];
  // Determine text color based on theme (Independence day has diverse background)
  const textColor = theme === 'INDEPENDENCE' ? 'text-slate-800' : 'text-white';
  const subTextColor = theme === 'INDEPENDENCE' ? 'text-slate-700' : 'text-gray-300';
  const closeColor = theme === 'INDEPENDENCE' ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white';

  return (
    <div className={`${currentStyle.bg} ${textColor} relative overflow-hidden z-[60] shadow-md transition-colors duration-1000`}>
      {/* Animated Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute transform -rotate-45 -top-10 -left-10 w-20 h-full bg-white blur-xl animate-[shimmer_3s_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm relative z-10">
        
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          <div className={`${currentStyle.badgeBg} p-1 rounded-full animate-pulse shadow-sm`}>
            {currentStyle.icon}
          </div>
          <span className={`font-black uppercase tracking-wider ${currentStyle.accent} drop-shadow-sm`}>{currentStyle.title}</span>
          <span className={`hidden sm:inline opacity-60`}>|</span>
          <span className={`font-medium ${subTextColor}`}>{currentStyle.sub}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center px-3 py-1 rounded-lg backdrop-blur-md border ${theme === 'INDEPENDENCE' ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10'}`}>
            <Clock className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${theme === 'INDEPENDENCE' ? 'text-blue-700' : 'text-red-300'}`} />
            <span className={`font-mono font-bold ${theme === 'INDEPENDENCE' ? 'text-blue-900' : 'text-red-100'}`}>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className={`ml-2 text-[10px] uppercase ${theme === 'INDEPENDENCE' ? 'text-slate-600' : 'text-white/60'}`}>Left</span>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className={`p-1 rounded-full transition-colors ${closeColor}`}
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleBanner;