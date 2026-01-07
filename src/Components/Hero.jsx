import React from 'react';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { sendGeneralInquiry } from '../Utils/whatsapp';

const Hero = ({ onViewLookbook, isVisible }) => {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className={`text-center max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-block mb-6 px-4 py-2 bg-amber-100/50 backdrop-blur-sm rounded-full text-sm font-medium text-amber-800">
            Curated with Love
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-stone-800 mb-6 leading-tight">
            Where Tradition Meets
            <span className="block decorative-line text-amber-700">Contemporary Grace</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Handpicked collections of exquisite sarees, kurtis, and ethnic wear for the modern woman who cherishes heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={sendGeneralInquiry}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp to Order
            </button>
            <button 
              onClick={onViewLookbook}
              className="border-2 border-stone-800 text-stone-800 px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-stone-800 hover:text-white transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              View Lookbook
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;