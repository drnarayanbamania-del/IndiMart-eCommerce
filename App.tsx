import React, { useState } from 'react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import { UserRole } from './types';

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
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        
        // Ensure Razorpay SDK is loaded
        if (!(window as any).Razorpay) {
            alert("Razorpay SDK is not loaded. Please check your internet connection.");
            setLoading(false);
            return;
        }

        const options = {
            key: "rzp_test_YOUR_KEY_HERE", // Replace with your actual Razorpay Key ID
            amount: Math.round(subtotal * 100), // Amount in paise
            currency: "INR",
            name: "Apna Store",
            description: "Order Payment",
            image: "https://via.placeholder.com/150",
            handler: async function (response: any) {
                console.log("Razorpay Response:", response);
                
                const orderData = {
                    "First Name": formData.get('first-name'),
                    "Last Name": formData.get('last-name'),
                    "Email": formData.get('email-address'),
                    "Address": formData.get('address'),
                    "City": formData.get('city'),
                    "Zip": formData.get('postal-code'),
                    "Product Name": cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
                    "Total Amount": subtotal.toFixed(2),
                    "Order Date": new Date().toLocaleString(),
                    "Payment ID": response.razorpay_payment_id
                };

                // Log order to Google Sheets
                try {
                    await fetch('https://script.google.com/macros/s/AKfycbyfjw6EEDpNk0za4YWldI7ul0Nd4qZVkNL3pS4lotwBlm4N-pyIi_ZIGmu4-Nt7GAwv0w/exec', {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify(orderData)
                    });
                } catch (error) {
                    console.error("Error submitting order to sheet:", error);
                }

                // Internal app logic
                placeOrder({ address: formData.get('address') as string });
                setLoading(false);
                onNavigate('home');
                alert(`Order Placed Successfully! Payment ID: ${response.razorpay_payment_id}`);
            },
            prefill: {
                name: `${formData.get('first-name')} ${formData.get('last-name')}`,
                email: formData.get('email-address') as string,
                contact: ""
            },
            theme: {
                color: "#2563eb"
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                }
            }
        };

        const rzp1 = new (window as any).Razorpay(options);
        
        rzp1.on('payment.failed', function (response: any){
            alert("Payment Failed: " + response.error.description);
            setLoading(false);
        });

        rzp1.open();
    }

    if(cart.length === 0) return <div className="p-12 text-center">Your cart is empty.</div>

    return (
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Checkout</h2>
            <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handlePlaceOrder}>
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                    
                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                            <div className="mt-1">
                                <input type="text" id="first-name" name="first-name" autoComplete="given-name" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                            <div className="mt-1">
                                <input type="text" id="last-name" name="last-name" autoComplete="family-name" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border" required />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
                        <div className="mt-1">
                            <input type="email" id="email-address" name="email-address" autoComplete="email" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border" required />
                        </div>
                    </div>

                     <div className="mt-10 border-t border-gray-200 pt-10">
                        <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                             <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street address</label>
                                <div className="mt-1">
                                    <input type="text" name="address" id="address" autoComplete="street-address" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border" required />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <div className="mt-1">
                                    <input type="text" name="city" id="city" autoComplete="address-level2" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border" required />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                                <div className="mt-1">
                                    <input type="text" name="postal-code" id="postal-code" autoComplete="postal-code" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border" required />
                                </div>
                            </div>
                        </div>
                     </div>
                </div>

                {/* Order summary */}
                <div className="mt-10 lg:mt-0">
                    <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                    <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <ul role="list" className="divide-y divide-gray-200">
                            {cart.map((product) => (
                                <li key={product.id} className="flex py-6 px-4 sm:px-6">
                                    <div className="flex-shrink-0">
                                        <img src={product.image} alt={product.name} className="w-20 rounded-md" />
                                    </div>
                                    <div className="ml-6 flex-1 flex flex-col">
                                        <div className="flex">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm"><a href="#" className="font-medium text-gray-700 hover:text-gray-800">{product.name}</a></h4>
                                                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-2 flex items-end justify-between">
                                            <p className="mt-1 text-sm font-medium text-gray-900">₹{product.price}</p>
                                            <div className="ml-4">
                                                <p className="text-sm text-gray-500">Qty {product.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                            <div className="flex items-center justify-between">
                                <dt className="text-base font-medium">Total</dt>
                                <dd className="text-base font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                            </div>
                        </dl>
                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                            <button type="submit" disabled={loading} className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500">
                                {loading ? 'Processing...' : 'Pay with Razorpay'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
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