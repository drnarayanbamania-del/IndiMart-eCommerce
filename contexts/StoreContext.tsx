import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, UserRole, Category } from '../types';

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Leather Watch', description: 'Elegant minimalist design with genuine leather strap.', price: 1299, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop', stock: 50, rating: 4.5, reviews: 12 },
  { id: '2', name: 'Wireless Noise Cancelling Headphones', description: 'Immersive sound with 30-hour battery life.', price: 2999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', stock: 25, rating: 4.8, reviews: 45, affiliateLink: 'https://amazon.com' },
  { id: '3', name: 'Ergonomic Office Chair', description: 'Designed for comfort and productivity.', price: 1999, category: 'Furniture', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop', stock: 10, rating: 4.2, reviews: 8 },
  { id: '4', name: 'Smart Fitness Tracker', description: 'Track your health metrics in real-time.', price: 899, category: 'Electronics', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop', stock: 100, rating: 4.0, reviews: 30 },
  { id: '5', name: 'Designer Sunglasses', description: 'UV protection with a classic look.', price: 1500, category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop', stock: 15, rating: 4.7, reviews: 22 },
  { id: '6', name: 'Ultra-Slim Laptop Pro', description: 'High performance meets portability. 16GB RAM, 512GB SSD.', price: 54999, category: 'Computers', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop', stock: 8, rating: 4.9, reviews: 15 },
  { id: '7', name: 'Smart Inverter Refrigerator', description: 'Energy efficient cooling with auto-defrost technology.', price: 22499, category: 'Home Appliances', image: 'https://images.unsplash.com/photo-1571175443880-49e1d58b794a?q=80&w=800&auto=format&fit=crop', stock: 12, rating: 4.6, reviews: 34 },
  { id: '8', name: 'Banarasi Silk Saree', description: 'Authentic Banarasi silk with zari work. Perfect for weddings.', price: 1499, category: 'Meesho Finds', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', stock: 20, rating: 4.3, reviews: 56, affiliateLink: 'https://www.meesho.com/sarees/p/abcde' },
  { id: '9', name: 'Rayon Printed Kurti', description: 'Comfortable daily wear printed kurti set.', price: 499, category: 'Meesho Finds', image: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=800&auto=format&fit=crop', stock: 50, rating: 4.1, reviews: 89, affiliateLink: 'https://www.meesho.com/kurtis/p/vwxyz' },
  { id: 'test-1', name: 'Test Payment Item', description: 'Product for testing payment gateway integration (1 INR).', price: 1, category: 'Test', image: 'https://placehold.co/400x400?text=Test+Item', stock: 999, rating: 5.0, reviews: 0 },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=800&auto=format&fit=crop' },
  { id: '2', name: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' },
  { id: '3', name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop' },
  { id: '4', name: 'Computers', image: 'https://images.unsplash.com/photo-1531297424005-06674ceb1d78?q=80&w=800&auto=format&fit=crop' },
  { id: '5', name: 'Home Appliances', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop' },
  { id: '6', name: 'Meesho Finds', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop' },
];

const ADMIN_EMAIL = 'drnarayanbamania@gmail.com';

export interface Notification {
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface VoiceRequest {
    query: string;
    category: string;
    sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating-desc';
    timestamp: number;
}

interface StoreContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (details: { address: string, phone: string, name: string }) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  categories: Category[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  resetProducts: () => void;
  notification: Notification | null;
  hideNotification: () => void;
  voiceRequest: VoiceRequest | null;
  setVoiceRequest: (req: VoiceRequest) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bharatemart_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('bharatemart_user', JSON.stringify(user));
    else localStorage.removeItem('bharatemart_user');
  }, [user]);

  // Data State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bharatemart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('bharatemart_products', JSON.stringify(products));
  }, [products]);

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bharatemart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bharatemart_cart', JSON.stringify(cart));
  }, [cart]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bharatemart_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bharatemart_orders', JSON.stringify(orders));
  }, [orders]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [voiceRequest, setVoiceRequest] = useState<VoiceRequest | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const hideNotification = () => setNotification(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    if (role === UserRole.ADMIN && email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return false;
    }

    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? UserRole.ADMIN : role,
      password
    });
    return true;
  };

  const signup = (name: string, email: string, password: string) => {
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? UserRole.ADMIN : UserRole.USER,
      password
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  }

  const addToCart = (product: Product, quantity: number = 1, openDrawer: boolean = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity: quantity }];
    });
    
    if (openDrawer) {
      setIsCartOpen(true);
    } else {
      showNotification(`${product.name} added to cart`);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (details: { address: string, phone: string, name: string }) => {
    if (!user) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      date: new Date().toISOString(),
      shippingDetails: {
          address: details.address,
          phone: details.phone,
          name: details.name
      }
    };
    setOrders([newOrder, ...orders]);
    // clearCart(); 
    showNotification("Order placed successfully!");
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <StoreContext.Provider value={{
      user, login, signup, logout,
      products, addProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      orders, placeOrder, updateOrderStatus,
      categories,
      isCartOpen, setIsCartOpen, resetProducts,
      notification, hideNotification,
      voiceRequest, setVoiceRequest
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
