import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { ArrowRight, Star, Sparkles, ChevronLeft, ChevronRight, ExternalLink, Flame, Moon, Flag, Sun, ShoppingCart } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import NativeAdBanner from '../components/NativeAdBanner';

interface HomeProps {
  onNavigate: (page: string) => void;
  onViewProduct: (id: string) => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1950&auto=format&fit=crop",
    subtitle: "Bharat E Mart",
    title: "Apple Watch",
    highlight: "Series 8",
    description: "Starting from ₹40,605*. The ultimate device for a healthy life.",
    cta: "Shop Now",
    category: "Electronics",
    accentColor: "text-red-500",
    buttonClass: "bg-red-600 hover:bg-red-700 shadow-red-500/30"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1950&auto=format&fit=crop",
    subtitle: "Bharat E Mart",
    title: "Apple Accessories",
    highlight: "Starting from ₹1,599",
    description: "Genuine adapters, cables, and cases. Power up your Apple ecosystem.",
    cta: "View Accessories",
    category: "Accessories",
    accentColor: "text-blue-400",
    buttonClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    subtitle: "Curated Aesthetics",
    title: "Modern Furniture",
    highlight: "Comfort & Style",
    description: "Transform your space with our exclusive furniture and home decor collection.",
    cta: "View Furniture",
    category: "Furniture",
    accentColor: "text-emerald-400",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30"
  }
];

