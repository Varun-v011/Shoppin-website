import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { MessageCircle, Heart, ShoppingBag, Star } from 'lucide-react';

// Components
import Header from './Components/Header';
import Hero from './Components/Hero';
import CollectionCard from './Components/Collectioncard';
import ProductCard from './Components/Productcard';
import ProductModal from './Components/ProductModal';
import TestimonialCard from './Components/TestimonialCard';
import BlogCard from './Components/BlogCard';
import FilterBar from './Components/FilterBar';
import LeadForm from './Components/LeadForm';
import Footer from './Components/Footer';
import CartDrawer from './Components/CartDrawer';

// Admin
import AdminLogin from './Admin/Adminlogin';
import AdminDashboard from './Admin/AdminDashboard';

// Static data (fallback)
import { testimonials } from './data/Testimonial';
import { blogPosts } from './data/blogPost';

// Utils
import { sendGeneralInquiry } from './Utils/whatsapp';
import { getCart, addToCart, getCartCount } from './Utils/cart';

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Store data
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // UI State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ occasion: 'all', style: 'all', size: 'all', budget: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Cart
  const [cart, setCart] = useState(getCart());
  const [showCart, setShowCart] = useState(false);

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch data
  useEffect(() => {
    fetchData();
    setIsVisible(true);
  }, []);

  const fetchData = async () => {
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: collectionsData } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      const allProducts = productsData || [];
      setProducts(allProducts);
      setCollections(collectionsData || []);

      // Best sellers: products marked is_best_seller first, then random picks
      let bsSellers = allProducts.filter((p) => p.is_best_seller);
      if (bsSellers.length < 4) {
        const others = allProducts.filter((p) => !p.is_best_seller);
        const shuffled = [...others].sort(() => Math.random() - 0.5);
        bsSellers = [...bsSellers, ...shuffled].slice(0, 8);
      } else {
        // Shuffle to vary display
        bsSellers = [...bsSellers].sort(() => Math.random() - 0.5).slice(0, 8);
      }
      setBestSellers(bsSellers);

      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDataLoading(false);
    }
  };

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (selectedCollection) {
      filtered = filtered.filter((p) => p.collection === selectedCollection);
    }
    if (filters.occasion !== 'all') {
      filtered = filtered.filter((p) => p.occasion === filters.occasion);
    }
    if (filters.style !== 'all') {
      filtered = filtered.filter((p) => p.style === filters.style);
    }
    if (filters.size !== 'all') {
      filtered = filtered.filter((p) => Array.isArray(p.sizes) && p.sizes.includes(filters.size));
    }
    if (filters.budget !== 'all') {
      filtered = filtered.filter((p) => {
        const price = p.discounted_price || p.original_price || 0;
        if (filters.budget === 'under2000') return price < 2000;
        if (filters.budget === '2000-5000') return price >= 2000 && price <= 5000;
        if (filters.budget === 'above5000') return price > 5000;
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [filters, selectedCollection, products]);

  const handleNavigate = (section) => {
    setCurrentSection(section);
    if (section === 'home') setSelectedCollection(null);
  };

  const handleCollectionClick = (collectionName) => {
    setSelectedCollection(collectionName);
    setCurrentSection('collections');
  };

  const handleAddToCart = useCallback((product) => {
    const newCart = addToCart(product);
    setCart([...newCart]);
    setShowCart(true);
  }, []);

  const cartCount = cart.reduce((s, i) => s + (i.qty || 1), 0);

  // Loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Admin panel
  if (window.location.pathname === '/admin') {
    if (!user) return <AdminLogin onLoginSuccess={() => {}} />;
    return <AdminDashboard />;
  }

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
    .font-serif { font-family: 'Playfair Display', serif; }
    .font-sans  { font-family: 'DM Sans', sans-serif; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .animate-fade-in-up   { animation: fadeInUp 0.8s ease-out forwards; }
    .animate-fade-in      { animation: fadeIn 1s ease-out forwards; }
    .animate-slide-in-right { animation: slideInRight 0.4s ease-out; }

    .product-card { opacity: 0; animation: fadeInUp 0.6s ease-out forwards; }
    .product-card:nth-child(1) { animation-delay: 0.1s; }
    .product-card:nth-child(2) { animation-delay: 0.2s; }
    .product-card:nth-child(3) { animation-delay: 0.3s; }
    .product-card:nth-child(4) { animation-delay: 0.4s; }
    .product-card:nth-child(5) { animation-delay: 0.5s; }
    .product-card:nth-child(6) { animation-delay: 0.6s; }
    .product-card:nth-child(7) { animation-delay: 0.7s; }
    .product-card:nth-child(8) { animation-delay: 0.8s; }

    .modal-content { animation: slideInRight 0.4s ease-out; }

    body { background: linear-gradient(to bottom, #fafaf9 0%, #f5f5f4 100%); }

    .hero-gradient { background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 50%, #d6d3d1 100%); }

    .decorative-line { position: relative; display: inline-block; }
    .decorative-line::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(to right, #d97706, transparent);
    }
  `;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <style>{globalStyles}</style>

      <Header
        onNavigate={handleNavigate}
        cartCount={cartCount}
        onCartOpen={() => setShowCart(true)}
      />

      {dataLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-stone-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── HOME ── */}
          {currentSection === 'home' && (
            <>
              <Hero onViewLookbook={() => setCurrentSection('collections')} isVisible={isVisible} />

              {/* Featured Collections */}
              {collections.length > 0 && (
                <section className="py-16 md:py-24 bg-white">
                  <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                      <h2 className="font-serif text-3xl md:text-5xl text-stone-800 mb-4">
                        Featured Collections
                      </h2>
                      <p className="text-stone-600 max-w-2xl mx-auto">
                        Explore our carefully curated selections for every occasion
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                      {collections.map((collection, idx) => (
                        <CollectionCard
                          key={collection.doc_id}
                          collection={collection}
                          onClick={() => handleCollectionClick(collection.name)}
                          animationDelay={isVisible ? idx * 0.2 : 0}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ── BEST SELLING COLLECTION ── */}
              {bestSellers.length > 0 && (
                <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-stone-50">
                  <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        Trending Now
                      </div>
                      <h2 className="font-serif text-3xl md:text-5xl text-stone-800 mb-4">
                        Best Selling Collection
                      </h2>
                      <p className="text-stone-600 max-w-2xl mx-auto">
                        Our most loved pieces, handpicked by our customers
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {bestSellers.map((product) => (
                        <ProductCard
                          key={product.doc_id || product.id}
                          product={product}
                          onClick={() => setSelectedProduct(product)}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>

                    <div className="text-center mt-10">
                      <button
                        onClick={() => setCurrentSection('collections')}
                        className="border-2 border-stone-800 text-stone-800 px-8 py-4 rounded-xl font-medium hover:bg-stone-800 hover:text-white transition-all"
                      >
                        View All Collections
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Testimonials */}
              <section className="py-16 md:py-24 bg-stone-50">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-5xl text-stone-800 mb-4">
                      Customer Love
                    </h2>
                    <p className="text-stone-600">Real women, real style</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {testimonials.map((t, idx) => (
                      <TestimonialCard key={idx} testimonial={t} />
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA */}
              <section className="py-16 md:py-24 bg-gradient-to-br from-stone-800 to-stone-900">
                <div className="container mx-auto px-4">
                  <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
                      Get Personalized Recommendations
                    </h2>
                    <p className="text-lg text-stone-300 mb-8">
                      Share your preferences and let us curate the perfect pieces for you
                    </p>
                    <button
                      onClick={() => setShowLeadForm(true)}
                      className="bg-amber-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Share Your Preferences
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── COLLECTIONS ── */}
          {currentSection === 'collections' && (
            <section className="py-8 md:py-12 min-h-screen">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h1 className="font-serif text-3xl md:text-5xl text-stone-800 mb-2">
                      {selectedCollection || 'All Collections'}
                    </h1>
                    <p className="text-stone-600">{filteredProducts.length} pieces available</p>
                  </div>
                  <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                  />
                </div>

                {filteredProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.doc_id || product.id}
                          product={product}
                          onClick={() => setSelectedProduct(product)}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl p-8 md:p-12 text-center">
                      <h3 className="font-serif text-2xl md:text-3xl text-stone-800 mb-4">
                        Can't Find What You're Looking For?
                      </h3>
                      <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
                        Share your preferences and we'll help you find the perfect piece
                      </p>
                      <button
                        onClick={() => setShowLeadForm(true)}
                        className="bg-stone-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-stone-900 transition-all"
                      >
                        Get Personalized Recommendations
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-stone-600 text-lg mb-6">No products match your filters</p>
                    <button
                      onClick={() => setFilters({ occasion: 'all', style: 'all', size: 'all', budget: 'all' })}
                      className="text-amber-700 font-medium hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── ABOUT ── */}
          {currentSection === 'about' && (
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80"
                        alt="About"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-6">
                        About the Curator
                      </h1>
                      <div className="space-y-4 text-stone-700 leading-relaxed">
                        <p>
                          Hello! I'm Priya, and I've spent the last decade curating beautiful ethnic
                          wear for women who appreciate quality, tradition, and timeless style.
                        </p>
                        <p>
                          What started as a passion for handloom sarees has grown into a carefully
                          curated collection that celebrates Indian craftsmanship while embracing
                          contemporary sensibilities.
                        </p>
                        <p>
                          Every piece is personally selected, ensuring it meets my standards for
                          quality, fit, and versatility. I work directly with weavers and artisans
                          to bring you pieces that tell a story.
                        </p>
                        <p className="font-medium text-amber-700">
                          My promise: Authentic pieces, honest pricing, and personalized service.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-100 rounded-2xl p-8 md:p-12">
                    <h2 className="font-serif text-2xl md:text-3xl text-stone-800 mb-6 text-center">
                      Why Shop With Us?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                      {[
                        { icon: Heart, label: 'Curated with Care', desc: 'Every piece personally selected for quality and style' },
                        { icon: MessageCircle, label: 'Personal Service', desc: 'Direct WhatsApp support and styling advice' },
                        { icon: ShoppingBag, label: 'Authentic Quality', desc: 'Direct from artisans and trusted sources' },
                      ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="text-center">
                          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-8 h-8 text-amber-700" />
                          </div>
                          <h3 className="font-serif text-lg text-stone-800 mb-2">{label}</h3>
                          <p className="text-stone-600 text-sm">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── BLOG ── */}
          {currentSection === 'blog' && (
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">Styling Tips</h1>
                  <p className="text-stone-600 max-w-2xl mx-auto">
                    Discover how to style your favorite pieces for different occasions
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {blogPosts.map((post, idx) => (
                    <BlogCard key={post.id} post={post} animationDelay={idx * 0.15} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── MODALS ── */}
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
            />
          )}

          {showLeadForm && <LeadForm onClose={() => setShowLeadForm(false)} />}

          {showCart && (
            <CartDrawer
              cart={cart}
              setCart={setCart}
              onClose={() => setShowCart(false)}
            />
          )}

          {/* Floating WhatsApp Button */}
          <button
            onClick={sendGeneralInquiry}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all z-40 flex items-center justify-center"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export default App;
