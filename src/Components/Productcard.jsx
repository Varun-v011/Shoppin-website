import React from 'react';

const ProductCard = ({ product, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer product-card"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-stone-100">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-stone-700">
          {product.id}
        </div>
      </div>
      <h3 className="font-serif text-lg text-stone-800 mb-1">{product.title}</h3>
      <p className="text-amber-700 font-medium mb-2">{product.priceRange}</p>
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <span>{product.sizes.join(', ')}</span>
        <span>•</span>
        <span className="capitalize">{product.occasion}</span>
      </div>
    </div>
  );
};

export default ProductCard;