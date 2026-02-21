import React from 'react';
import { ShoppingBag, Tag } from 'lucide-react';

const ProductCard = ({ product, onClick, onAddToCart }) => {
  const hasDiscount =
    product.discounted_price &&
    product.original_price &&
    product.discounted_price < product.original_price;

  const discountPercent = hasDiscount
    ? Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)
    : 0;

  const displayPrice = product.discounted_price || product.original_price;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart(product);
  };

  return (
    <div onClick={onClick} className="group cursor-pointer product-card">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-stone-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Product code badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-stone-700">
          {product.id}
        </div>

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {discountPercent}% OFF
          </div>
        )}

        {/* Add to cart overlay button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 bg-white text-stone-800 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg hover:bg-amber-600 hover:text-white whitespace-nowrap"
        >
          <ShoppingBag className="w-3 h-3" />
          Add to Cart
        </button>
      </div>

      <h3 className="font-serif text-lg text-stone-800 mb-1 leading-snug">{product.title}</h3>

      {/* Price display */}
      <div className="flex items-center gap-2 mb-1">
        {displayPrice ? (
          <>
            <span className="text-amber-700 font-semibold">
              ₹{Number(displayPrice).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-stone-400 text-sm line-through">
                ₹{Number(product.original_price).toLocaleString('en-IN')}
              </span>
            )}
          </>
        ) : (
          <span className="text-amber-700 font-medium">{product.priceRange || 'Price on request'}</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-stone-500">
        <span>{Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}</span>
        <span>•</span>
        <span className="capitalize">{product.occasion}</span>
      </div>
    </div>
  );
};

export default ProductCard;
