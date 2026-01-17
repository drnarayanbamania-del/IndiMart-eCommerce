import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, UserRole, Category } from '../types';

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Leather Watch', description: 'Elegant minimalist design with genuine leather strap.', price: 1299, category: 'Accessories', image: 'https://picsum.photos/400/400?random=1', stock: 50, rating: 4.5, reviews: 12 },
  { id: '2', name: 'Wireless Noise Cancelling Headphones', description: 'Immersive sound with 30-hour battery life.', price: 2999, category: 'Electronics', image: 'https://picsum.photos/400/400?random=2', stock: 25, rating: 4.8, reviews: 45, affiliateLink: 'https://amazon.com' },
  { id: '3', name: 'Ergonomic Office Chair', description: 'Designed for comfort and productivity.', price: 1999, category: 'Furniture', image: 'https://picsum.photos/400/400?random=3', stock: 10, rating: 4.2, reviews: 8 },
  { id: '4', name: 'Smart Fitness Tracker', description: 'Track your health metrics in real-time.', price: 899, category: 'Electronics', image: 'https://picsum.photos/400/400?random=4', stock: 100, rating: 4.0, reviews: 30 },
  { id: '5', name: 'Designer Sunglasses', description: 'UV protection with a classic look.', price: 1500, category: 'Accessories', image: 'https://picsum.photos/400/400?random=5', stock: 15, rating: 4.7, reviews: 22 },
  { id: '6', name: 'Ultra-Slim Laptop Pro', description: 'High performance meets portability. 16GB RAM, 512GB SSD.', price: 54999, category: 'Computers', image: 'https://picsum.photos/400/400?random=6', stock: 8, rating: 4.9, reviews: 15 },
  { id: '7', name: 'Smart Inverter Refrigerator', description: 'Energy efficient cooling with auto-defrost technology.', price: 22499, category: 'Home Appliances', image: 'https://picsum.photos/400/400?random=7', stock: 12, rating: 4.6, reviews: 34 },
  { id: 'test-1', name: 'Test Payment Item', description: 'Product for testing payment gateway integration (1 INR).', price: 1, category: 'Test', image: 'https://placehold.co/400x400?text=Test+Item', stock: 999, rating: 5.0, reviews: 0 },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', image: 'https://picsum.photos/300/200?random=10' },
  { id: '2', name: 'Accessories', image: 'https://picsum.photos/300/200?random=11' },
  { id: '3', name: 'Furniture', image: 'https://picsum.photos/300/200?random=12' },
  { id: '4', name: 'Computers', image: 'https://picsum.photos/300/200?random=13' },
  { id: '5', name: 'Home Appliances', image: 'https://picsum.photos/300/200?random=14' },
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
  placeOrder: (details: { address: string }) => void;
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

  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [voiceRequest, setVoiceRequest] = useState<VoiceRequest | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const hideNotification = () => setNotification(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Check if trying to login as admin but email doesn't match
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

  const placeOrder = (details: { address: string }) => {
    if (!user) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      date: new Date().toISOString()
    };
    setOrders([newOrder, ...orders]);
    // clearCart(); // Removed to persist items until user manually deletes them
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