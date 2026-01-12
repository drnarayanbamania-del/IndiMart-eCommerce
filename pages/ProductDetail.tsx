
import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Star, ShoppingCart, ArrowLeft, Heart, ChevronLeft, ChevronRight, Facebook, Twitter, MessageCircle, Check, ShieldCheck, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onViewProduct: (id: string) => void;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onViewProduct }) => {
  const { products, addToCart } = useStore();
  const product = products.find(p => p.id === productId);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  // Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Review State
  const [reviews, setReviews] = useState<Review[]>([
      { id: '1', userName: 'John Doe', rating: 5, comment: 'Absolutely love this product! The quality is outstanding and it arrived earlier than expected.', date: '2 days ago', verified: true },
      { id: '2', userName: 'Jane Smith', rating: 4, comment: 'Great value for money. The color matches the photos perfectly.', date: '1 week ago', verified: true },
      { id: '3', userName: 'Mike Johnson', rating: 5, comment: 'Exceeded my expectations. Highly recommended! I will definitely buy again.', date: '2 weeks ago', verified: false }
  ]);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [touched, setTouched] = useState({ name: false, comment: false });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <button onClick={onBack} className="mt-4 text-primary-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go back to shop
        </button>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setZoomPos(prev => ({ ...prev, opacity: 0 }));
  };

  const errors = {
    name: reviewForm.name.trim().length < 2 ? 'Name must be at least 2 characters' : null,
    comment: reviewForm.comment.trim().length < 10 ? 'Comment must be at least 10 characters' : null,
  };

  const isFormValid = !errors.name && !errors.comment;

  const images = [
    product.image,
    `https://picsum.photos/800/800?random=${product.id}1`,
    `https://picsum.photos/800/800?random=${product.id}2`,
    `https://picsum.photos/800/800?random=${product.id}3`,
  ];

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const averageRating = useMemo(() => {
      if (reviews.length === 0) return 0;
      return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
      const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(r => {
          // @ts-ignore
          if (dist[r.rating] !== undefined) dist[r.rating]++;
      });
      return dist;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
      const sorted = [...reviews];
      if (sortBy === 'highest') return sorted.sort((a, b) => b.rating - a.rating);
      if (sortBy === 'lowest') return sorted.sort((a, b) => a.rating - b.rating);
      return sorted;
  }, [reviews, sortBy]);

  const handleNextImage = () => {
    handleMouseLeave();
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    handleMouseLeave();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    if (isAdded) return;
    for(let i=0; i<quantity; i++) addToCart(product, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTouched({ name: true, comment: true });
      if (!isFormValid) return;
      setIsSubmittingReview(true);
      setTimeout(() => {
          const newReview: Review = {
              id: Math.random().toString(36).substr(2, 9),
              userName: reviewForm.name,
              rating: reviewForm.rating,
              comment: reviewForm.comment,
              date: 'Just now',
              verified: true 
          };
          setReviews([newReview, ...reviews]);
          setReviewForm({ name: '', rating: 5, comment: '' });
          setTouched({ name: false, comment: false });
          setIsSubmittingReview(false);
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 4000);
      }, 800);
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this ${product.name} at Apna Store! Only ₹${product.price}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;

  return (
    <div className="bg-white min-h-screen pb-12 font-sans animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary-600 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Enhanced Image Gallery with High-Fidelity Zoom */}
          <div className="product-images">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 group shadow-2xl border border-gray-100 cursor-crosshair ring-1 ring-gray-900/5"
            >
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
                    activeImage === idx 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-105 z-0 pointer-events-none'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} - View ${idx + 1}`} 
                    className="w-full h-full object-center object-cover"
                  />
                </div>
              ))}
              
              {/* Refined Magnifier Overlay */}
              <div 
                className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-500 ease-out shadow-inner"
                role="img"
                aria-label={`${product.name} zoomed view`}
                style={{
                  opacity: zoomPos.opacity,
                  backgroundImage: `url(${images[activeImage]})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              {/* Navigation Controls */}
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} 
                aria-label="Previous product image"
                className="absolute z-40 left-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-xl hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-gray-100 active:scale-90"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }} 
                aria-label="Next product image"
                className="absolute z-40 right-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-xl hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-gray-100 active:scale-90"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-40">
                 {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                        aria-label={`Show image ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-500 ${activeImage === idx ? 'bg-primary-600 w-12 shadow-md' : 'bg-gray-300/60 w-4 hover:bg-white'}`}
                    />
                 ))}
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-5 px-1">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  aria-label={`Show ${product.name} view ${idx + 1}`}
                  className={`relative rounded-2xl overflow-hidden aspect-square border-4 transition-all duration-300 transform ${activeImage === idx ? 'border-primary-500 scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-102'}`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1} thumbnail`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="mt-10 lg:mt-0">
            <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 font-heading mb-3">{product.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary-800">
                    {product.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                    <button 
                      aria-label="Add to wishlist"
                      className="p-3 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                        <Heart className="w-6 h-6" />
                    </button>
                </div>
            </div>
            
            <div className="mt-6 flex items-baseline space-x-4">
              <p className="text-5xl text-gray-900 font-black">₹{product.price}</p>
              {product.price > 1000 && <p className="text-xl text-gray-400 line-through font-medium">₹{(product.price * 1.2).toFixed(0)}</p>}
            </div>

            <div className="mt-6 flex items-center">
                <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 shadow-sm" aria-label={`${product.rating} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-4 w-4 ${product.rating > rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-black text-yellow-700">{product.rating}</span>
                </div>
                <a href="#reviews" className="ml-6 text-sm font-bold text-primary-600 hover:underline">
                  {reviews.length} Customer Reviews
                </a>
            </div>

            <div className="mt-10">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">The Detail</h3>
              <div className="text-lg text-gray-600 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            <div className="mt-12 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3 text-sm font-bold mb-8">
                 <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} aria-hidden="true"></span>
                 <span className={product.stock > 0 ? 'text-green-700' : 'text-red-700'}>
                    {product.stock > 0 ? `Ready to ship (${product.stock} left)` : 'Sold Out'}
                 </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex items-center bg-white border-2 border-gray-100 rounded-2xl p-1 shadow-inner">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        aria-label="Decrease quantity"
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        aria-label="Product quantity"
                        className="w-10 text-center text-gray-900 font-black bg-transparent border-none focus:ring-0" 
                        value={quantity} 
                        readOnly 
                      />
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        aria-label="Increase quantity"
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        +
                      </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded || product.stock === 0}
                    className={`flex-1 rounded-2xl py-5 px-10 flex items-center justify-center text-lg font-black text-white transition-all duration-300 shadow-2xl ${
                        isAdded 
                        ? 'bg-green-600 shadow-green-500/20' 
                        : product.stock === 0 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'
                    }`}
                  >
                    {isAdded ? (
                        <>
                            <Check className="w-6 h-6 mr-3" />
                            Added!
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-6 h-6 mr-3" />
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Collection'}
                        </>
                    )}
                  </button>
              </div>
            </div>
            
            {/* Social Sharing */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center space-x-6">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share this</span>
                <div className="flex space-x-4">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Facebook className="w-5 h-5" /></a>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="p-2 text-gray-400 hover:text-sky-400 hover:bg-sky-50 rounded-lg transition-all"><Twitter className="w-5 h-5" /></a>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"><MessageCircle className="w-5 h-5" /></a>
                </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-32 pt-20 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
              <h2 className="text-4xl font-black text-gray-900 font-heading">Feedback</h2>
              <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">Verified community reviews</span>
              </div>
            </div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-20">
                {/* Statistics & Form */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 text-center">
                        <p className="text-7xl font-black text-gray-900 mb-2">{averageRating.toFixed(1)}</p>
                        <div className="flex justify-center items-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-7 h-7 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-100'}`} />
                            ))}
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Average Impression</p>
                        
                        <div className="mt-10 space-y-4">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                // @ts-ignore
                                const count = ratingDistribution[rating] || 0;
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={rating} className="flex items-center text-sm">
                                        <div className="w-8 text-gray-400 font-black">{rating}★</div>
                                        <div className="flex-1 mx-4 h-2 bg-gray-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="w-6 text-right text-gray-300 font-bold">{count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
                        {showSuccessMessage && (
                            <div className="absolute inset-0 bg-primary-600 flex flex-col items-center justify-center z-20 animate-in fade-in slide-in-from-bottom duration-500 p-10 text-center">
                                <CheckCircle2 className="w-20 h-20 mb-6 animate-bounce" />
                                <h4 className="text-3xl font-black mb-4">Grazie!</h4>
                                <p className="text-primary-50 font-medium">Your experience is now part of our story.</p>
                                <button onClick={() => setShowSuccessMessage(false)} className="mt-8 px-8 py-3 bg-white text-primary-600 rounded-2xl font-black text-sm uppercase">Close</button>
                            </div>
                        )}

                        <h3 className="text-2xl font-black mb-8">Add your voice</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                            <div>
                                <input 
                                    type="text" 
                                    aria-label="Your Name"
                                    className="block w-full rounded-2xl bg-white/10 border-white/10 text-white placeholder-white/30 p-4 focus:ring-primary-500 focus:bg-white/20 transition-all outline-none"
                                    value={reviewForm.name}
                                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                                    placeholder="Your Identity"
                                />
                            </div>
                            <div className="flex justify-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star}
                                        type="button"
                                        aria-label={`Rate ${star} out of 5 stars`}
                                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                                        className="focus:outline-none transition-transform active:scale-90"
                                    >
                                        <Star className={`w-10 h-10 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-white/10'}`} />
                                    </button>
                                ))}
                            </div>
                            <textarea 
                                rows={4}
                                aria-label="Review comment"
                                className="block w-full rounded-2xl bg-white/10 border-white/10 text-white placeholder-white/30 p-4 focus:ring-primary-500 focus:bg-white/20 transition-all outline-none resize-none"
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                placeholder="Your perspective..."
                            />
                            <button 
                                type="submit" 
                                disabled={isSubmittingReview || !isFormValid}
                                className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-500 disabled:opacity-30 transition-all shadow-xl shadow-primary-600/20"
                            >
                                {isSubmittingReview ? <RefreshCcw className="w-6 h-6 animate-spin mx-auto" /> : 'Post Thought'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-8 mt-16 lg:mt-0">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{reviews.length} Reflections</span>
                        <div className="flex items-center space-x-3 text-xs font-black">
                            <span className="text-gray-400 uppercase">Sort by</span>
                            <select 
                                value={sortBy}
                                aria-label="Sort reviews"
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-gray-50 border-none rounded-xl text-primary-600 font-black py-2 pr-10 focus:ring-0 cursor-pointer"
                            >
                                <option value="newest">Newest</option>
                                <option value="highest">Top Rated</option>
                                <option value="lowest">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {sortedReviews.map((review) => (
                            <div key={review.id} className="group bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-5">
                                        <div className="h-16 w-16 rounded-[1.25rem] bg-primary-50 flex items-center justify-center text-primary-600 font-black text-2xl shadow-inner border border-primary-100" aria-hidden="true">
                                            {review.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center flex-wrap gap-2">
                                                <h3 className="text-lg font-black text-gray-900">{review.userName}</h3>
                                                {review.verified && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                                                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-300 font-bold mt-1 uppercase tracking-widest">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1" aria-label={`${review.rating} out of 5 stars`}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-100'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-lg font-light italic">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Cross Sell */}
        {relatedProducts.length > 0 && (
            <div className="mt-40 border-t border-gray-100 pt-20 pb-20">
                <div className="flex items-end justify-between mb-12">
                  <h2 className="text-4xl font-black text-gray-900 font-heading">Complete the Mood</h2>
                  <button onClick={onBack} className="text-sm font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest flex items-center group">
                    View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((rel) => (
                        <div 
                          key={rel.id} 
                          className="group bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer" 
                          onClick={() => onViewProduct(rel.id)}
                        >
                            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-6">
                                <img src={rel.image} alt={`${rel.name} related product`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{rel.name}</h3>
                                <p className="text-xs text-gray-300 font-bold mt-1 uppercase tracking-widest">{rel.category}</p>
                                <p className="text-xl font-black text-gray-900 mt-4">₹{rel.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const RefreshCcw = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default ProductDetail;
