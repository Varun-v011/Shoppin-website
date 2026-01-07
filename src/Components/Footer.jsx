import React from 'react';
import { MessageCircle, Instagram } from 'lucide-react';
import { sendGeneralInquiry } from '../Utils/whatsapp';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-800 text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-2xl mb-4">Curated Threads</h3>
            <p className="text-stone-300 leading-relaxed">
              Your destination for handpicked ethnic wear that celebrates tradition and style.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('home')} 
                className="block text-stone-300 hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('collections')} 
                className="block text-stone-300 hover:text-white transition-colors"
              >
                Collections
              </button>
              <button 
                onClick={() => onNavigate('about')} 
                className="block text-stone-300 hover:text-white transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => onNavigate('blog')} 
                className="block text-stone-300 hover:text-white transition-colors"
              >
                Styling Tips
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <button 
                onClick={sendGeneralInquiry}
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button 
                onClick={() => window.open('https://instagram.com/yourhandle', '_blank')}
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-700 pt-8 text-center text-stone-400 text-sm">
          <p>© 2024 Curated Threads. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;