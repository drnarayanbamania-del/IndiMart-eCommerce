import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { UserRole, Product } from '../../types';
import { generateProductDescription, generateProductImage } from '../../services/geminiService';
import {
  LayoutDashboard, ShoppingBag, Users, Settings, Plus, Trash, Edit, Bot, TrendingUp, RefreshCcw, Image as ImageIcon, Sparkles, Link, Phone, MapPin
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const getCategoryPlaceholder = (category: string) => {
    switch(category) {
        case 'Electronics': return 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=400&auto=format&fit=crop';
        case 'Accessories': return 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=400&auto=format&fit=crop';
        case 'Furniture': return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop';
        case 'Computers': return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop';
        case 'Home Appliances': return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&auto=format&fit=crop';
        case 'Meesho Finds': return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop';
        default: return 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=400&auto=format&fit=crop'; // Generic shopping bag/cart
    }
}

const AdminDashboard: React.FC = () => {
  const { user, products, orders, addProduct, deleteProduct, categories, resetProducts } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: 'Electronics', price: 0, description: '', stock: 0, 
    image: getCategoryPlaceholder('Electronics'), 
    affiliateLink: ''
  });

  if (user?.role !== UserRole.ADMIN) {
    return <div className="p-8 text-center text-red-600">Access Denied. Admins only.</div>;
  }

  // Chart Data Simulation
  const data = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  const handleGenerateDescription = async () => {
    if (!newProduct.name || !newProduct.category) {
      alert("Please enter a product name and category first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(newProduct.name, newProduct.category);
    setNewProduct({ ...newProduct, description: desc });
    setIsGenerating(false);
  };

  const handleGenerateImage = async () => {
    if (!newProduct.name || !newProduct.category) {
      alert("Please enter a product name and category first.");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const description = newProduct.description || "A professional product image";
      const image = await generateProductImage(newProduct.name, newProduct.category, description);

      if (image) {
        setNewProduct({ ...newProduct, image: image });
        setImagePreviewError(false);
      } else {
        alert("Failed to generate image. Please ensure your API key is configured and try again.");
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
      alert("Failed to generate image. Please check your API key or try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      addProduct({
        id: Math.random().toString(36).substr(2, 9),
        name: newProduct.name,
        category: newProduct.category || 'Uncategorized',
        price: Number(newProduct.price),
        description: newProduct.description || '',
        stock: Number(newProduct.stock) || 0,
        image: newProduct.image || getCategoryPlaceholder(newProduct.category || 'Electronics'),
        rating: 0,
        reviews: 0,
        affiliateLink: newProduct.affiliateLink
      } as Product);
      setShowAddModal(false);
      // Reset form with category default
      setNewProduct({ name: '', category: 'Electronics', price: 0, description: '', stock: 0, image: getCategoryPlaceholder('Electronics'), affiliateLink: '' });
      setImagePreviewError(false);
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog? This action cannot be undone.`)) {
      deleteProduct(id);
    }
  };

  const handleReset = () => {
      if(window.confirm("Reset all products to default demo data? This will clear any custom products.")) {
          resetProducts();
      }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const currentPlaceholder = getCategoryPlaceholder(newProduct.category || 'Electronics');
    
    // Check if the current image is a placeholder (either unplash category placeholder or picsum)
    const isPlaceholder = newProduct.image?.includes('unsplash') || newProduct.image?.includes('picsum');

    setNewProduct(prev => ({
        ...prev, 
        category: newCategory,
        // Only update image if it was a placeholder or empty, preserving custom uploaded URLs
        image: (isPlaceholder || !prev.image) ? getCategoryPlaceholder(newCategory) : prev.image
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-heading font-bold text-primary-600">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" /> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <TrendingUp className="w-5 h-5 mr-3" /> Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900">₹1,24,500</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full text-green-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">1,203</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Analytics</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab: Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
              <div className="flex space-x-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Reset to default products"
                  >
                    <RefreshCcw className="w-5 h-5 mr-2" /> Reset
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add Product
                  </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => handleDeleteProduct(product.id, product.name)} 
                            className="text-red-600 hover:text-red-900 ml-4 p-2 hover:bg-red-50 rounded-full"
                            title="Delete Product"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                      <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                              No products found. Add one to get started!
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Orders */}
         {activeTab === 'orders' && (
           <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-0 overflow-x-auto">
                  {orders.length > 0 ? (
                     <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer & Contact</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200 text-left">
                       {orders.map((order) => (
                         <tr key={order.id}>
                           <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{order.id}</td>
                           <td className="px-6 py-4">
                               <div className="text-sm font-bold text-gray-900">{order.shippingDetails?.name || 'Guest'}</div>
                               <div className="flex items-center text-xs text-slate-500 mt-1 bg-slate-100 w-fit px-2 py-1 rounded">
                                   <Phone className="w-3 h-3 mr-1" />
                                   {order.shippingDetails?.phone || 'No Mobile'}
                               </div>
                           </td>
                           <td className="px-6 py-4">
                               <div className="flex items-start max-w-xs">
                                   <MapPin className="w-3 h-3 mr-1 mt-1 text-gray-400 flex-shrink-0" />
                                   <span className="text-sm text-gray-600 whitespace-normal">
                                        {order.shippingDetails?.address || 'No Address Provided'}
                                   </span>
                               </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{order.total.toFixed(2)}</td>
                           <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.status}
                            </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                  ) : (
                    <div className="p-8 text-center text-gray-500">No orders found.</div>
                  )}
                </div>
              </div>
           </div>
         )}
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      id="productName"
                      required
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Wireless Headphones"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={newProduct.category}
                      onChange={handleCategoryChange}
                    >
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      required
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {newProduct.image && !imagePreviewError ? (
                        <img 
                          src={newProduct.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                          onError={() => setImagePreviewError(true)}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                           <ImageIcon className="w-12 h-12 mb-2" />
                           <span className="text-xs">No Preview</span>
                        </div>
                      )}
                      {isGeneratingImage && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                           <div className="flex flex-col items-center">
                             <RefreshCcw className="w-8 h-8 text-primary-600 animate-spin mb-2" />
                             <span className="text-xs font-semibold text-primary-700">AI Rendering...</span>
                           </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Image URL or generate with AI"
                        className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={newProduct.image}
                        onChange={e => {
                           setNewProduct({ ...newProduct, image: e.target.value });
                           setImagePreviewError(false);
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage || !newProduct.name}
                        className="flex items-center bg-primary-50 text-primary-700 px-3 py-2 rounded-md hover:bg-primary-100 transition-colors border border-primary-200 disabled:opacity-50"
                        title="Generate realistic photo with AI"
                      >
                        <Sparkles className="w-4 h-4 mr-1" /> AI Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Link (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={newProduct.affiliateLink || ''}
                    onChange={e => setNewProduct({ ...newProduct, affiliateLink: e.target.value })}
                    placeholder="https://amazon.com/dp/..."
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">If provided, the 'Add to Cart' button will be replaced with a 'Buy Now' link to this URL.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating || !newProduct.name || !newProduct.category}
                        className={`flex items-center text-xs px-2 py-1 rounded-md transition-colors ${
                            isGenerating || !newProduct.name || !newProduct.category
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                            : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                        }`}
                        title="Generate description using AI based on name and category"
                    >
                        {isGenerating ? (
                             <RefreshCcw className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                             <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        {isGenerating ? 'Writing...' : 'Auto-Write with AI'}
                    </button>
                </div>
                <div className="relative">
                  <textarea
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 shadow-md shadow-primary-500/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;