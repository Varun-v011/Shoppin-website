// ============================================================
// Cart Utility — persists to localStorage
// ============================================================

const CART_KEY = 'shaya_cart';

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Could not save cart:', e);
  }
};

export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
    saveCart(cart);
    return cart;
  }
  const newCart = [...cart, { ...product, qty: 1 }];
  saveCart(newCart);
  return newCart;
};

export const removeFromCart = (productId) => {
  const newCart = getCart().filter((item) => item.id !== productId);
  saveCart(newCart);
  return newCart;
};

export const updateQty = (productId, qty) => {
  const cart = getCart().map((item) =>
    item.id === productId ? { ...item, qty: Math.max(1, qty) } : item
  );
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};

export const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
};

export const getCartTotal = () => {
  return getCart().reduce((sum, item) => {
    const price = item.discounted_price || item.original_price || 0;
    return sum + price * (item.qty || 1);
  }, 0);
};
