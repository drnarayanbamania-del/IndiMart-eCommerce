
import React, { useState, useMemo } from 'react';
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

  // Review State
  const [reviews, setReviews] = useState<Review[]>([
      { id: '1', userName: 'John Doe', rating: 5, comment: 'Absolutely love this product! The quality is outstanding and it arrived earlier than expected.', date: '2 days ago', verified: true },
      { id: '2', userName: 'Jane Smith', rating: 4, comment: 'Great value for money. The color matches the photos perfectly.', date: '1 week ago', verified: true },
      { id: '3', userName: 'Mike Johnson', rating: 5, comment: 'Exceeded my expectations. Highly recommended! I will definitely buy again.', date: '2 weeks ago', verified: false }
  ]);
  
  // Review Form State with Validation
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

  // Validation Logic
  const errors = {
    name: reviewForm.name.trim().length < 2 ? 'Name must be at least 2 characters' : null,
    comment: reviewForm.comment.trim().length < 10 ? 'Comment must be at least 10 characters' : null,
  };

  const isFormValid = !errors.name && !errors.comment;

  // Simulate multiple images for the carousel
  const images = [
    product.image,
    `https://picsum.photos/600/600?random=${product.id}1`,
    `https://picsum.photos/600/600?random=${product.id}2`,
    `https://picsum.photos/600/600?random=${product.id}3`,
  ];

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Derived Review Statistics
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
      return sorted; // Assume default is newest (order of insertion)
  }, [reviews, sortBy]);

  const handleNextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const handlePrevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

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
      
      // Simulate network delay
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
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary-600 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <div className="product-images">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 group shadow-md border border-gray-100">
              {images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${product.name} - Detailed professional view ${idx + 1} of ${images.length}`} 
                  className={`absolute inset-0 w-full h-full object-center object-cover transition-all duration-700 ease-in-out transform ${
                    activeImage === idx 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-105 z-0'
                  }`}
                />
              ))}
              
              <button 
                onClick={handlePrevImage} 
                className="absolute z-20 left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm border border-gray-200"
                aria-label="Previous product image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button 
                onClick={handleNextImage} 
                className="absolute z-20 right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm border border-gray-200"
                aria-label="Next product image"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2.5 z-20">
                 {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-primary-600 w-8' : 'bg-gray-300 w-4 hover:bg-gray-400'}`}
                        aria-label={`Show product image ${idx + 1}`}
                    />
                 ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${activeImage === idx ? 'border-primary-500 ring-2 ring-primary-100 ring-offset-1' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  aria-label={`Switch to product thumbnail ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex justify-between items-start relative">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading mb-2">{product.name}</h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all border border-transparent hover:border-red-100" title="Add to Wishlist">
                        <Heart className="w-6 h-6" />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-200 mx-1"></div>

                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all border border-transparent hover:border-blue-100" title="Share on Facebook">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2.5 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-full transition-all border border-transparent hover:border-sky-100" title="Share on Twitter">
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all border border-transparent hover:border-green-100" title="Share on WhatsApp">
                        <MessageCircle className="w-5 h-5" />
                    </a>
                </div>
            </div>
            
            <div className="mt-4 flex items-baseline space-x-3">
              <p className="text-4xl text-gray-900 font-bold">₹{product.price}</p>
              {product.price > 1000 && <p className="text-lg text-gray-400 line-through">₹{(product.price * 1.2).toFixed(0)}</p>}
            </div>

            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-4 w-4 flex-shrink-0 ${
                        product.rating > rating ? 'text-yellow-400 fill-current' : 'text-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-yellow-700">{product.rating}</span>
                </div>
                <a href="#reviews" className="ml-4 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  {reviews.length} Verified Reviews
                </a>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Description</h3>
              <div className="text-base text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-3 text-sm font-medium mb-6">
                 <span className={`inline-block w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                 <span className={product.stock > 0 ? 'text-green-700' : 'text-red-700'}>
                    {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Currently Out of Stock'}
                 </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="w-12 text-center text-gray-900 font-bold focus:outline-none bg-transparent" 
                        value={quantity} 
                        readOnly 
                      />
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded || product.stock === 0}
                    className={`flex-1 rounded-xl py-4 px-8 flex items-center justify-center text-lg font-bold text-white shadow-xl transition-all duration-300 transform active:scale-95 ${
                        isAdded 
                        ? 'bg-green-600' 
                        : product.stock === 0 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'
                    }`}
                  >
                    {isAdded ? (
                        <>
                            <Check className="w-6 h-6 mr-2" />
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-6 h-6 mr-2" />
                            {product.stock === 0 ? 'Notify Me' : 'Add to Cart'}
                        </>
                    )}
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-20 border-t border-gray-100 pt-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900 font-heading">Product Feedback</h2>
              <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Only verified purchasers can leave reviews</span>
              </div>
            </div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                {/* Left: Summary and Form */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-center mb-8">
                            <p className="text-6xl font-black text-gray-900 mb-2">{averageRating.toFixed(1)}</p>
                            <div className="flex justify-center items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Global Rating</p>
                        </div>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                // @ts-ignore
                                const count = ratingDistribution[rating] || 0;
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={rating} className="flex items-center text-sm">
                                        <div className="w-10 text-gray-600 font-bold">{rating} ★</div>
                                        <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="w-10 text-right text-gray-400 text-xs font-bold">{count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative overflow-hidden group">
                        {showSuccessMessage && (
                            <div className="absolute inset-0 bg-primary-600/95 flex flex-col items-center justify-center text-white z-20 animate-in fade-in slide-in-from-bottom duration-300 p-8 text-center backdrop-blur-sm">
                                <CheckCircle2 className="w-20 h-20 mb-4 animate-bounce" />
                                <h4 className="text-2xl font-bold mb-2">Review Shared!</h4>
                                <p className="text-sm text-primary-50">Your feedback helps millions of shoppers make better choices. Thank you!</p>
                                <button onClick={() => setShowSuccessMessage(false)} className="mt-6 px-6 py-2 bg-white text-primary-600 rounded-lg text-sm font-bold hover:bg-primary-50 transition-colors">Write Another</button>
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Your Display Name</label>
                                <input 
                                    type="text" 
                                    id="name"
                                    className={`block w-full rounded-xl shadow-sm sm:text-sm p-3.5 transition-all outline-none border-2 ${touched.name && errors.name ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100'}`}
                                    value={reviewForm.name}
                                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                                    onBlur={() => setTouched({...touched, name: true})}
                                    placeholder="Jane Doe"
                                />
                                {touched.name && errors.name && <p className="mt-2 flex items-center text-xs text-red-600 font-bold"><AlertCircle className="w-3 h-3 mr-1" /> {errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Rating</label>
                                <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                                            className="focus:outline-none group/star"
                                            aria-label={`Rate ${star} out of 5 stars`}
                                        >
                                            <Star 
                                                className={`w-8 h-8 transition-all transform group-hover/star:scale-125 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Your Experience</label>
                                <textarea 
                                    id="comment"
                                    rows={4}
                                    className={`block w-full rounded-xl shadow-sm sm:text-sm p-3.5 transition-all outline-none border-2 ${touched.comment && errors.comment ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100'}`}
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                    onBlur={() => setTouched({...touched, comment: true})}
                                    placeholder="What made this product stand out for you?"
                                />
                                {touched.comment && errors.comment && <p className="mt-2 flex items-center text-xs text-red-600 font-bold"><AlertCircle className="w-3 h-3 mr-1" /> {errors.comment}</p>}
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmittingReview || !isFormValid}
                                className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-600/20 active:translate-y-0.5"
                            >
                                {isSubmittingReview ? <RefreshCcw className="w-6 h-6 animate-spin mx-auto" /> : 'Post Review'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Reviews List */}
                <div className="lg:col-span-8 mt-12 lg:mt-0">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">{reviews.length} Total Reviews</span>
                        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <Filter className="w-4 h-4 text-gray-400 mr-2" />
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="text-xs border-none focus:ring-0 text-gray-700 font-bold cursor-pointer bg-transparent"
                            >
                                <option value="newest">Recent First</option>
                                <option value="highest">Highest Rated</option>
                                <option value="lowest">Lowest Rated</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {sortedReviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-black border-2 border-primary-100">
                                            {review.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-base font-black text-gray-900">{review.userName}</h3>
                                                {review.verified && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-green-50 text-green-700 border border-green-100">
                                                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 bg-gray-50 px-2.5 py-1 rounded-lg">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed italic text-base">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-24 border-t border-gray-100 pt-16 pb-12">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 font-heading">Complete the Look</h2>
                  <button onClick={onBack} className="text-sm font-bold text-primary-600 hover:underline">View All Collection</button>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((rel) => (
                        <div 
                          key={rel.id} 
                          className="group relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer" 
                          onClick={() => onViewProduct(rel.id)}
                        >
                            <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                                <img src={rel.image} alt={`Related product: ${rel.name} in ${rel.category}`} className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{rel.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">{rel.category}</p>
                                <p className="text-lg font-black text-gray-900 mt-2">₹{rel.price}</p>
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

export default ProductDetail;
