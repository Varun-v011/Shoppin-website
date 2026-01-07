/**
 * WhatsApp Integration for Curated Threads Lookbook
 * 
 * SETUP INSTRUCTIONS:
 * 1. Replace WHATSAPP_NUMBER below with your WhatsApp Business number
 * 2. Format: Country code + number (no spaces, no + sign)
 * 3. Examples:
 *    - India: "919876543210"
 *    - US: "14155552671"
 *    - UK: "447700900000"
 */

// ============================================================================
// CONFIGURATION - UPDATE THIS!
// ============================================================================

const WHATSAPP_NUMBER = "919876543210"; // ← CHANGE TO YOUR WHATSAPP NUMBER

const BUSINESS_INFO = {
  name: "Curated Threads",
  tagline: "Where Tradition Meets Contemporary Grace",
  instagram: "@curatedthreads",  // Optional
  website: "www.curatedthreads.com"  // Optional
};

// ============================================================================
// CORE WHATSAPP FUNCTIONS
// ============================================================================

/**
 * Main function to open WhatsApp with a message
 * @param {string} message - The pre-filled message
 * @param {boolean} newWindow - Open in new tab (default: true)
 */
export const openWhatsApp = (message = '', newWindow = true) => {
  const encodedMessage = encodeURIComponent(message);
  
  // Use api.whatsapp.com for mobile, wa.me for desktop
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const baseUrl = isMobile 
    ? `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;
  
  const url = `${baseUrl}?text=${encodedMessage}`;
  
  if (newWindow) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
};

// ============================================================================
// PRODUCT INQUIRY MESSAGES
// ============================================================================

/**
 * Send product inquiry with detailed information
 * @param {string} productCode - Product code/ID
 * @param {string} productTitle - Product name
 * @param {string} priceRange - Price range (optional)
 */
export const sendProductInquiry = (productCode, productTitle, priceRange = '') => {
  let message = `Hi ${BUSINESS_INFO.name}! 👋\n\n`;
  message += `I'm interested in this product:\n\n`;
  message += `📦 Product: ${productTitle}\n`;
  message += `🔢 Code: ${productCode}\n`;
  if (priceRange) message += `💰 Price Range: ${priceRange}\n`;
  message += `\nCould you please share:\n`;
  message += `✓ Availability\n`;
  message += `✓ Exact pricing\n`;
  message += `✓ Size options\n`;
  message += `✓ Delivery time\n`;
  message += `✓ Any current offers\n\n`;
  message += `Thank you! 😊`;
  
  openWhatsApp(message);
};

/**
 * Quick product inquiry (shorter version)
 */
export const sendQuickInquiry = (productCode, productTitle) => {
  const message = `Hi! I'm interested in ${productTitle} (Code: ${productCode}). Is this available?`;
  openWhatsApp(message);
};

/**
 * Bulk inquiry for multiple products
 * @param {Array} products - Array of product objects
 */
export const sendBulkInquiry = (products) => {
  let message = `Hi! I'm interested in these products:\n\n`;
  
  products.forEach((product, index) => {
    message += `${index + 1}. ${product.title} (${product.id})\n`;
  });
  
  message += `\nCan you share availability and total pricing?\n\nThank you!`;
  openWhatsApp(message);
};

// ============================================================================
// COLLECTION INQUIRIES
// ============================================================================

/**
 * Inquire about a specific collection
 * @param {string} collectionName - Name of the collection
 * @param {number} itemCount - Number of items in collection
 */
export const sendCollectionInquiry = (collectionName, itemCount = 0) => {
  let message = `Hi! I'm browsing your "${collectionName}" collection`;
  if (itemCount > 0) message += ` (${itemCount} pieces)`;
  message += `.\n\n`;
  message += `Could you share:\n`;
  message += `• Latest arrivals\n`;
  message += `• Price range\n`;
  message += `• Any special offers\n`;
  message += `• Best sellers from this collection\n\n`;
  message += `Thank you! 😊`;
  
  openWhatsApp(message);
};

// ============================================================================
// LEAD GENERATION & PERSONALIZATION
// ============================================================================

/**
 * Create detailed lead message with customer preferences
 * @param {Object} leadData - Customer information
 */
