import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onViewProduct: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onViewProduct }) => {
  const { products, addToCart } = useStore();
  const product = products.find(p => p.id === productId);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const shareUrl = window.location.href;
  const shareText = `Check out ${product.name} (₹${product.price}) on LuxeMart!`;

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
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-center object-cover"
              />
              <button onClick={handlePrevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button onClick={handleNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative rounded-md overflow-hidden aspect-w-1 aspect-h-1 ${activeImage === idx ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex justify-between relative">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">{product.name}</h1>
                <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50" title="Add to Wishlist"><Heart className="w-6 h-6" /></button>
                    
                    {/* Share Button Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="p-2 text-gray-400 hover:text-primary-500 rounded-full hover:bg-primary-50"
                            title="Share Product"
                        >
                            <Share2 className="w-6 h-6" />
                        </button>
                        
                        {showShareMenu && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-20 p-3 animate-in fade-in zoom-in duration-200">
                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider text-center">Share Via</p>
                                <div className="grid grid-cols-4 gap-2">
                                     <a 
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Share on Facebook"
                                     >
                                        <Facebook className="w-5 h-5" />
                                     </a>
                                     <a 
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center justify-center p-2 text-sky-500 hover:bg-sky-50 rounded-md transition-colors"
                                        title="Share on Twitter"
                                     >
                                        <Twitter className="w-5 h-5" />
                                     </a>
                                     <a 
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center justify-center p-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Share on LinkedIn"
                                     >
                                        <Linkedin className="w-5 h-5" />
                                     </a>
                                     <a 
                                        href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center justify-center p-2 text-green-500 hover:bg-green-50 rounded-md transition-colors"
                                        title="Share on WhatsApp"
                                     >
                                        <MessageCircle className="w-5 h-5" />
                                     </a>
                                </div>
                            </div>
                        )}
                    </div>
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
                    onClick={() => {
                        for(let i=0; i<quantity; i++) addToCart(product);
                    }}
                    className="flex-1 bg-primary-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-500/30 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
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
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">Customer Reviews</h2>
            <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-4">
                        <div className="flex-shrink-0">
                            <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/150?u=${productId}${i}`} alt="" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-900">User {i}</h3>
                                <p className="text-sm text-gray-500">2 days ago</p>
                            </div>
                            <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, starIdx) => (
                                    <Star key={starIdx} className={`w-4 h-4 ${starIdx < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                This product exceeded my expectations! The quality is amazing for the price. Would definitely recommend.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">Related Products</h2>
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {relatedProducts.map((relProduct) => (
                        <div key={relProduct.id} className="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => onViewProduct(relProduct.id)}>
                            <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
                                <img src={relProduct.image} alt={relProduct.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
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