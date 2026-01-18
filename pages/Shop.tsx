import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Star, Filter, Search, ChevronDown, Mic, MicOff, Eye, X, ShoppingCart, ArrowRight } from 'lucide-react';
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

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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

  // Close Quick View on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

  const processCommand = (command: string) => {
     processVoiceCommand(command);
  }

  const processVoiceCommand = (command: string) => {
    const lowerCmd = command.toLowerCase();
    
    let detectedCategory = selectedCategory;
    let detectedSort = sortBy;
    let detectedQuery = '';

    // 1. Enhanced Category Detection with Regex for Word Boundaries
    // Define mappings based on common terms for our shop categories
    const categoryMap: Record<string, string[]> = {
        'Electronics': ['electronics', 'gadget', 'phone', 'mobile', 'camera', 'tech', 'device', 'headphone', 'earphone', 'speaker'],
        'Computers': ['computer', 'laptop', 'desktop', 'pc', 'mac', 'macbook', 'monitor', 'keyboard', 'mouse', 'processor'],
        'Home Appliances': ['appliance', 'fridge', 'refrigerator', 'washing machine', 'microwave', 'oven', 'ac', 'air conditioner', 'fan', 'heater', 'vacuum', 'mixer'],
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
    Object.keys(categoryMap).forEach(cat => {
        // Remove category name itself
        tempQuery = tempQuery.replace(new RegExp(`\\b${cat.toLowerCase()}\\b`, 'g'), '');
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

            {/* Changed to 4 columns on large screens for compact view */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative border border-slate-100" 
                  onClick={() => onViewProduct(product.id)}
                >
                  <div className="relative pb-[100%] overflow-hidden">
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    
                    {/* Quick View Button Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewProduct(product);
                            }}
                            className="pointer-events-auto bg-white/90 backdrop-blur-sm text-slate-800 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-indigo-600 active:scale-95"
                            title="Quick View"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{product.name}</h3>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.category}</p>
                      <div className="flex items-center mt-1">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                         ))}
                         <span className="text-[10px] text-slate-500 ml-1">({product.reviews})</span>
                      </div>
                      <p className="mt-2 text-lg font-black text-slate-900">₹{product.price}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="mt-3 w-full bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors z-10 relative text-xs font-bold uppercase tracking-wide"
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

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
             <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full text-slate-500 hover:text-slate-900 transition-all hover:rotate-90"
             >
                <X className="w-5 h-5" />
             </button>

             {/* Product Image */}
             <div className="w-full md:w-1/2 bg-slate-100 relative">
                <img 
                    src={quickViewProduct.image} 
                    alt={quickViewProduct.name} 
                    className="w-full h-full object-cover object-center aspect-square md:aspect-auto"
                />
             </div>

             {/* Product Details */}
             <div className="w-full md:w-1/2 p-8 flex flex-col">
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                        {quickViewProduct.category}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 font-heading leading-tight mb-2">
                        {quickViewProduct.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                         <div className="flex text-yellow-400">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-slate-200'}`} />
                             ))}
                         </div>
                         <span className="text-sm font-medium text-slate-400">({quickViewProduct.reviews} reviews)</span>
                    </div>
                </div>

                <div className="mb-6 flex-1">
                    <p className="text-4xl font-black text-slate-900 mb-4">₹{quickViewProduct.price}</p>
                    <div className="text-slate-600 leading-relaxed text-sm font-light overflow-y-auto max-h-32 pr-2 custom-scrollbar" dangerouslySetInnerHTML={{ __html: quickViewProduct.description }}>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                    <button
                        onClick={() => {
                            addToCart(quickViewProduct);
                            setQuickViewProduct(null);
                        }}
                        disabled={quickViewProduct.stock === 0}
                        className={`w-full py-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
                            quickViewProduct.stock > 0 
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30' 
                            : 'bg-slate-400 cursor-not-allowed'
                        }`}
                    >
                         <ShoppingCart className="w-5 h-5 mr-2" />
                         {quickViewProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    
                    <button
                        onClick={() => {
                            onViewProduct(quickViewProduct.id);
                            setQuickViewProduct(null);
                        }}
                        className="w-full py-4 rounded-xl flex items-center justify-center font-bold uppercase tracking-widest text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-indigo-600 transition-colors border border-slate-100"
                    >
                        View Full Details <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;