export const createLeadMessage = (leadData) => {
  const { name, size, budget, phone, occasion, style, notes } = leadData;
  
  let message = `Hi ${BUSINESS_INFO.name}! 👋\n\n`;
  message += `I'd love to get personalized recommendations.\n\n`;
  message += `📋 My Details:\n`;
  message += `👤 Name: ${name}\n`;
  if (phone) message += `📱 Phone: ${phone}\n`;
  if (size) message += `📏 Size: ${size}\n`;
  if (budget) message += `💰 Budget: ${budget}\n`;
  if (occasion) message += `🎉 Occasion: ${occasion}\n`;
  if (style) message += `✨ Style Preference: ${style}\n`;
  if (notes) message += `📝 Notes: ${notes}\n`;
  message += `\nLooking forward to your suggestions! 😊`;
  
  return message;
};

/**
 * Send lead message
 */
export const sendLeadMessage = (leadData) => {
  const message = createLeadMessage(leadData);
  openWhatsApp(message);
};

/**
 * Simple preferences inquiry
 */
export const sendPreferencesInquiry = (size, budget) => {
  const message = `Hi! I'm looking for pieces in size ${size} within ${budget} budget. What would you recommend?`;
  openWhatsApp(message);
};

// ============================================================================
// GENERAL INQUIRIES
// ============================================================================

/**
 * General inquiry (for hero CTA, floating button, etc.)
 */
export const sendGeneralInquiry = () => {
  const message = `Hi ${BUSINESS_INFO.name}! 👋\n\nI came across your beautiful collection and would love to know more.\n\nCan you help me with some information?\n\nThank you! 😊`;
  openWhatsApp(message);
};

/**
 * Visit store inquiry
 */
export const sendStoreVisitInquiry = () => {
  const message = `Hi! I'd like to visit your store. Could you share:\n• Store address\n• Opening hours\n• Appointment needed?\n\nThank you!`;
  openWhatsApp(message);
};

/**
 * Catalog request
 */
export const sendCatalogRequest = (collectionName = '') => {
  let message = `Hi! Could you share your latest catalog`;
  if (collectionName) message += ` for ${collectionName}`;
  message += `?\n\nThank you!`;
  openWhatsApp(message);
};

// ============================================================================
// ORDER & PURCHASE
// ============================================================================

/**
 * Place order via WhatsApp
 * @param {Object} orderData - Order details
 */
export const sendOrder = (orderData) => {
  const { 
    productCode, 
    productTitle, 
    size, 
    quantity = 1,
    name,
    phone,
    address,
    pincode,
    notes 
  } = orderData;
  
  let message = `🛍️ ORDER REQUEST\n\n`;
  message += `📦 Product Details:\n`;
  message += `• Product: ${productTitle}\n`;
  message += `• Code: ${productCode}\n`;
  message += `• Size: ${size}\n`;
  message += `• Quantity: ${quantity}\n\n`;
  
  if (name || address) {
    message += `📍 Delivery Information:\n`;
    if (name) message += `• Name: ${name}\n`;
    if (phone) message += `• Phone: ${phone}\n`;
    if (address) message += `• Address: ${address}\n`;
    if (pincode) message += `• Pincode: ${pincode}\n\n`;
  }
  
  if (notes) message += `📝 Notes: ${notes}\n\n`;
  
  message += `Please confirm:\n`;
  message += `✓ Availability\n`;
  message += `✓ Total cost (including delivery)\n`;
  message += `✓ Estimated delivery time\n`;
  message += `✓ Payment options\n\n`;
  message += `Thank you! 😊`;
  
  openWhatsApp(message);
};

/**
 * Request for custom measurements
 */
export const sendCustomMeasurementRequest = (productCode, productTitle) => {
  const message = `Hi! I'm interested in ${productTitle} (Code: ${productCode}).\n\nI'd like to know:\n• Is custom sizing available?\n• Additional charges?\n• Measurement guide\n\nThank you!`;
  openWhatsApp(message);
};

// ============================================================================
// CUSTOMER SERVICE
// ============================================================================

/**
 * Order status inquiry
 */
export const sendOrderStatusInquiry = (orderCode) => {
  const message = `Hi! I'd like to check the status of my order.\n\n📦 Order Code: ${orderCode}\n\nCould you provide an update?\n\nThank you!`;
  openWhatsApp(message);
};

/**
 * Return/Exchange request
 */
