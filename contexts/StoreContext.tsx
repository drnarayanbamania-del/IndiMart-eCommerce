import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, UserRole, Category } from '../types';

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Leather Watch', description: 'Elegant minimalist design with genuine leather strap.', price: 1299, category: 'Accessories', image: 'https://picsum.photos/400/400?random=1', stock: 50, rating: 4.5, reviews: 12 },
  { id: '2', name: 'Wireless Noise Cancelling Headphones', description: 'Immersive sound with 30-hour battery life.', price: 2999, category: 'Electronics', image: 'https://picsum.photos/400/400?random=2', stock: 25, rating: 4.8, reviews: 45 },
  { id: '3', name: 'Ergonomic Office Chair', description: 'Designed for comfort and productivity.', price: 1999, category: 'Furniture', image: 'https://picsum.photos/400/400?random=3', stock: 10, rating: 4.2, reviews: 8 },
  { id: '4', name: 'Smart Fitness Tracker', description: 'Track your health metrics in real-time.', price: 899, category: 'Electronics', image: 'https://picsum.photos/400/400?random=4', stock: 100, rating: 4.0, reviews: 30 },
  { id: '5', name: 'Designer Sunglasses', description: 'UV protection with a classic look.', price: 1500, category: 'Accessories', image: 'https://picsum.photos/400/400?random=5', stock: 15, rating: 4.7, reviews: 22 },
  { id: 'test-1', name: 'Test Payment Item', description: 'Product for testing payment gateway integration (1 INR).', price: 1, category: 'Test', image: 'https://placehold.co/400x400?text=Test+Item', stock: 999, rating: 5.0, reviews: 0 },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', image: 'https://picsum.photos/300/200?random=10' },
  { id: '2', name: 'Accessories', image: 'https://picsum.photos/300/200?random=11' },
  { id: '3', name: 'Furniture', image: 'https://picsum.photos/300/200?random=12' },
];

const INITIAL_USER: User = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@apnastore.com',
  password: 'password',
  role: UserRole.ADMIN
};

interface StoreContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('apnastore_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('apnastore_user', JSON.stringify(user));
    else localStorage.removeItem('apnastore_user');
  }, [user]);

  // Data State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('apnastore_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('apnastore_products', JSON.stringify(products));
  }, [products]);

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('apnastore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('apnastore_cart', JSON.stringify(cart));
  }, [cart]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const login = (email: string, password: string, role: UserRole) => {
    // Simulated login
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      password // storing password just for mock consistency
    });
  };

  const signup = (name: string, email: string, password: string) => {
    // Simulated Signup
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: UserRole.USER, // Default to Customer
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

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
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
    clearCart();
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
      isCartOpen, setIsCartOpen, resetProducts
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