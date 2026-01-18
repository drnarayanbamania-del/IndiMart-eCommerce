import React, { useState, useEffect } from 'react';
import { X, Clock, Zap } from 'lucide-react';

const SaleBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 59, seconds: 59 });

  // Simple countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; // Stop at 0
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden z-[60]">
      {/* Animated Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute transform -rotate-45 -top-10 -left-10 w-20 h-full bg-white blur-xl animate-[shimmer_3s_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm relative z-10">
        
        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
          <div className="bg-yellow-400 text-indigo-900 p-1 rounded-full animate-pulse">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          </div>
          <span className="font-black uppercase tracking-wider text-yellow-300">Midnight Sale</span>
          <span className="hidden sm:inline text-purple-200">|</span>
          <span className="font-medium text-white">Flat 50% OFF on Electronics & Fashion</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-black/30 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-400" />
            <span className="font-mono font-bold text-red-100">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="ml-2 text-[10px] text-gray-400 uppercase">Left</span>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close banner"
          >
            <X className="w-4 h-4 text-white/70 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleBanner;