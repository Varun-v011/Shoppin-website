import React from 'react';
import { ChevronRight } from 'lucide-react';

const CollectionCard = ({ collection, onClick, animationDelay = 0 }) => {
  return (
    <div 
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-stone-100">
        <img 
          src={collection.image} 
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="font-serif text-2xl mb-2">{collection.name}</h3>
          <p className="text-white/90 mb-3">{collection.tagline}</p>
          <div className="flex items-center gap-2 text-sm">
            <span>{collection.count} pieces</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;