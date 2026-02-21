import React from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQty, getCartTotal } from '../Utils/cart';
import { sendCartOrder } from '../Utils/whatsapp';

const CartDrawer = ({ cart, setCart, onClose }) => {
  const total = getCartTotal();

  const handleRemove = (id) => {
    setCart(removeFromCart(id));
  };

  const handleQty = (id, qty) => {
    if (qty < 1) {
      setCart(removeFromCart(id));
    } else {
      setCart(updateQty(id, qty));
    }
  };

  const handleWhatsAppOrder = () => {
    sendCartOrder(cart);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-xl text-stone-800">Your Cart</h2>
            {cart.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + (i.qty || 1), 0)} items
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-16 h-16 text-stone-200 mb-4" />
              <p className="font-serif text-xl text-stone-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-stone-400">Add some beautiful pieces to get started</p>
            </div>
          ) : (
            cart.map((item) => {
              const hasDiscount = item.discounted_price && item.discounted_price < item.original_price;
              const displayPrice = item.discounted_price || item.original_price || 0;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100"
                >
                  {/* Image */}
                  <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-500 mb-0.5 font-mono">{item.id}</p>
                    <p className="font-serif text-sm text-stone-800 leading-snug truncate">
                      {item.title}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-amber-700 font-semibold text-sm">
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <span className="text-stone-400 text-xs line-through">
                          ₹{item.original_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQty(item.id, (item.qty || 1) - 1)}
                        className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.qty || 1}</span>
                      <button
                        onClick={() => handleQty(item.id, (item.qty || 1) + 1)}
                        className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="self-start p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-stone-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-200 space-y-4 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-stone-600 font-medium">Total</span>
              <span className="font-serif text-2xl text-stone-800">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-green-200 text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Order on WhatsApp
            </button>

            <p className="text-center text-xs text-stone-400">
              Your order details will be sent to our shop via WhatsApp
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
