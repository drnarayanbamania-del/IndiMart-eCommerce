import React, { useState } from 'react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import { UserRole } from './types';
import { CreditCard, Truck, Banknote, ShieldCheck, Lock, CheckCircle, AlertCircle, ShoppingCart, ExternalLink } from 'lucide-react';

// Login / Sign Up Component
const Login = ({ onLogin }: { onLogin: () => void }) => {
  const { login, signup } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password, role);
    } else {
      signup(name, email, password);
    }
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Welcome back! Please enter your details." : "Join us today to start shopping."}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${isLogin ? 'rounded-b-md' : (!isLogin ? '' : 'rounded-b-md')}`}
                placeholder="Password"
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
                   title="Select Role (Demo only)"
                 >
                   <option value={UserRole.USER}>Login as User</option>
                   <option value={UserRole.ADMIN}>Login as Admin</option>
                 </select>
                 <p className="text-xs text-gray-500 mt-1 px-1">Demo feature: Choose Admin to access Dashboard.</p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLogin ? 'Sign in' : 'Sign Up'}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setRole(UserRole.USER); }}
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

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500
    const total = subtotal + shipping;

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const orderDetails = {
            firstName: formData.get('first-name'),
            lastName: formData.get('last-name'),
            email: formData.get('email-address'),
            address: formData.get('address'),
            city: formData.get('city'),
            zip: formData.get('postal-code'),
        };

        const processOrderSuccess = (paymentId: string) => {
             // Log order to Google Sheets
             const sheetData = {
                "First Name": orderDetails.firstName,
                "Last Name": orderDetails.lastName,
                "Email": orderDetails.email,
                "Address": orderDetails.address,
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

            placeOrder({ address: orderDetails.address as string });
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
        // Simulate verification
        setTimeout(() => {
            const paymentId = 'RZP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            // In a real app, you'd verify the payment status via API here
            const formData = new FormData(document.querySelector('form') as HTMLFormElement);
            const address = formData.get('address') as string;
            
            // Re-trigger the success logic
            const sheetData = {
                "First Name": formData.get('first-name'),
                "Last Name": formData.get('last-name'),
                "Email": formData.get('email-address'),
                "Address": address,
                "City": formData.get('city'),
                "Zip": formData.get('postal-code'),
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

            placeOrder({ address });
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
                    {/* Left Column: Details */}
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

                    {/* Right Column: Order Summary */}
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
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product_detail');
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} onViewProduct={navigateToProduct} />;
      case 'shop': return <Shop onViewProduct={navigateToProduct} />;
      case 'product_detail': return selectedProductId ? <ProductDetail productId={selectedProductId} onBack={() => setCurrentPage('shop')} onViewProduct={navigateToProduct} /> : <Shop onViewProduct={navigateToProduct} />;
      case 'admin_dashboard': return <AdminDashboard />;
      case 'login': return <Login onLogin={() => setCurrentPage('home')} />;
      case 'user_dashboard': return <UserDashboard />;
      case 'checkout': return <Checkout onNavigate={setCurrentPage} />;
      default: return <Home onNavigate={setCurrentPage} onViewProduct={navigateToProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <CartDrawer onCheckout={() => setCurrentPage('checkout')} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2 font-heading font-semibold">LuxeMart eCommerce</p>
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} LuxeMart. All rights reserved.</p>
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