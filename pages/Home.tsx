import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { ArrowRight, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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

  return (
    <div className="bg-white">
      {/* Hero Slider Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-slate-900 group">
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

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-heading uppercase">Shop by Category</h2>
          <div className="h-1 w-20 bg-indigo-600 mt-4 rounded-full"></div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12">
          {categories.map((category) => (
            <div key={category.id} className="group relative cursor-pointer overflow-hidden rounded-[2rem] shadow-lg border border-slate-100" onClick={() => onNavigate('shop')}>
              <div className="w-full min-h-80 bg-slate-200 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:h-80 lg:aspect-none transition-all duration-700">
                <img src={category.image} alt={`${category.name} category collection`} className="w-full h-full object-center object-cover lg:w-full lg:h-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm font-bold mt-2 flex items-center">
                    Explore Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 font-heading uppercase">Trending Now</h2>
              <p className="text-slate-500 mt-2 font-medium">The most sought-after pieces of the season.</p>
            </div>
            <button onClick={() => onNavigate('shop')} className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-widest text-sm transition-all group">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-50" 
                onClick={() => onViewProduct(product.id)}
              >
                <div className="w-full aspect-square bg-slate-100 rounded-[2rem] overflow-hidden mb-6">
                  <img src={product.image} alt={`Trending item: ${product.name}`} className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">{product.category}</span>
                        <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-[10px] font-bold text-slate-400 ml-1">{product.rating}</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-2xl font-black text-slate-900 mt-4">₹{product.price}</p>
                    
                    <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    aria-label={`Add ${product.name} to cart`}
                    className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
                    >
                    Quick Add
                    </button>
                </div>
              </div>
            ))}
          </div>
           <div className="mt-12 sm:hidden px-4">
            <button onClick={() => onNavigate('shop')} className="w-full flex items-center justify-center bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-2xl font-black uppercase tracking-widest">
              See All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;