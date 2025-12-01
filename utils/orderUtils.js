/**
 * Order utility functions for Oracle Gaming
 */

/**
 * Generate a unique order ID for tracking
 * Format: ORACLE-{timestamp}-{random}
 * @returns {string} Unique order ID
 */
export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `ORACLE-${timestamp}-${random}`.toUpperCase();
};

/**
 * Generate a customer reference for PayFast
 * @param {string} customerName - Customer's full name
 * @param {string} orderId - Generated order ID
 * @returns {string} Customer reference
 */
export const generateCustomerRef = (customerName, orderId) => {
  const nameSlug = customerName.toLowerCase().replace(/\s+/g, '-');
  return `${nameSlug}-${orderId}`;
};

/**
 * Format order items for backend API
 * @param {Array} cartItems - Cart items
 * @returns {Array} Formatted line items
 */
export const formatOrderItems = (cartItems) => {
  return cartItems.map(item => ({
    product_id: item.productId,
    quantity: item.quantity,
    variation_id: item.variationId || null,
    variation_name: item.variationName || null
  }));
};

/**
 * Validate order data before submission
 * @param {Object} orderData - Order data to validate
 * @returns {Object} Validation result
 */
export const validateOrderData = (orderData) => {
  const errors = [];
  
  if (!orderData.line_items || orderData.line_items.length === 0) {
    errors.push('No items in cart');
  }
  
  if (!orderData.customer_name || orderData.customer_name.trim() === '') {
    errors.push('Customer name is required');
  }
  
  if (!orderData.customer_email || orderData.customer_email.trim() === '') {
    errors.push('Customer email is required');
  }
  
  if (!orderData.amount || orderData.amount <= 0) {
    errors.push('Invalid order amount');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
