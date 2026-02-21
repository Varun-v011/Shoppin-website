/**
 * WhatsApp Integration — Shaya Popup
 * Updated to support cart orders with product codes + image links
 */

// ============================================================
// CONFIGURATION — UPDATE THIS!
// ============================================================
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;


export const BUSINESS_INFO = {
  name: 'Shaya Popup',
  tagline: 'Where Tradition Meets Contemporary Grace',
  instagram: '@shayapopup',
  website: 'www.shayapopup.com',
};

// ============================================================
// CORE
// ============================================================

export const openWhatsApp = (message = '', newWindow = true) => {
  const encodedMessage = encodeURIComponent(message);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const baseUrl = isMobile
    ? `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;
  const url = `${baseUrl}?text=${encodedMessage}`;
  if (newWindow) window.open(url, '_blank');
  else window.location.href = url;
};

// ============================================================
// CART ORDER — sends full order with product codes + image links
// ============================================================

/**
 * Send entire cart as a WhatsApp order message
 * @param {Array} cartItems - Array of cart items with qty, id, title, image, price fields
 */
export const sendCartOrder = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return;

  let message = `🛍️ *ORDER REQUEST — ${BUSINESS_INFO.name}*\n\n`;
  message += `📋 *Order Details:*\n`;
  message += `─────────────────────\n`;

  cartItems.forEach((item, index) => {
    const price = item.discounted_price || item.original_price || 0;
    const total = price * (item.qty || 1);
    message += `\n${index + 1}. *${item.title}*\n`;
    message += `   🔢 Code: \`${item.id}\`\n`;
    message += `   💰 Price: ₹${price.toLocaleString('en-IN')}\n`;
    message += `   🔢 Qty: ${item.qty || 1}\n`;
    message += `   💵 Subtotal: ₹${total.toLocaleString('en-IN')}\n`;
    if (item.image) {
      message += `   🖼️ Image: ${item.image}\n`;
    }
  });

  const grandTotal = cartItems.reduce((sum, item) => {
    const price = item.discounted_price || item.original_price || 0;
    return sum + price * (item.qty || 1);
  }, 0);

  message += `\n─────────────────────\n`;
  message += `💳 *Grand Total: ₹${grandTotal.toLocaleString('en-IN')}*\n`;
  message += `─────────────────────\n\n`;
  message += `Please confirm:\n`;
  message += `✓ Availability of each item\n`;
  message += `✓ Delivery charges\n`;
  message += `✓ Payment options\n`;
  message += `✓ Estimated delivery time\n\n`;
  message += `Thank you! 😊`;

  openWhatsApp(message);
};

// ============================================================
// PRODUCT INQUIRY
// ============================================================

export const sendProductInquiry = (productCode, productTitle, price = '') => {
  let message = `Hi ${BUSINESS_INFO.name}! 👋\n\n`;
  message += `I'm interested in this product:\n\n`;
  message += `📦 *${productTitle}*\n`;
  message += `🔢 Code: ${productCode}\n`;
  if (price) message += `💰 Price: ${price}\n`;
  message += `\nCould you please share availability, size options, and delivery time?\n\n`;
  message += `Thank you! 😊`;
  openWhatsApp(message);
};

export const sendQuickInquiry = (productCode, productTitle) => {
  const message = `Hi! I'm interested in *${productTitle}* (Code: ${productCode}). Is this available?`;
  openWhatsApp(message);
};

export const sendBulkInquiry = (products) => {
  let message = `Hi! I'm interested in these products:\n\n`;
  products.forEach((p, i) => {
    message += `${i + 1}. ${p.title} (${p.id})\n`;
  });
  message += `\nCan you share availability and total pricing?\n\nThank you!`;
  openWhatsApp(message);
};

// ============================================================
// GENERAL
// ============================================================

export const sendGeneralInquiry = () => {
  const message = `Hi ${BUSINESS_INFO.name}! 👋\n\nI came across your beautiful collection and would love to know more.\n\nThank you! 😊`;
  openWhatsApp(message);
};

export const sendLeadMessage = (leadData) => {
  const { name, size, budget, phone, occasion, style, notes } = leadData;
  let message = `Hi ${BUSINESS_INFO.name}! 👋\n\nI'd love personalized recommendations.\n\n`;
  message += `📋 My Details:\n`;
  if (name) message += `👤 Name: ${name}\n`;
  if (phone) message += `📱 Phone: ${phone}\n`;
  if (size) message += `📏 Size: ${size}\n`;
  if (budget) message += `💰 Budget: ${budget}\n`;
  if (occasion) message += `🎉 Occasion: ${occasion}\n`;
  if (style) message += `✨ Style: ${style}\n`;
  if (notes) message += `📝 Notes: ${notes}\n`;
  message += `\nLooking forward to your suggestions! 😊`;
  openWhatsApp(message);
};

export const sendCollectionInquiry = (collectionName) => {
  let message = `Hi! I'm browsing your *${collectionName}* collection.\n\n`;
  message += `Could you share latest arrivals, price range, and best sellers?\n\nThank you! 😊`;
  openWhatsApp(message);
};

export const sendStoreVisitInquiry = () => {
  const message = `Hi! I'd like to visit your store. Could you share the address, opening hours, and if I need an appointment?\n\nThank you!`;
  openWhatsApp(message);
};

export const isWhatsAppAvailable = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const getWhatsAppLink = (message = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const getWhatsAppNumber = () => WHATSAPP_NUMBER;
export const getBusinessInfo = () => BUSINESS_INFO;

export default {
  openWhatsApp,
  sendCartOrder,
  sendProductInquiry,
  sendQuickInquiry,
  sendBulkInquiry,
  sendGeneralInquiry,
  sendLeadMessage,
  sendCollectionInquiry,
  sendStoreVisitInquiry,
  isWhatsAppAvailable,
  getWhatsAppLink,
  getWhatsAppNumber,
  getBusinessInfo,
};
