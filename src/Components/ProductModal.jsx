import React, { useState } from 'react';
import { X, MessageCircle, Instagram } from 'lucide-react';
import { sendProductInquiry } from '../Utils/whatsapp';

const ProductModal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end md:items-center justify-center p-0 md:p-4 modal-overlay"
      onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}
    >
      <div className="bg-white w-full md:max-w-4xl md:rounded-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto modal-content">
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-stone-200 flex justify-between items-center">
          <h3 className="font-serif text-xl md:text-2xl text-stone-800">{product.title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 md:p-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-amber-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600 mb-3">
                  Code: {product.id}
                </div>
                <p className="text-2xl md:text-3xl font-serif text-amber-700 mb-2">{product.priceRange}</p>
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-stone-500 text-sm w-24">Fabric:</span>
                  <span className="text-stone-800 font-medium">{product.fabric}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-stone-500 text-sm w-24">Fit:</span>
                  <span className="text-stone-800 font-medium">{product.fit}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-stone-500 text-sm w-24">Sizes:</span>
                  <span className="text-stone-800 font-medium">{product.sizes.join(', ')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-stone-500 text-sm w-24">Care:</span>
                  <span className="text-stone-800 font-medium">{product.care}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-stone-500 text-sm w-24">Stock:</span>
                  <span className="text-stone-800 font-medium">{product.stock}</span>
                </div>
              </div>
              
              <button
                onClick={() => sendProductInquiry(product.id, product.title, product.priceRange)}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </button>
              
              <button
                onClick={() => window.open('https://instagram.com/yourhandle', '_blank')}
                className="w-full border-2 border-stone-200 text-stone-700 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:border-stone-300 hover:bg-stone-50 transition-all"
              >
                <Instagram className="w-5 h-5" />
                View on Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;