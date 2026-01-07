import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, ShoppingBag } from 'lucide-react';

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

// Data
import { collections } from './data/Collection';
import { products } from './data/Product';
import { testimonials } from './data/Testimonial';
import { blogPosts } from './data/BlogPost';

// Utils
import { sendGeneralInquiry } from './Utils/whatsapp';

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    occasion: 'all',
    style: 'all',
    size: 'all',
    budget: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let filtered = products;
    
    if (selectedCollection) {
      filtered = filtered.filter(p => p.collection === selectedCollection);
    }
    
    if (filters.occasion !== 'all') {
      filtered = filtered.filter(p => p.occasion === filters.occasion);
    }
    
    if (filters.style !== 'all') {
      filtered = filtered.filter(p => p.style === filters.style);
    }
    
    if (filters.size !== 'all') {
      filtered = filtered.filter(p => p.sizes.includes(filters.size));
    }
    
    if (filters.budget !== 'all') {
      filtered = filtered.filter(p => {
        const minPrice = parseInt(p.priceRange.match(/\d+/)[0]);
        if (filters.budget === 'under2000') return minPrice < 2000;
        if (filters.budget === '2000-5000') return minPrice >= 2000 && minPrice <= 5000;
        if (filters.budget === 'above5000') return minPrice > 5000;
        return true;
      });
    }
    
    if (JSON.stringify(filtered) !== JSON.stringify(filteredProducts)) {
      setFilteredProducts(filtered);
    }
  }, [filters, selectedCollection, filteredProducts]);

  const handleNavigate = (section) => {
    setCurrentSection(section);
    if (section === 'home') {
      setSelectedCollection(null);
    }
  };

  const handleCollectionClick = (collectionName) => {
    setSelectedCollection(collectionName);
    setCurrentSection('collections');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .product-card {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .product-card:nth-child(1) { animation-delay: 0.1s; }
        .product-card:nth-child(2) { animation-delay: 0.2s; }
        .product-card:nth-child(3) { animation-delay: 0.3s; }
        .product-card:nth-child(4) { animation-delay: 0.4s; }
        .product-card:nth-child(5) { animation-delay: 0.5s; }
        .product-card:nth-child(6) { animation-delay: 0.6s; }
        
        .modal-content {
          animation: slideInRight 0.4s ease-out;
        }
        
        body {
          background: linear-gradient(to bottom, #fafaf9 0%, #f5f5f4 100%);
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 50%, #d6d3d1 100%);
        }
        
        .decorative-line {
          position: relative;
          display: inline-block;
        }
        
        .decorative-line::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #d97706, transparent);
        }
      `}</style>

      <Header currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Home Section */}
      {currentSection === 'home' && (
        <>
          <Hero 
            onViewLookbook={() => setCurrentSection('collections')} 
            isVisible={isVisible}
          />

          {/* Featured Collections */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-5xl text-stone-800 mb-4">Featured Collections</h2>
                <p className="text-stone-600 max-w-2xl mx-auto">Explore our carefully curated selections for every occasion</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {collections.map((collection, idx) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onClick={() => handleCollectionClick(collection.name)}
                    animationDelay={isVisible ? idx * 0.2 : 0}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Customer Love */}
          <section className="py-16 md:py-24 bg-stone-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-5xl text-stone-800 mb-4">Customer Love</h2>
                <p className="text-stone-600">Real women, real style</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                {testimonials.map((testimonial, idx) => (
                  <TestimonialCard key={idx} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-stone-50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-serif text-3xl md:text-5xl text-stone-800 mb-6">
                  Get Personalized Recommendations
                </h2>
                <p className="text-lg text-stone-600 mb-8">
                  Share your preferences and let us curate the perfect pieces for you
                </p>
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="bg-stone-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-stone-900 transition-all shadow-lg hover:shadow-xl"
                >
                  Share Your Preferences
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Collections Section */}
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
                      key={product.id} 
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>

                {/* Lead Capture */}
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

      {/* About Section */}
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
                      Hello! I'm Priya, and I've spent the last decade curating beautiful ethnic wear for women who appreciate quality, tradition, and timeless style.
                    </p>
                    <p>
                      What started as a passion for handloom sarees has grown into a carefully curated collection of garments that celebrate Indian craftsmanship while embracing contemporary sensibilities.
                    </p>
                    <p>
                      Every piece in this collection is personally selected, ensuring it meets my standards for quality, fit, and versatility. I work directly with weavers and artisans to bring you pieces that tell a story.
                    </p>
                    <p className="font-medium text-amber-700">
                      My promise: Authentic pieces, honest pricing, and personalized service that makes you feel like you're shopping with a friend.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-100 rounded-2xl p-8 md:p-12">
                <h2 className="font-serif text-2xl md:text-3xl text-stone-800 mb-6 text-center">
                  Why Shop With Us?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-amber-700" />
                    </div>
                    <h3 className="font-serif text-lg text-stone-800 mb-2">Curated with Care</h3>
                    <p className="text-stone-600 text-sm">Every piece personally selected for quality and style</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-amber-700" />
                    </div>
                    <h3 className="font-serif text-lg text-stone-800 mb-2">Personal Service</h3>
                    <p className="text-stone-600 text-sm">Direct WhatsApp support and styling advice</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-amber-700" />
                    </div>
                    <h3 className="font-serif text-lg text-stone-800 mb-2">Authentic Quality</h3>
                    <p className="text-stone-600 text-sm">Direct from artisans and trusted sources</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
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

      {/* Modals and Floating Elements */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {showLeadForm && (
        <LeadForm onClose={() => setShowLeadForm(false)} />
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={sendGeneralInquiry}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all z-40 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;