export const sendReturnRequest = (orderCode, reason) => {
  const message = `Hi! I need assistance with a return/exchange.\n\n📦 Order Code: ${orderCode}\n📝 Reason: ${reason}\n\nCould you guide me through the process?\n\nThank you!`;
  openWhatsApp(message);
};

/**
 * Size/Fit help
 */
export const sendSizingHelp = (productCode) => {
  const message = `Hi! I need help with sizing for product ${productCode}.\n\nCould you share:\n• Size chart\n• Fit guide\n• Your recommendation\n\nThank you!`;
  openWhatsApp(message);
};

/**
 * Care instructions request
 */
export const sendCareInstructions = (productCode) => {
  const message = `Hi! Could you share detailed care instructions for product ${productCode}?\n\nThank you!`;
  openWhatsApp(message);
};

// ============================================================================
// SPECIAL REQUESTS
// ============================================================================

/**
 * Request for styling advice
 */
export const sendStylingRequest = (occasion, budget = '') => {
  let message = `Hi! I need styling advice for ${occasion}.`;
  if (budget) message += ` My budget is ${budget}.`;
  message += `\n\nCould you suggest some looks?\n\nThank you! 😊`;
  openWhatsApp(message);
};

/**
 * Bulk order inquiry (for events, etc.)
 */
export const sendBulkOrderInquiry = (itemCount, occasion) => {
  const message = `Hi! I'm looking to place a bulk order for ${itemCount} pieces for ${occasion}.\n\nCould we discuss:\n• Bulk pricing\n• Customization options\n• Delivery timeline\n\nThank you!`;
  openWhatsApp(message);
};

/**
 * Gift wrapping request
 */
export const sendGiftWrappingInquiry = (productCode) => {
  const message = `Hi! I'd like to order ${productCode} as a gift.\n\nDo you offer:\n• Gift wrapping\n• Gift message card\n• Additional charges\n\nThank you!`;
  openWhatsApp(message);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if device supports WhatsApp
 */
export const isWhatsAppAvailable = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get WhatsApp link (for href attributes)
 */
export const getWhatsAppLink = (message = '') => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

/**
 * Copy WhatsApp number to clipboard
 */
export const copyWhatsAppNumber = async () => {
  try {
    await navigator.clipboard.writeText(WHATSAPP_NUMBER);
    alert('WhatsApp number copied!');
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// ============================================================================
// ANALYTICS TRACKING (Optional - integrate with your analytics)
// ============================================================================

/**
 * Track WhatsApp interactions
 */
export const trackWhatsAppClick = (eventName, data = {}) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'WhatsApp',
      event_label: data.label || '',
      ...data
    });
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', eventName, data);
  }
  
  // Console log for debugging
  console.log('WhatsApp Event:', eventName, data);
};

/**
 * Open WhatsApp with tracking
 */
export const openWhatsAppWithTracking = (message, eventLabel) => {
  trackWhatsAppClick('whatsapp_click', {
    label: eventLabel,
    message_type: eventLabel
  });
  openWhatsApp(message);
};

// ============================================================================
// CONFIGURATION GETTERS
// ============================================================================

export const getWhatsAppNumber = () => WHATSAPP_NUMBER;
export const getBusinessInfo = () => BUSINESS_INFO;

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Core
  openWhatsApp,
  
  // Products
  sendProductInquiry,
  sendQuickInquiry,
  sendBulkInquiry,
  
  // Collections
  sendCollectionInquiry,
  
  // Lead Generation
  sendLeadMessage,
  createLeadMessage,
  sendPreferencesInquiry,
  
  // General
  sendGeneralInquiry,
  sendStoreVisitInquiry,
  sendCatalogRequest,
  
  // Orders
  sendOrder,
  sendCustomMeasurementRequest,
  
  // Customer Service
  sendOrderStatusInquiry,
  sendReturnRequest,
  sendSizingHelp,
  sendCareInstructions,
  
  // Special
  sendStylingRequest,
  sendBulkOrderInquiry,
  sendGiftWrappingInquiry,
  
  // Utilities
  isWhatsAppAvailable,
  getWhatsAppLink,
  copyWhatsAppNumber,
  trackWhatsAppClick,
  openWhatsAppWithTracking,
  getWhatsAppNumber,
  getBusinessInfo
};