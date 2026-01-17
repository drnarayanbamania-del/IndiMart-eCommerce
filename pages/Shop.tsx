import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Star, Filter, Search, ChevronDown, Mic, MicOff } from 'lucide-react';
import { Product } from '../types';

interface ShopProps {
  onViewProduct: (id: string) => void;
}

const Shop: React.FC<ShopProps> = ({ onViewProduct }) => {
  const { products, addToCart, categories, voiceRequest } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating-desc'>('default');
  
  // Voice Search State
  const [isListening, setIsListening] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(12);

  // Listen for global voice commands from the floating assistant
  useEffect(() => {
    if (voiceRequest) {
      // Check if the request is recent (within 5 seconds) to prevent applying stale state on navigation back
      const isRecent = Date.now() - voiceRequest.timestamp < 5000;
      
      if (isRecent) {
        if (voiceRequest.category) {
            setSelectedCategory(voiceRequest.category);
        }
        if (voiceRequest.sortBy) {
            setSortBy(voiceRequest.sortBy);
        }
        // Always set the query, even if empty, to reset search when a new voice command is issued
        setSearchQuery(voiceRequest.query);
      }
    }
  }, [voiceRequest]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchQuery, sortBy]);

  // Local Voice Search Handler
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      processVoiceCommand(transcript);
    };

    recognition.start();
  };

  const processVoiceCommand = (command: string) => {
    const lowerCmd = command.toLowerCase();
    
    let detectedCategory = selectedCategory;
    let detectedSort = sortBy;
    let detectedQuery = '';

    // 1. Enhanced Category Detection with Regex for Word Boundaries
    // Define mappings based on common terms for our shop categories
    const categoryMap: Record<string, string[]> = {
        'Electronics': ['electronics', 'gadget', 'phone', 'mobile', 'laptop', 'computer', 'monitor', 'headphone', 'earphone', 'camera', 'tech', 'device'],
        'Furniture': ['furniture', 'sofa', 'chair', 'table', 'desk', 'couch', 'bed', 'shelf', 'decor', 'living room'],
        'Accessories': ['accessories', 'bag', 'purse', 'wallet', 'sunglass', 'glasses', 'jewelry', 'necklace', 'ring', 'bracelet', 'belt', 'watch']
    };

    // Check for explicit "All" intent
    if (/\b(all|everything)\b/.test(lowerCmd)) {
        detectedCategory = 'All';
    } else {
        // Iterate through categories to find matches
        for (const [cat, keywords] of Object.entries(categoryMap)) {
            // Check for singular or plural forms (basic check)
            if (keywords.some(k => new RegExp(`\\b${k}\\b|\\b${k}s\\b`).test(lowerCmd))) {
                detectedCategory = cat;
                // If we found a category, we might want to switch to it. 
                // We don't break immediately if we want to support multi-category logic, 
                // but for this single-select UI, priority to the first match or specific logic applies.
                break; 
            }
        }
    }

    // 2. Enhanced Sort Detection
    if (/\b(cheap|lowest|low price|budget|economical|inexpensive)\b/.test(lowerCmd)) {
        detectedSort = 'price-asc';
    } else if (/\b(expensive|highest|high price|premium|luxury|costly)\b/.test(lowerCmd)) {
        detectedSort = 'price-desc';
    } else if (/\b(best|top|rated|popular|trending|favorite|good)\b/.test(lowerCmd)) {
        detectedSort = 'rating-desc';
    }

    // 3. Smart Query Extraction
    // Start with the full command
    let tempQuery = lowerCmd;
    
    // Remove explicit category names from the query to avoid redundant searching
    ['electronics', 'furniture', 'accessories'].forEach(c => {
         tempQuery = tempQuery.replace(new RegExp(`\\b${c}\\b`, 'g'), '');
    });

    // Remove sorting keywords to clean up the query
    const sortWords = [
        'cheap', 'cheapest', 'lowest', 'low', 'price', 'budget', 'economical',
        'expensive', 'highest', 'high', 'premium', 'luxury', 'costly',
        'best', 'top', 'rated', 'popular', 'trending', 'sort', 'by', 'order'
    ];
    sortWords.forEach(w => {
        tempQuery = tempQuery.replace(new RegExp(`\\b${w}\\b`, 'g'), '');
    });

    // Remove common conversational filler phrases
    const fillers = [
        'show me', 'i want', 'search for', 'find', 'looking for', 'list', 
        'products', 'items', 'stuff', 'things', 
        ' in ', ' with ', ' a ', ' an ', ' the '
    ];
    fillers.forEach(f => {
        tempQuery = tempQuery.replace(new RegExp(f, 'g'), ' ');
    });

    // Clean up whitespace
    detectedQuery = tempQuery.replace(/\s+/g, ' ').trim();

    // Edge Case: If the query is now empty but we detected a category, 
    // it means the user likely just said "Show me Electronics" or "Cheap Furniture".
    // In this case, we rely on the category filter and sort, with no text search.

    // Apply the updated state
    setSelectedCategory(detectedCategory);
    setSortBy(detectedSort);
    setSearchQuery(detectedQuery);
  };

  const filteredProducts = products
    .filter(p => (selectedCategory === 'All' || p.category === selectedCategory))
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0;
    });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading mb-8">Shop All Products</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-slate-900 flex items-center mb-4">
                  <Filter className="w-5 h-5 mr-2" /> Filters
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'All'}
                      onChange={() => setSelectedCategory('All')}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="ml-2 text-slate-700">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.name}
                        onChange={() => setSelectedCategory(cat.name)}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="ml-2 text-slate-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                    onClick={handleVoiceSearch}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-indigo-600'}`}
                    title="Search with Voice"
                >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="default">Sort by: Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer" 
                  onClick={() => onViewProduct(product.id)}
                >
                  <div className="relative pb-[100%]">
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-slate-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                      <div className="flex items-center mt-2">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                         ))}
                         <span className="text-xs text-slate-500 ml-1">({product.reviews})</span>
                      </div>
                      <p className="mt-2 text-xl font-bold text-slate-900">₹{product.price}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors z-10 relative"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
                  {searchQuery && (
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="mt-4 text-indigo-600 font-medium hover:underline"
                      >
                          Clear filters
                      </button>
                  )}
                </div>
              )}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4">
                <button
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="group inline-flex items-center px-8 py-3 bg-white border border-slate-300 rounded-full text-slate-700 font-bold hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Load More Products
                  <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </button>
                <p className="mt-3 text-xs text-slate-400 font-medium">
                    Showing {displayedProducts.length} of {filteredProducts.length} products
                </p>
                <div className="w-full max-w-xs mx-auto mt-2 bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
                    />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;