// Occasion Badge Component
const OccasionBadge = () => {
    const [occasion, setOccasion] = useState('DEFAULT');

    useEffect(() => {
        const date = new Date();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();

        if (month === 0 && day >= 20 && day <= 26) setOccasion('REPUBLIC');
        else if (month === 7 && day >= 10 && day <= 15) setOccasion('INDEPENDENCE');
        else if ((month === 9 && day > 20) || (month === 10 && day < 15)) setOccasion('DIWALI');
        else if (month === 2 && day < 20) setOccasion('HOLI');
        else if (hour >= 22 || hour < 4) setOccasion('MIDNIGHT');
        else setOccasion('DEFAULT');
    }, []);

    const badges: any = {
        DEFAULT: (
            <div className="relative group/sticker cursor-pointer">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                <div className="relative w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex flex-col items-center justify-center text-white border-4 border-white shadow-2xl transform rotate-12 transition-transform hover:rotate-0 hover:scale-110">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-yellow-200">Festival</span>
                    <span className="text-2xl md:text-3xl font-black font-heading leading-none">SALE</span>
                    <span className="text-xs md:text-sm font-bold bg-white text-red-600 px-1 rounded mt-1">50% OFF</span>
                </div>
            </div>
        ),
        MIDNIGHT: (
            <div className="relative group/sticker cursor-pointer">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                <div className="relative w-28 h-28 md:w-36 md:h-36 bg-gradient-to-b from-indigo-900 to-black rounded-full flex flex-col items-center justify-center text-white border-4 border-indigo-200 shadow-2xl transform rotate-12 transition-transform hover:rotate-0 hover:scale-110 overflow-hidden">
                    <Moon className="w-5 h-5 text-yellow-300 absolute top-4 right-6 opacity-50" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-indigo-200">Midnight</span>
                    <span className="text-2xl md:text-3xl font-black font-heading leading-none text-yellow-400">LOOT</span>
                    <span className="text-xs md:text-sm font-bold text-white mt-1">Ends 4AM</span>
                </div>
            </div>
        ),
        DIWALI: (
            <div className="relative group/sticker cursor-pointer">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                <div className="relative w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-red-800 to-orange-600 rounded-full flex flex-col items-center justify-center text-white border-4 border-yellow-400 shadow-2xl transform rotate-12 transition-transform hover:rotate-0 hover:scale-110">
                    <Flame className="w-6 h-6 text-yellow-300 mb-0.5 animate-bounce" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-yellow-100">Diwali</span>
                    <span className="text-2xl md:text-3xl font-black font-heading leading-none text-yellow-300">SALE</span>
                </div>
            </div>
        ),
        INDEPENDENCE: (
            <div className="relative group/sticker cursor-pointer">
                 <div className="absolute inset-0 bg-white rounded-full blur-md opacity-75 animate-pulse"></div>
                 <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white rounded-full flex flex-col items-center justify-center text-slate-800 border-4 border-blue-800 shadow-2xl transform rotate-12 transition-transform hover:rotate-0 hover:scale-110 overflow-hidden">
                    {/* Tricolor BG */}
                    <div className="absolute top-0 w-full h-1/3 bg-[#FF9933]"></div>
                    <div className="absolute bottom-0 w-full h-1/3 bg-[#138808]"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                         <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-blue-900 bg-white/80 px-1 rounded">Freedom</span>
                         <span className="text-xl md:text-2xl font-black font-heading leading-none text-slate-900 bg-white/80 px-1 rounded my-0.5">SALE</span>
                         <span className="text-xs md:text-sm font-bold text-slate-900 bg-white/80 px-1 rounded">Jai Hind</span>
                    </div>
                </div>
            </div>
        ),
        REPUBLIC: (
            <div className="relative group/sticker cursor-pointer">
                 <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                 <div className="relative w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex flex-col items-center justify-center text-white border-4 border-orange-400 shadow-2xl transform rotate-12 transition-transform hover:rotate-0 hover:scale-110">
                    <Flag className="w-5 h-5 text-orange-400 mb-1" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white">Republic</span>
                    <span className="text-2xl md:text-3xl font-black font-heading leading-none text-orange-400">DEALS</span>
                </div>
            </div>
        ),
        HOLI: (
            <div className="relative group/sticker cursor-pointer">
                 <div className="absolute inset-0 bg-pink-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                 <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white rounded-full flex flex-col items-center justify-center border-4 border-purple-500 shadow-2xl transform rotate-12 transition-transform hover:rotate-0 hover:scale-110 overflow-hidden">
                    {/* Splashes */}
                    <div className="absolute top-0 left-0 w-10 h-10 bg-pink-500 rounded-full mix-blend-multiply filter blur-sm"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-400 rounded-full mix-blend-multiply filter blur-sm"></div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-400 rounded-full mix-blend-multiply filter blur-sm"></div>
                    
                    <span className="relative z-10 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">Holi</span>
                    <span className="relative z-10 text-2xl md:text-3xl font-black font-heading leading-none text-purple-600">SPLASH</span>
                    <span className="relative z-10 text-xs md:text-sm font-bold bg-purple-600 text-white px-1 rounded mt-1">60% OFF</span>
                </div>
            </div>
        )
    };

    return badges[occasion] || badges.DEFAULT;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onViewProduct }) => {
  const { products, categories, addToCart, setVoiceRequest } = useStore();
  const featuredProducts = products.slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const handleCtaClick = (slide: typeof HERO_SLIDES[0]) => {
      if (slide.category !== 'All') {
          setVoiceRequest({ query: '', category: slide.category, sortBy: 'default', timestamp: Date.now() });
      }
      onNavigate('shop');
  };

  const handleCategoryClick = (categoryName: string) => {
      setVoiceRequest({ query: '', category: categoryName, sortBy: 'default', timestamp: Date.now() });
      onNavigate('shop');
  };

  return (
    <div className="bg-white">
      {/* Hero Slider Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-slate-900 group">
        
        {/* Animated Occasion Badge (Dynamic) */}
        <div className="absolute top-4 right-4 md:right-10 md:top-10 z-40 animate-bounce">
            <OccasionBadge />
        </div>

        {/* Slides */}
        {HERO_SLIDES.map((slide, index) => (
            <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover transition-transform duration-[6000ms] ease-out transform scale-100 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center z-20">
                    <div className="max-w-2xl">
                        <div 
                          className={`flex items-center space-x-2 mb-2 transition-all duration-700 delay-100 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        >
                            <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${slide.accentColor}`} />
                            <span className={`${slide.accentColor} text-xs md:text-sm font-black uppercase tracking-[0.3em]`}>
                                {slide.subtitle}
                            </span>
                        </div>
                        <h1 
                          className={`text-3xl md:text-5xl font-extrabold text-white font-heading leading-tight mb-2 tracking-tight drop-shadow-lg transition-all duration-700 delay-200 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        >
                            {slide.title} <span className={`block ${slide.accentColor}`}>{slide.highlight}</span>
                        </h1>
                        <p 
                          className={`text-sm md:text-lg text-slate-300 font-light italic mb-4 max-w-lg leading-relaxed drop-shadow-md transition-all duration-700 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        >
                            {slide.description}
                        </p>
                        <button
                            onClick={() => handleCtaClick(slide)}
                            className={`px-6 py-2.5 md:px-8 md:py-3 ${slide.buttonClass} text-white rounded-2xl text-sm md:text-base font-black tracking-wide transition-all duration-700 delay-400 transform hover:scale-105 hover:shadow-lg flex items-center group ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        >
                            {slide.cta} <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        ))}

        {/* Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex space-x-3 md:space-x-4">
             <button onClick={prevSlide} className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/20 active:scale-95">
                 <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
             </button>
             <button onClick={nextSlide} className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/20 active:scale-95">
                 <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
             </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {HERO_SLIDES.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                        idx === currentSlide ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
                    }`}
                />
            ))}
        </div>
      </div>

      <AdBanner />

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading uppercase">Shop by Category</h2>
          <div className="h-1.5 w-24 bg-indigo-600 mt-4 rounded-full"></div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-10">
          {categories.map((category) => (
            <div key={category.id} className="group relative cursor-pointer overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-500 hover:-translate-y-2" onClick={() => handleCategoryClick(category.name)}>
              <div className="aspect-[3/4] w-full bg-slate-200 relative overflow-hidden">
                <img src={category.image} alt={`${category.name} category collection`} className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 font-heading drop-shadow-md">
                    {category.name}
                  </h3>
                  <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500 ease-out">
                      <p className="text-white/90 text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Explore Collection <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Affiliate Partner Holder / Meesho Section */}
        <div className="mt-20 bg-gradient-to-br from-[#7b2cbf] to-[#9d4edd] rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl group cursor-pointer transition-all hover:shadow-[#7b2cbf]/50 hover:-translate-y-1" onClick={() => handleCategoryClick('Meesho Finds')}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                <div className="flex-1 text-white text-center lg:text-left space-y-6">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold uppercase tracking-widest shadow-sm">
                        <Sparkles className="w-4 h-4 mr-2 text-yellow-300" /> Partner Spotlight
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight drop-shadow-lg leading-[0.9]">
                        Meesho Super Saver
                    </h3>
                    <p className="text-purple-100 font-medium text-xl md:text-2xl max-w-2xl leading-relaxed">
                        Unlock unbeatable factory prices on trending fashion, home decor, and accessories. Curated just for you.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleCategoryClick('Meesho Finds'); }}
                            className="bg-white text-[#7b2cbf] px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-purple-50 hover:scale-105 transition-all flex items-center text-lg"
                         >
                             Shop Deals <ExternalLink className="ml-2 w-5 h-5" />
                         </button>
                    </div>
                </div>
                <div className="w-full lg:w-auto max-w-sm relative flex-shrink-0">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#7b2cbf] to-transparent z-10 opacity-50 rounded-3xl"></div>
                   <img 
                       src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop" 
                       alt="Fashion Collection" 
                       className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-2xl transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700 border-8 border-white/20" 
                   />
                   <div className="absolute -bottom-8 -left-8 bg-white text-[#7b2cbf] p-6 rounded-2xl shadow-xl font-black text-center transform -rotate-6 group-hover:rotate-0 transition-transform z-20 duration-500">
                       <span className="block text-sm uppercase tracking-wider text-slate-500 mb-1">Starting at</span>
                       <span className="text-5xl">₹99</span>
                   </div>
                </div>
            </div>
        </div>

      </div>

      {/* Native Ad Banner */}
      <NativeAdBanner />

      {/* Trending Products */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 font-heading uppercase">Trending Now</h2>
              <p className="text-slate-500 mt-2 font-medium text-lg">The most sought-after pieces of the season.</p>
            </div>
            <button onClick={() => onNavigate('shop')} className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-widest text-sm transition-all group">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-100 hover:-translate-y-3 flex flex-col overflow-hidden" 
                onClick={() => onViewProduct(product.id)}
              >
                <div className="w-full aspect-[4/5] bg-slate-100 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={`Trending item: ${product.name}`} 
                    className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">{product.category}</span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow p-6">
                    <div className="mb-3 flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                        <span className="text-xs text-slate-400">({product.reviews})</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-xs text-slate-400 font-medium line-through">₹{Math.round(product.price * 1.2)}</span>
                           <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                        </div>
                        
                        <button
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            aria-label={`Add ${product.name} to cart`}
                            className="bg-slate-900 text-white p-3 rounded-full hover:bg-indigo-600 transition-colors shadow-lg active:scale-90"
                        >
                             <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
           <div className="mt-16 sm:hidden px-4">
            <button onClick={() => onNavigate('shop')} className="w-full flex items-center justify-center bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
              See All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;