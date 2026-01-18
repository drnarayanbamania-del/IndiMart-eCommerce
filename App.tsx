import React, { useState } from 'react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import VoiceAssistant from './components/VoiceAssistant';
import AdBanner from './components/AdBanner';
import SaleBanner from './components/SaleBanner';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import { UserRole } from './types';
import { CreditCard, Truck, Banknote, ShieldCheck, Lock, CheckCircle, AlertCircle, ShoppingCart, ExternalLink, Instagram, Facebook, Twitter, X as XIcon, Phone } from 'lucide-react';

// Toast Notification Component
const NotificationToast = () => {
    const { notification, hideNotification } = useStore();

    if (!notification) return null;

    const bgColors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-white" />,
        error: <AlertCircle className="w-5 h-5 text-white" />,
        info: <AlertCircle className="w-5 h-5 text-white" />
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-5 duration-300">
            <div className={`${bgColors[notification.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 pr-10 relative`}>
                {icons[notification.type]}
                <p className="font-medium text-sm">{notification.message}</p>
                <button 
                    onClick={hideNotification}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Login / Sign Up Component
const Login = ({ onLogin, targetPage }: { onLogin: () => void, targetPage?: string }) => {
  const { login, signup } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict 6-character password validation
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    if (isLogin) {
      const success = login(email, password, role);
      if (!success) {
        setError("Unauthorized: Invalid credentials or incorrect role.");
        return;
      }
    } else {
      signup(name, email, password);
    }
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
             <Lock className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to Shop' : 'Create Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {targetPage 
                ? `You must be logged in to access ${targetPage.replace('_', ' ')}.` 
                : (isLogin ? "Welcome back! Please enter your details." : "Join us today to start shopping.")}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center animate-pulse">
              <AlertCircle className="w-4 h-4 mr-2" /> {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${isLogin ? 'rounded-t-md' : ''}`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${isLogin ? 'rounded-b-md' : (!isLogin ? '' : 'rounded-b-md')}`}
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isLogin && (
              <div>
                 <select
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                   value={role}
                   onChange={(e) => setRole(e.target.value as UserRole)}
                   title="Select Role"
                 >
                   <option value={UserRole.USER}>Login as User</option>
                   <option value={UserRole.ADMIN}>Login as Admin</option>
                 </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-primary-500 group-hover:text-primary-400" aria-hidden="true" />
              </span>
              {isLogin ? 'Secure Sign in' : 'Create Secure Account'}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setRole(UserRole.USER); setError(null); }}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserDashboard = () => {
    const { orders } = useStore();
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">My Dashboard</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Order History</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Details of your past purchases.</p>
                </div>
                <div className="border-t border-gray-200">
                     {orders.length > 0 ? (
                         <ul className="divide-y divide-gray-200">
                             {orders.map((order) => (
                                 <li key={order.id} className="px-4 py-4 sm:px-6">
                                     <div className="flex items-center justify-between">
                                         <p className="text-sm font-medium text-primary-600 truncate">Order #{order.id}</p>
                                         <div className="ml-2 flex-shrink-0 flex">
                                             <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{order.status}</p>
                                         </div>
                                     </div>
                                     <div className="mt-2 sm:flex sm:justify-between">
                                         <div className="sm:flex">
                                             <p className="flex items-center text-sm text-gray-500">
                                                 Total: ₹{order.total.toFixed(2)}
                                             </p>
                                         </div>
                                         <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                             <p>Placed on {new Date(order.date).toLocaleDateString()}</p>
                                         </div>
                                     </div>
                                     {order.shippingDetails && (
                                         <div className="mt-2 text-xs text-gray-400">
                                             <p>Shipping to: {order.shippingDetails.name}</p>
                                             <p>Phone: {order.shippingDetails.phone}</p>
                                             <p>Address: {order.shippingDetails.address}</p>
                                         </div>
                                     )}
                                 </li>
                             ))}
                         </ul>
                     ) : (
                         <div className="p-6 text-center text-gray-500">No orders yet.</div>
                     )}
                </div>
            </div>
        </div>
    )
}

