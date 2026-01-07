import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const Header = ({ onNavigate }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleNavigate = (section) => {
    onNavigate(section);
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => handleNavigate('home')}
            className="font-serif text-2xl md:text-3xl text-stone-800 tracking-tight hover:text-amber-700 transition-colors"
          >
            Shaya Popup
          </button>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => handleNavigate('home')} 
              className="text-stone-600 hover:text-amber-700 transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigate('collections')} 
              className="text-stone-600 hover:text-amber-700 transition-colors font-medium"
            >
              Collections
            </button>
            <button 
              onClick={() => handleNavigate('about')} 
              className="text-stone-600 hover:text-amber-700 transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigate('blog')} 
              className="text-stone-600 hover:text-amber-700 transition-colors font-medium"
            >
              Styling Tips
            </button>
          </nav>
          
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {showMenu && (
        <div className="md:hidden bg-white border-t border-stone-200 py-4 px-4 space-y-2 animate-fade-in">
          <button 
            onClick={() => handleNavigate('home')} 
            className="block w-full text-left py-2 text-stone-600 hover:text-amber-700 transition-colors font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigate('collections')} 
            className="block w-full text-left py-2 text-stone-600 hover:text-amber-700 transition-colors font-medium"
          >
            Collections
          </button>
          <button 
            onClick={() => handleNavigate('about')} 
            className="block w-full text-left py-2 text-stone-600 hover:text-amber-700 transition-colors font-medium"
          >
            About
          </button>
          <button 
            onClick={() => handleNavigate('blog')} 
            className="block w-full text-left py-2 text-stone-600 hover:text-amber-700 transition-colors font-medium"
          >
            Styling Tips
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;