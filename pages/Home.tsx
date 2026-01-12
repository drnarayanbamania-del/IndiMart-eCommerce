
import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { ArrowRight, Star, Sparkles } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onViewProduct: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onViewProduct }) => {
  const { products, categories, addToCart } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-primary-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-primary-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex items-center sm:justify-center lg:justify-start space-x-2 mb-4 animate-in fade-in slide-in-from-left duration-700">
                  <Sparkles className="w-5 h-5 text-indigo-300" />
                  <span className="text-indigo-300 text-sm font-black uppercase tracking-[0.3em]">Elevate Your Lifestyle</span>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-heading leading-tight">
                  <span className="block xl:inline">Premium Quality</span>{' '}
                  <span className="block text-indigo-300 xl:inline">For Modern Life</span>
                </h1>
                <p className="mt-6 text-xl text-slate-300 sm:max-w-xl sm:mx-auto lg:mx-0 font-light italic leading-relaxed">
                  "One choice at a time, we help you define the standard of your everyday living."
                </p>
                <p className="mt-4 text-base text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                  Discover our curated collection of high-end accessories, electronics, and lifestyle products designed to elevate your everyday experience.
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-2xl shadow-2xl">
                    <button onClick={() => onNavigate('shop')} className="w-full flex items-center justify-center px-10 py-4 border border-transparent text-lg font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 md:py-5 md:text-xl md:px-12 transition-all transform hover:scale-105 active:scale-95 shadow-indigo-500/25">
                      Explore Collection
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full brightness-75 lg:brightness-100"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Showroom background showing curated store collection"
          />
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
