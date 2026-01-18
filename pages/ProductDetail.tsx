import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { GoogleGenAI } from "@google/genai";
import { Star, ShoppingCart, ArrowLeft, Heart, ChevronLeft, ChevronRight, Facebook, Twitter, MessageCircle, Check, ShieldCheck, Filter, AlertCircle, CheckCircle2, Maximize2, X, ExternalLink, Sparkles, Upload, Plus, ZoomIn, RefreshCcw, ArrowRight as ArrowRightIcon, ChevronDown, ImageIcon, Send, Truck, Lock } from 'lucide-react';

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
  timestamp: number;
  verified?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onViewProduct }) => {
  const { products, addToCart } = useStore();
  const product = products.find(p => p.id === productId);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  // AI Image State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Uploaded Images State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Review State
  const [reviews, setReviews] = useState<Review[]>([
      { id: '1', userName: 'John Doe', rating: 5, comment: 'Absolutely love this product! The quality is outstanding and it arrived earlier than expected.', date: '2 days ago', timestamp: Date.now() - 172800000, verified: true },
      { id: '2', userName: 'Jane Smith', rating: 4, comment: 'Great value for money. The color matches the photos perfectly.', date: '1 week ago', timestamp: Date.now() - 604800000, verified: true },
      { id: '3', userName: 'Mike Johnson', rating: 2, comment: 'The product is okay, but the packaging was slightly damaged upon arrival. Expected a bit more for the price.', date: '2 weeks ago', timestamp: Date.now() - 1209600000, verified: false }
  ]);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [touched, setTouched] = useState({ name: false, comment: false });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Sorting State
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Reset generated image and uploads when product changes
  useEffect(() => {
    setGeneratedImage(null);
    setUploadedImages([]);
    setActiveImage(0);
    setQuantity(1);
    setIsAdded(false);
    window.scrollTo(0, 0);
  }, [productId]);

  const images = useMemo(() => {
    if(!product) return [];
    // Start with the main product image
    const baseImages = [product.image];
    
    let combined = [...baseImages];
    
    // Add uploaded images
    if (uploadedImages.length > 0) {
        combined = [...combined, ...uploadedImages];
    }
    
    // Add generated image (highest priority if exists)
    if (generatedImage) {
        combined = [generatedImage, ...combined];
    }
    
    return combined;
  }, [product, generatedImage, uploadedImages]);

  // Related Products Logic
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  // Scroll thumbnail into view when active image changes
  useEffect(() => {
      if (thumbnailsRef.current) {
          const activeThumb = thumbnailsRef.current.children[activeImage] as HTMLElement;
          if (activeThumb) {
              activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
      }
  }, [activeImage]);

  const handleMouseLeave = () => {
    setZoomPos(prev => ({ ...prev, opacity: 0 }));
  };

  const handleNextImage = () => {
    handleMouseLeave();
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    handleMouseLeave();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle multiple file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        const readers = newFiles.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') resolve(reader.result);
                };
                reader.readAsDataURL(file as Blob);
            });
        });

        Promise.all(readers).then(results => {
            setUploadedImages(prev => [...results, ...prev]);
            // Switch to the newly uploaded image
            setActiveImage(generatedImage ? 2 : 1); 
        });
    }
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
      if (!isLightboxOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') setIsLightboxOpen(false);
          if (e.key === 'ArrowLeft') handlePrevImage();
          if (e.key === 'ArrowRight') handleNextImage();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeImage]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Product not found</h2>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go back to shop
        </button>
      </div>
    );
  }

  // Real-time Validation Logic
  const validationErrors = {
    name: touched.name && reviewForm.name.trim().length < 2 ? 'Identity must be at least 2 characters' : null,
    comment: touched.comment && reviewForm.comment.trim().length < 10 ? 'Perspective must be at least 10 characters' : null,
  };

  const isFormValid = reviewForm.name.trim().length >= 2 && reviewForm.comment.trim().length >= 10;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, opacity: 1 });
  };

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
      if (sortBy === 'newest') return sorted.sort((a, b) => b.timestamp - a.timestamp);
      return sorted;
  }, [reviews, sortBy]);

  const handleAddToCart = () => {
    if (isAdded) return;
    addToCart(product, quantity, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleGenerateAIImage = async () => {
    if (!product || isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Professional e-commerce product photography of ${product.name} (${product.category}). ${product.description}.
        
        Specifications for Commercial Appeal:
        - Lighting: Soft, diffused studio lighting with gentle rim light to accentuate edges and texture. Avoid harsh shadows.
        - Composition: Perfectly centered subject, front-facing view, filling approximately 80% of the frame.
        - Camera: 50mm to 85mm lens equivalent (portrait focal length) to minimize distortion and provide a natural, flattering perspective. Aperture f/8 for sharp focus across the entire product.
        - Background: Clean, solid white (#FFFFFF) or extremely light neutral grey background to ensure focus remains on the product.
        - Style: High-end, minimalist, clean, photorealistic, 8k resolution. No text, no watermarks, no distracting elements.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
        });

        let foundImage = false;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64Image = `data:image/png;base64,${part.inlineData.data}`;
                setGeneratedImage(base64Image);
                setActiveImage(0);
                foundImage = true;
                break;
            }
        }
        
        if (!foundImage) {
            alert("AI could not generate an image at this time. Please try again.");
        }
    } catch (error) {
        console.error("AI Image Generation Failed:", error);
        alert("Failed to generate image. Please ensure your API key is configured.");
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
          setTouched({ name: true, comment: true });
          return;
      }
      setIsSubmittingReview(true);
      setTimeout(() => {
          const newReview: Review = {
              id: Math.random().toString(36).substr(2, 9),
              userName: reviewForm.name,
              rating: reviewForm.rating,
              comment: reviewForm.comment,
              date: 'Just now',
              timestamp: Date.now(),
              verified: true 
          };
          setReviews([newReview, ...reviews]);
          setReviewForm({ name: '', rating: 5, comment: '' });
          setTouched({ name: false, comment: false });
          setIsSubmittingReview(false);
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 5000);
      }, 1200);
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this ${product.name} at Bharat E Mart! Only ₹${product.price}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const isMeesho = product.affiliateLink?.toLowerCase().includes('meesho');
  const affiliateButtonText = isMeesho ? 'Buy Now on Meesho' : 'Buy Now';
  const affiliateButtonClass = "w-full flex items-center justify-center py-4 rounded-xl text-white text-lg font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] bg-[#7b2cbf] hover:bg-[#6a25a5] shadow-[#7b2cbf]/30";

  return (
    <div className="bg-white min-h-screen pb-12 font-sans animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Global Disclosure */}
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-8 flex items-start animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-primary-900 font-medium">
                <strong>Disclosure:</strong> This post contains affiliate links. If you purchase through them, we may earn a commission at no extra cost to you.
            </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 mb-16">
          <div className="product-images">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden mb-6 group shadow-2xl border border-slate-100 cursor-crosshair ring-1 ring-slate-900/5 bg-white"
            >
              {/* Main Upload Button (Top Left) */}
              <label className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-md text-slate-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2 border border-white/50 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                  <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload}
                  />
              </label>

              {/* AI Generation Button Overlay */}
              <button 
                onClick={(e) => { e.stopPropagation(); handleGenerateAIImage(); }}
                disabled={isGeneratingImage}
                className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-md text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2 border border-white/50"
                title="Generate a realistic product view using AI"
              >
                  <Sparkles className={`w-3 h-3 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                  {isGeneratingImage ? 'Enhancing...' : (generatedImage ? 'Regenerate AI' : 'Visualize AI')}
              </button>

              {/* Stacked Images for Fade Transition */}
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                    activeImage === idx 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-110 z-0'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} - View ${idx + 1}`} 
                    className="w-full h-full object-center object-cover"
                  />
                </div>
              ))}
              
              {/* Zoom Lens Overlay - Optimized Display */}
              <div 
                className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300 ease-out bg-white"
                role="img"
                aria-label={`${product.name} zoomed view`}
                style={{
                  opacity: zoomPos.opacity,
                  backgroundImage: `url(${images[activeImage]})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Added hint for Zoom */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center mt-12 mr-1">
                  <ZoomIn className="w-3 h-3 mr-1" /> Hover to Zoom
              </div>

              {/* Gallery Controls Overlay */}
              <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-6">
                 <div className="flex justify-between items-start">
                     <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {activeImage + 1} / {images.length}
                     </span>
                     <button 
                        onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                        className="pointer-events-auto p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-300"
                        title="View Fullscreen"
                     >
                         <Maximize2 className="w-5 h-5" />
                     </button>
                 </div>
                 
                 <div className="flex justify-between items-center w-full px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} 
                      className="pointer-events-auto p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-slate-700 hover:text-indigo-600 hover:bg-white hover:scale-110 transition-all active:scale-95"
                    >
                       <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }} 
                      className="pointer-events-auto p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-slate-700 hover:text-indigo-600 hover:bg-white hover:scale-110 transition-all active:scale-95"
                    >
                       <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
                 
                 <div className="h-6"></div> {/* Spacer */}
              </div>
            </div>

            {/* Thumbnail Carousel Section */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-4 px-1">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-indigo-600 w-2 h-2 rounded-full"></span>
                        Gallery & Uploads
                     </h3>
                     <label className="cursor-pointer text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileUpload}
                        />
                     </label>
                </div>

                <div className="relative group">
                    <style>{`
                         .scrollbar-hide::-webkit-scrollbar {
                             display: none;
                         }
                         .scrollbar-hide {
                             -ms-overflow-style: none;
                             scrollbar-width: none;
                         }
                       `}</style>
                    <div 
                      ref={thumbnailsRef}
                      className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {images.map((img, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setActiveImage(idx)}
                          aria-label={`Show ${product.name} view ${idx + 1}`}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden snap-center transition-all duration-300 ${
                            activeImage === idx 
                              ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 shadow-md z-10' 
                              : 'opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-sm ring-1 ring-slate-200'
                          }`}
                        >
                          <img src={img} alt={`${product.name} view ${idx + 1} thumbnail`} className="w-full h-full object-cover" />
                          {activeImage !== idx && <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />}
                        </button>
                      ))}

                      {/* Add Image Button in Carousel */}
                      <label className="relative flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer snap-center bg-slate-50">
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Add</span>
                          <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleFileUpload}
                          />
                      </label>
                    </div>
                    
                    {/* Carousel Fade Edges */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 font-heading mb-3">{product.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                    {product.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                    <button 
                      aria-label="Add to wishlist"
                      className="p-3 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                        <Heart className="w-6 h-6" />
                    </button>
                </div>
            </div>
            
            <div className="mt-6 flex items-baseline space-x-4">
               <p className="text-5xl font-black text-slate-900">₹{product.price}</p>
               <span className="text-sm text-slate-500 font-medium">+18% GST incl.</span>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Description</h3>
                <div 
                    className="text-base text-slate-600 space-y-4 leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                />
            </div>

            <div className="mt-8 border-t border-slate-100 pt-8">
                 <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-bold">In Stock</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm">2 Year Warranty</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500">
                        <Truck className="w-4 h-4" />
                        <span className="text-sm">Free Delivery</span>
                    </div>
                 </div>

                 {product.affiliateLink ? (
                     <a 
                       href={product.affiliateLink}
                       target="_blank"
                       rel="noopener noreferrer"
                       className={affiliateButtonClass}
                     >
                         {affiliateButtonText} <ExternalLink className="ml-2 w-5 h-5" />
                     </a>
                 ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center border border-slate-300 rounded-xl">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-l-xl transition-colors"
                            >
                                -
                            </button>
                            <span className="px-4 font-bold text-slate-900">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-r-xl transition-colors"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded || product.stock === 0}
                            className={`flex-1 py-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${
                                isAdded 
                                ? 'bg-green-600 shadow-green-500/30' 
                                : product.stock === 0
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                            }`}
                        >
                            {isAdded ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" /> Added to Cart
                                </>
                            ) : product.stock === 0 ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                                </>
                            )}
                        </button>
                    </div>
                 )}
            </div>

            <div className="mt-8 flex items-center space-x-4 text-sm text-slate-500 border-t border-slate-100 pt-8">
                <span className="font-bold uppercase tracking-wider text-xs">Share:</span>
                <button onClick={() => window.open(whatsappUrl, '_blank')} className="hover:text-[#25D366] transition-colors" title="Share on WhatsApp"><MessageCircle className="w-5 h-5" /></button>
                <button onClick={() => window.open(facebookUrl, '_blank')} className="hover:text-[#1877F2] transition-colors" title="Share on Facebook"><Facebook className="w-5 h-5" /></button>
                <button onClick={() => window.open(twitterUrl, '_blank')} className="hover:text-[#1DA1F2] transition-colors" title="Share on Twitter"><Twitter className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
            <div className="mb-24 pt-10 border-t border-slate-200">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 font-heading">Related Products</h2>
                    <div className="flex space-x-2">
                        <button className="hidden md:flex p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                         <button className="hidden md:flex p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                 </div>
                 
                 <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-4 md:gap-6 md:pb-0 scrollbar-hide">
                    {relatedProducts.map((relProduct) => (
                        <div 
                            key={relProduct.id}
                            onClick={() => onViewProduct(relProduct.id)}
                            className="group cursor-pointer flex-shrink-0 w-64 md:w-auto snap-center"
                        >
                            <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden mb-3 relative border border-slate-100">
                                <img 
                                    src={relProduct.image} 
                                    alt={relProduct.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                <button className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                                    <ShoppingCart className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{relProduct.name}</h3>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-slate-500 text-sm font-medium">₹{relProduct.price}</p>
                                <div className="flex items-center text-xs text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="ml-1 text-slate-400">{relProduct.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        )}

        {/* Reviews Section */}
        <div className="border-t border-slate-200 pt-16 mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
               <h2 className="text-2xl font-black text-slate-900 font-heading mb-2">Customer Feedback</h2>
               <div className="flex items-center space-x-2">
                   <div className="flex text-yellow-400">
                       {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-slate-200'}`} />
                       ))}
                   </div>
                   <span className="text-lg font-bold text-slate-900">{averageRating.toFixed(1)}</span>
                   <span className="text-slate-500">based on {reviews.length} reviews</span>
               </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
               <span className="text-sm font-medium text-slate-500">Sort reviews by:</span>
               <div className="relative group">
                   <select 
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value as any)}
                       className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                   >
                       <option value="newest">Newest First</option>
                       <option value="highest">Highest Rated</option>
                       <option value="lowest">Most Critical</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             {/* Review Form & Stats */}
             <div className="lg:col-span-4 space-y-8">
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <h3 className="font-bold text-slate-900 mb-4">Rating Breakdown</h3>
                     <div className="space-y-3">
                         {[5, 4, 3, 2, 1].map((star) => (
                             <div key={star} className="flex items-center text-sm">
                                 <span className="w-3 font-medium text-slate-600">{star}</span>
                                 <Star className="w-3 h-3 text-yellow-400 fill-current mx-1" />
                                 <div className="flex-1 h-2 bg-slate-200 rounded-full mx-2 overflow-hidden">
                                     <div 
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${(ratingDistribution[star as keyof typeof ratingDistribution] / reviews.length) * 100 || 0}%` }}
                                     ></div>
                                 </div>
                                 <span className="w-8 text-right text-slate-400">{ratingDistribution[star as keyof typeof ratingDistribution]}</span>
                             </div>
                         ))}
                     </div>
                 </div>

                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-1">Write a Review</h3>
                     <p className="text-sm text-slate-500 mb-4">Share your thoughts with other customers.</p>
                     
                     <form onSubmit={handleReviewSubmit} className="space-y-4">
                         <div>
                             <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                             <input 
                                type="text" 
                                className={`w-full bg-slate-50 border ${validationErrors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all`}
                                placeholder="John Doe"
                                value={reviewForm.name}
                                onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                                onBlur={() => setTouched({...touched, name: true})}
                             />
                             {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                         </div>
                         
                         <div>
                             <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Rating</label>
                             <div className="flex space-x-1">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                     <button
                                        type="button"
                                        key={star}
                                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                                        className="focus:outline-none transition-transform active:scale-90"
                                     >
                                         <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-slate-200 hover:text-yellow-200'}`} />
                                     </button>
                                 ))}
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Review</label>
                             <textarea 
                                rows={4}
                                className={`w-full bg-slate-50 border ${validationErrors.comment ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all resize-none`}
                                placeholder="Tell us what you liked or didn't like..."
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                onBlur={() => setTouched({...touched, comment: true})}
                             ></textarea>
                             {validationErrors.comment && <p className="text-red-500 text-xs mt-1">{validationErrors.comment}</p>}
                         </div>

                         <button 
                            type="submit"
                            disabled={!isFormValid || isSubmittingReview}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
                         >
                             {isSubmittingReview ? (
                                 <RefreshCcw className="w-4 h-4 animate-spin" />
                             ) : (
                                 <>
                                    <Send className="w-4 h-4 mr-2" /> Submit Review
                                 </>
                             )}
                         </button>
                         {showSuccessMessage && (
                             <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center animate-in fade-in slide-in-from-top-2">
                                 <CheckCircle2 className="w-4 h-4 mr-2" /> Review submitted successfully!
                             </div>
                         )}
                     </form>
                 </div>
             </div>

             {/* Reviews List */}
             <div className="lg:col-span-8 space-y-6">
                 {sortedReviews.map((review) => (
                     <div key={review.id} className="bg-white border-b border-slate-100 pb-6 last:border-0 animate-in fade-in slide-in-from-bottom-2">
                         <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center space-x-3">
                                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                                     {review.userName.charAt(0)}
                                 </div>
                                 <div>
                                     <h4 className="text-sm font-bold text-slate-900">{review.userName}</h4>
                                     <div className="flex items-center text-xs text-slate-400">
                                         <span>{review.date}</span>
                                         {review.verified && (
                                             <>
                                                <span className="mx-1.5">•</span>
                                                <span className="text-green-600 flex items-center">
                                                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified Purchase
                                                </span>
                                             </>
                                         )}
                                     </div>
                                 </div>
                             </div>
                             <div className="flex text-yellow-400">
                                 {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                 ))}
                             </div>
                         </div>
                         <p className="text-slate-600 text-sm leading-relaxed pl-14">
                             {review.comment}
                         </p>
                     </div>
                 ))}
                 
                 {sortedReviews.length === 0 && (
                     <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                         <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                         <p>No reviews yet. Be the first to share your thoughts!</p>
                     </div>
                 )}
             </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
              <button 
                  onClick={() => setIsLightboxOpen(false)}
                  className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                  <X className="w-8 h-8" />
              </button>
              
              <button 
                  onClick={handlePrevImage}
                  className="absolute left-6 text-white/50 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
              >
                  <ChevronLeft className="w-10 h-10" />
              </button>
              
              <img 
                  src={images[activeImage]} 
                  alt="Fullscreen view" 
                  className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-lg"
              />

              <button 
                  onClick={handleNextImage}
                  className="absolute right-6 text-white/50 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
              >
                  <ChevronRight className="w-10 h-10" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, idx) => (
                      <div 
                          key={idx} 
                          className={`w-2 h-2 rounded-full transition-all ${idx === activeImage ? 'bg-white scale-125' : 'bg-white/30'}`}
                      />
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ProductDetail;