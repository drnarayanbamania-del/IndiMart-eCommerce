import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { ArrowRight, Star } from 'lucide-react';

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
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-heading">
                  <span className="block xl:inline">Premium Quality</span>{' '}
                  <span className="block text-primary-500 xl:inline">For Modern Life</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Discover our curated collection of high-end accessories, electronics, and lifestyle products designed to elevate your everyday experience.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button onClick={() => onNavigate('shop')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Hero"
          />
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {categories.map((category) => (
            <div key={category.id} className="group relative cursor-pointer" onClick={() => onNavigate('shop')}>
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img src={category.image} alt={category.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {category.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Trending Products</h2>
            <button onClick={() => onNavigate('shop')} className="hidden sm:flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer" 
                onClick={() => onViewProduct(product.id)}
              >
                <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
                  <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700 font-medium">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 z-10 relative"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
           <div className="mt-8 sm:hidden">
            <button onClick={() => onNavigate('shop')} className="w-full flex items-center justify-center text-primary-600 font-medium">
              View all products <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;