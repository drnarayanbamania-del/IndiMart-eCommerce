import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Star, ShoppingCart, ArrowLeft, Heart, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, MessageCircle, Check } from 'lucide-react';
import { Product } from '../types';

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
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onViewProduct }) => {
  const { products, addToCart } = useStore();
  const product = products.find(p => p.id === productId);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Review State
  const [reviews, setReviews] = useState<Review[]>([
      { id: '1', userName: 'John Doe', rating: 5, comment: 'Absolutely love this product! The quality is outstanding.', date: '2 days ago' },
      { id: '2', userName: 'Jane Smith', rating: 4, comment: 'Great value for money, but shipping took a bit longer than expected.', date: '1 week ago' },
      { id: '3', userName: 'Mike Johnson', rating: 5, comment: 'Exceeded my expectations. Highly recommended!', date: '2 weeks ago' }
  ]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) {
    return <div className="p-8 text-center">Product not found. <button onClick={onBack} className="text-primary-600 underline">Go back</button></div>;
  }

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

  const handleNextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const handlePrevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++) addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!reviewForm.name || !reviewForm.comment) return;

      setIsSubmittingReview(true);
      
      // Simulate network delay
      setTimeout(() => {
          const newReview: Review = {
              id: Math.random().toString(36).substr(2, 9),
              userName: reviewForm.name,
              rating: reviewForm.rating,
              comment: reviewForm.comment,
              date: 'Just now'
          };
          setReviews([newReview, ...reviews]);
          setReviewForm({ name: '', rating: 5, comment: '' });
          setIsSubmittingReview(false);
      }, 600);
  };

  const shareUrl = window.location.href;
  const shareText = `Check out ${product.name} (₹${product.price}) on Apna Store!`;

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <div className="product-images">
            <div className="relative aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden mb-4 group">
              {images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${product.name} - Detailed view ${idx + 1} of ${images.length}`} 
                  className={`absolute inset-0 w-full h-full object-center object-cover transition-opacity duration-500 ease-in-out ${activeImage === idx ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              
              <button 
                onClick={handlePrevImage} 
                className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button 
                onClick={handleNextImage} 
                className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative rounded-md overflow-hidden aspect-w-1 aspect-h-1 ${activeImage === idx ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'}`}
                  aria-label={`View image ${idx + 1} of ${product.name}`}
                >
                  <img src={img} alt={`Thumbnail of ${product.name} - View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex justify-between relative">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">{product.name}</h1>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors" title="Add to Wishlist">
                        <Heart className="w-6 h-6" />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    {/* Social Share Buttons */}
                    <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Share on Facebook"
                    >
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-full transition-colors"
                        title="Share on Twitter"
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        title="Share on LinkedIn"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                        href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
                        title="Share on WhatsApp"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </a>
                </div>
            </div>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900 font-bold">₹{product.price}</p>
            </div>

            {/* Reviews Rating */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${
                        product.rating > rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-primary-600 hover:text-primary-500">
                  {product.reviews} reviews
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
                 <span className={`inline-block w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                 <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-32">
                      <label htmlFor="quantity" className="sr-only">Quantity</label>
                      <div className="flex items-center border border-gray-300 rounded-md">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
                          <input 
                            type="number" 
                            id="quantity" 
                            className="w-full text-center p-2 text-gray-900 focus:outline-none" 
                            value={quantity} 
                            readOnly 
                          />
                          <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
                      </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded || product.stock === 0}
                    className={`flex-1 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white shadow-lg transition-all duration-300 transform ${
                        isAdded 
                        ? 'bg-green-600 hover:bg-green-700 scale-105 shadow-green-500/30' 
                        : product.stock === 0 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 shadow-primary-500/30 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    }`}
                  >
                    {isAdded ? (
                        <>
                            <Check className="w-5 h-5 mr-2 animate-bounce" />
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </>
                    )}
                  </button>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-8">
                <p className="text-sm text-gray-500">Category: <span className="font-medium text-gray-900">{product.category}</span></p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-8">Customer Reviews</h2>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                {/* Review Form */}
                <div className="lg:col-span-4 mb-10 lg:mb-0">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                                <input 
                                    type="text" 
                                    id="name"
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border"
                                    value={reviewForm.name}
                                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                                            className="focus:outline-none transition-colors"
                                        >
                                            <Star 
                                                className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Review</label>
                                <textarea 
                                    id="comment"
                                    rows={4}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                    placeholder="Share your thoughts..."
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmittingReview}
                                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-8">
                    <div className="space-y-8">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="flex space-x-4 pb-8 border-b border-gray-100 last:border-0">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <span className="font-semibold text-sm">{review.userName.charAt(0).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-900">{review.userName}</h3>
                                            <p className="text-sm text-gray-500">{review.date}</p>
                                        </div>
                                        <div className="flex items-center mt-1 mb-2">
                                            {[...Array(5)].map((_, starIdx) => (
                                                <Star key={starIdx} className={`w-4 h-4 ${starIdx < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">Related Products</h2>
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {relatedProducts.map((relProduct) => (
                        <div 
                          key={relProduct.id} 
                          className="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer" 
                          onClick={() => onViewProduct(relProduct.id)}
                        >
                            <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
                                <img src={relProduct.image} alt={`Product image of ${relProduct.name}`} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700 font-medium">
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {relProduct.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{relProduct.category}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">₹{relProduct.price}</p>
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

export default ProductDetail;