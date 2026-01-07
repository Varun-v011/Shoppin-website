import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Star, 
  MessageCircle, 
  LogOut,
  TrendingUp,
  Users
} from 'lucide-react';
import ProductManagement from './productManagement';
import CollectionManagement from './CollectionManagement';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCollections: 0,
    festiveProducts: 0,
    casualProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get products count
      const productsRef = collection(db, 'products');
      const productsSnap = await getDocs(productsRef);
      const totalProducts = productsSnap.size;

      // Get collections count
      const collectionsRef = collection(db, 'collections');
      const collectionsSnap = await getDocs(collectionsRef);
      const totalCollections = collectionsSnap.size;

      // Get festive products
      const festiveQuery = query(productsRef, where('occasion', '==', 'festive'));
      const festiveSnap = await getDocs(festiveQuery);
      const festiveProducts = festiveSnap.size;

      // Get casual products
      const casualQuery = query(productsRef, where('occasion', '==', 'casual'));
      const casualSnap = await getDocs(casualQuery);
      const casualProducts = casualSnap.size;

      setStats({
        totalProducts,
        totalCollections,
        festiveProducts,
        casualProducts
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-stone-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-stone-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl text-stone-800">Curated Threads</h1>
                <p className="text-xs text-stone-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'products'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </button>

            <button
              onClick={() => setCurrentView('collections')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'collections'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Collections</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-2">Dashboard Overview</h2>
                <p className="text-stone-600">Welcome back! Here's your store summary</p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-stone-600 mt-4">Loading statistics...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                      icon={Package}
                      title="Total Products"
                      value={stats.totalProducts}
                      color="bg-blue-500"
                    />
                    <StatCard
                      icon={ShoppingBag}
                      title="Collections"
                      value={stats.totalCollections}
                      color="bg-purple-500"
                    />
                    <StatCard
                      icon={Star}
                      title="Festive Products"
                      value={stats.festiveProducts}
                      color="bg-amber-500"
                    />
                    <StatCard
                      icon={TrendingUp}
                      title="Casual Products"
                      value={stats.casualProducts}
                      color="bg-green-500"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-serif text-stone-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setCurrentView('products')}
                        className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all"
                      >
                        <Package className="w-6 h-6 text-amber-600" />
                        <div className="text-left">
                          <p className="font-medium text-stone-800">Add Product</p>
                          <p className="text-sm text-stone-500">Create new product</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setCurrentView('collections')}
                        className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all"
                      >
                        <ShoppingBag className="w-6 h-6 text-amber-600" />
                        <div className="text-left">
                          <p className="font-medium text-stone-800">Add Collection</p>
                          <p className="text-sm text-stone-500">Create new collection</p>
                        </div>
                      </button>

                      <button
                        onClick={() => window.open('/', '_blank')}
                        className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all"
                      >
                        <Users className="w-6 h-6 text-amber-600" />
                        <div className="text-left">
                          <p className="font-medium text-stone-800">View Store</p>
                          <p className="text-sm text-stone-500">See customer view</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentView === 'products' && <ProductManagement onStatsUpdate={fetchStats} />}
          {currentView === 'collections' && <CollectionManagement onStatsUpdate={fetchStats} />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;