const Checkout = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const { cart, placeOrder } = useStore();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
    
    // State to hold form data temporarily for online payment flow
    const [tempOrderDetails, setTempOrderDetails] = useState<any>(null);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500
    const total = subtotal + shipping;

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const orderDetails = {
            firstName: formData.get('first-name') as string,
            lastName: formData.get('last-name') as string,
            email: formData.get('email-address') as string,
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
            city: formData.get('city') as string,
            zip: formData.get('postal-code') as string,
        };
        
        // Save to state so it persists when modal opens
        setTempOrderDetails(orderDetails);

        const processOrderSuccess = (paymentId: string) => {
             const sheetData = {
                "First Name": orderDetails.firstName,
                "Last Name": orderDetails.lastName,
                "Email": orderDetails.email,
                "Mobile Number": orderDetails.phone,
                "Street Address": orderDetails.address,
                "City": orderDetails.city,
                "Zip": orderDetails.zip,
                "Product Name": cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
                "Total Amount": total.toFixed(2),
                "Order Date": new Date().toLocaleString(),
                "Payment ID": paymentId,
                "Method": paymentMethod === 'cod' ? 'COD' : 'Razorpay Online'
            };
            
            fetch('https://script.google.com/macros/s/AKfycbyfjw6EEDpNk0za4YWldI7ul0Nd4qZVkNL3pS4lotwBlm4N-pyIi_ZIGmu4-Nt7GAwv0w/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(sheetData)
            }).catch(console.error);

            // Construct full address to ensure city and zip are saved
            const fullAddress = `${orderDetails.address}, ${orderDetails.city} - ${orderDetails.zip}`;

            placeOrder({ 
                address: fullAddress, 
                phone: orderDetails.phone, 
                name: `${orderDetails.firstName} ${orderDetails.lastName}` 
            });
            setLoading(false);
            setOrderSuccess(true);
            
            setTimeout(() => {
                setOrderSuccess(false);
                onNavigate('home');
            }, 3500);
        };

        if (paymentMethod === 'cod') {
            setLoading(true);
            setTimeout(() => {
                 processOrderSuccess('COD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
            }, 1500);
        } else {
            // Open the Razorpay link
            window.open('https://razorpay.me/@wonderimggen?amount=EPec5evqGoRk2C8icWNJlQ%3D%3D', '_blank');
            setShowPaymentConfirm(true);
        }
    }

    const confirmOnlinePayment = () => {
        setLoading(true);
        setShowPaymentConfirm(false);
        
        // Use the saved state instead of trying to scrape the DOM again
        if (!tempOrderDetails) {
            setLoading(false);
            return; 
        }

        // Simulate verification
        setTimeout(() => {
            const paymentId = 'RZP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            const { firstName, lastName, email, phone, address, city, zip } = tempOrderDetails;
            
            const sheetData = {
                "First Name": firstName,
                "Last Name": lastName,
                "Email": email,
                "Mobile Number": phone,
                "Street Address": address,
                "City": city,
                "Zip": zip,
                "Product Name": cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
                "Total Amount": total.toFixed(2),
                "Order Date": new Date().toLocaleString(),
                "Payment ID": paymentId,
                "Method": 'Razorpay Online'
            };
            
            fetch('https://script.google.com/macros/s/AKfycbyfjw6EEDpNk0za4YWldI7ul0Nd4qZVkNL3pS4lotwBlm4N-pyIi_ZIGmu4-Nt7GAwv0w/exec', {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(sheetData)
            }).catch(console.error);

            // Construct full address including City and Zip
            const fullAddress = `${address}, ${city} - ${zip}`;

            placeOrder({ 
                address: fullAddress, 
                phone: phone, 
                name: `${firstName} ${lastName}`
            });
            setLoading(false);
            setOrderSuccess(true);
            setTimeout(() => onNavigate('home'), 3500);
        }, 2000);
    };

    if(cart.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
                <ShoppingCart className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => onNavigate('shop')} className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
                Start Shopping
            </button>
        </div>
    );

    if (orderSuccess) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500 bg-white">
                <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
                    <CheckCircle className="w-20 h-20 text-green-600" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-8 text-center max-w-md">Thank you for your purchase. We have received your order and are preparing it for shipment.</p>
                <div className="flex items-center text-sm text-primary-600 font-medium bg-primary-50 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2 animate-pulse"></span>
                    Redirecting to home...
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 font-heading mb-8">Checkout</h1>
                
                <form className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16" onSubmit={handlePlaceOrder}>
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                                <Truck className="w-5 h-5 text-primary-600 mr-2" />
                                <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
                             </div>
                            
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                                    <input type="text" id="first-name" name="first-name" autoComplete="given-name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" required />
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                                    <input type="text" id="last-name" name="last-name" autoComplete="family-name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
                                    <input type="email" id="email-address" name="email-address" autoComplete="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">+91</span>
                                        </div>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            name="phone" 
                                            autoComplete="tel" 
                                            pattern="[6-9][0-9]{9}" 
                                            maxLength={10} 
                                            placeholder="10 digit mobile number"
                                            title="Please enter a valid 10-digit Indian mobile number"
                                            className="block w-full pl-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street address</label>
                                    <input type="text" name="address" id="address" autoComplete="street-address" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" required />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="city" id="city" autoComplete="address-level2" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" required />
                                </div>
                                <div>
                                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                                    <input type="text" name="postal-code" id="postal-code" autoComplete="postal-code" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 border" required />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                                <CreditCard className="w-5 h-5 text-primary-600 mr-2" />
                                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                             </div>

                             <div className="space-y-4">
                                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment-method" 
                                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                    />
                                    <div className="ml-3 flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <span className="block text-sm font-medium text-gray-900">Pay via Razorpay</span>
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Link
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 text-gray-400">
                                             <CreditCard className="w-5 h-5" />
                                        </div>
                                    </div>
                                </label>

                                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment-method" 
                                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <div className="ml-3 flex items-center">
                                        <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                                        <Banknote className="ml-auto w-5 h-5 text-gray-400" />
                                    </div>
                                </label>
                             </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden lg:sticky lg:top-24">
                            <div className="p-6 bg-gray-50 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                            </div>
                            
                            <div className="p-6">
                                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto pr-2">
                                    {cart.map((product) => (
                                        <li key={product.id} className="flex py-4">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="line-clamp-1 mr-2">{product.name}</h3>
                                                        <p className="whitespace-nowrap">₹{(product.price * product.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <p className="text-gray-500">Qty {product.quantity}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <p>Subtotal</p>
                                        <p>₹{subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <p>Shipping</p>
                                        <p>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping.toFixed(2)}`}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base font-bold text-gray-900">Total Amount</dt>
                                        <dd className="text-xl font-bold text-primary-600">₹{total.toFixed(2)}</dd>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="mt-8 w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <Lock className="w-4 h-4 mr-2" />
                                            {paymentMethod === 'cod' ? 'Place COD Order' : 'Pay & Place Order'}
                                            {paymentMethod === 'online' && <ExternalLink className="w-4 h-4 ml-2" />}
                                        </span>
                                    )}
                                </button>
                                
                                <div className="mt-4 flex flex-col items-center justify-center space-y-2">
                                     <div className="flex items-center text-xs text-gray-500 space-x-2">
                                         <ShieldCheck className="w-4 h-4 text-green-500" />
                                         <span>Payments are secure and encrypted via Razorpay.</span>
                                     </div>
                                     <img src="https://admin.razorpay.com/p/payment-badges/badge-dark.png" alt="Razorpay Trusted" className="h-6 opacity-70" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Payment Confirmation Modal */}
            {showPaymentConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in duration-300">
                        <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-10 h-10 text-primary-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Complete Your Payment</h3>
                        <p className="text-gray-600 mb-8">We've opened your payment page in a new window. Once you've completed the transaction, click the button below to confirm and place your order.</p>
                        <div className="space-y-3">
                            <button 
                                onClick={confirmOnlinePayment}
                                className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/25 transition-all"
                            >
                                I've Completed the Payment
                            </button>
                            <button 
                                onClick={() => setShowPaymentConfirm(false)}
                                className="w-full bg-white text-gray-500 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200"
                            >
                                Cancel Order
                            </button>
                        </div>
                        <p className="mt-6 text-xs text-gray-400">Order ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const AppContent = () => {
  const { user } = useStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product_detail');
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    // Auth Guard Wrapper
    const RequireAuth = (page: React.ReactNode, target: string) => {
        if (!user) {
            return (
                <div className="container mx-auto px-4 py-8 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 shadow-sm rounded-r-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Lock className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Authentication Required</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>Strict Security Mode Enabled: You must log in to access the {target.replace('_', ' ')} section.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Login onLogin={() => setCurrentPage(target)} targetPage={target} />
                </div>
            );
        }
        return page;
    }

    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} onViewProduct={navigateToProduct} />;
      // Protected Routes
      case 'shop': return RequireAuth(<Shop onViewProduct={navigateToProduct} />, 'shop');
      case 'product_detail': return RequireAuth(
          selectedProductId ? <ProductDetail productId={selectedProductId} onBack={() => setCurrentPage('shop')} onViewProduct={navigateToProduct} /> : <Shop onViewProduct={navigateToProduct} />,
          'product_detail'
      );
      case 'user_dashboard': return RequireAuth(<UserDashboard />, 'user_dashboard');
      case 'checkout': return RequireAuth(<Checkout onNavigate={setCurrentPage} />, 'checkout');
      // Public Routes
      case 'admin_dashboard': return <AdminDashboard />; // AdminDashboard handles its own check
      case 'login': return <Login onLogin={() => setCurrentPage('home')} />;
      case 'terms': return <Terms />;
      case 'privacy': return <Privacy />;
      case 'contact': return <Contact />;
      default: return <Home onNavigate={setCurrentPage} onViewProduct={navigateToProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SaleBanner />
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <NotificationToast />
      <CartDrawer onCheckout={() => setCurrentPage('checkout')} />
      <VoiceAssistant onNavigate={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <AdBanner />
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center mb-6">
                <span className="text-2xl font-black tracking-tighter uppercase font-heading">
                  <span className="text-orange-500">Bharat</span> <span className="text-blue-500">E</span> <span className="text-green-500">Mart</span>
                </span>
               </div>
               <p className="text-gray-400 text-sm italic mb-6">
                 "Elevating your lifestyle, one choice at a time."
               </p>
               <div className="flex space-x-4">
                  <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"><Facebook className="w-5 h-5" /></a>
                  <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"><Twitter className="w-5 h-5" /></a>
               </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6">Curated Collections</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">Electronics</button></li>
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">Accessories</button></li>
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">Home & Living</button></li>
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">New Arrivals</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6">Customer Care</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors">Shipping Policy</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors">Returns & Refunds</button></li>
                <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors">Secure Payments</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6">Stay Connected</h4>
              <p className="text-gray-400 text-sm mb-4">Join our inner circle for exclusive early access to curated collections.</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="bg-gray-800 border-none rounded-l-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary-500 w-full" />
                <button className="bg-primary-600 px-4 py-3 rounded-r-xl font-black text-xs uppercase hover:bg-primary-700 transition-all">Join</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Bharat E Mart. Curated Excellence.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
               <button onClick={() => setCurrentPage('privacy')} className="hover:text-white">Privacy</button>
               <button onClick={() => setCurrentPage('terms')} className="hover:text-white">Terms</button>
               <button onClick={() => setCurrentPage('privacy')} className="hover:text-white">Cookies</button>
               <button onClick={() => setCurrentPage('terms')} className="hover:text-white">Affiliate Disclosure</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;