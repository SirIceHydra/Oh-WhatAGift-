// PayFast Configuration - NO MORE SECRETS IN FRONTEND!
// All secrets are now secured in WordPress functions.php
export const PAYFAST_CONFIG = {
  // URLs only (no secrets)
  SANDBOX_URL: 'https://sandbox.payfast.co.za/eng/process',
  PRODUCTION_URL: 'https://www.payfast.co.za/eng/process',
  RETURN_URL: import.meta.env?.VITE_PAYFAST_RETURN_URL || process.env.REACT_APP_PAYFAST_RETURN_URL || (typeof window !== 'undefined' ? window.location.origin + '/payment/success' : ''),
  CANCEL_URL: import.meta.env?.VITE_PAYFAST_CANCEL_URL || process.env.REACT_APP_PAYFAST_CANCEL_URL || (typeof window !== 'undefined' ? window.location.origin + '/payment/failure' : ''),
  NOTIFY_URL: import.meta.env?.VITE_PAYFAST_NOTIFY_URL || process.env.REACT_APP_PAYFAST_NOTIFY_URL || '',
  TEST_MODE: (import.meta.env?.VITE_PAYFAST_TEST_MODE || process.env.REACT_APP_PAYFAST_TEST_MODE || 'true') === 'true',
};

// WooCommerce Configuration - NO MORE SECRETS IN FRONTEND!
// All WooCommerce API calls now go through secure WordPress endpoints
export const WOOCOMMERCE_CONFIG = {
  BASE_URL: import.meta.env?.VITE_WORDPRESS_URL || process.env.REACT_APP_WORDPRESS_URL || '',
  API_VERSION: 'alrafahia/v1', // Changed from 'wc/v3' to secure WordPress endpoint
  // REMOVED: CONSUMER_KEY and CONSUMER_SECRET - now handled by WordPress backend
  PRODUCTS_PER_PAGE: 12,
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 5 * 60 * 1000,
};

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT: (id) => `/products/${id}`,
  CATEGORIES: '/products/categories',
  ORDERS: '/orders',
  ORDER: (id) => `/orders/${id}`,
  PAYFAST_PROCESS: (PAYFAST_CONFIG.TEST_MODE ? PAYFAST_CONFIG.SANDBOX_URL : PAYFAST_CONFIG.PRODUCTION_URL),
};

export const DEFAULTS = {
  COUNTRY: 'ZA',
  CURRENCY: 'ZAR',
  PAYMENT_METHOD: 'payfast',
  CART_STORAGE_KEY: 'alrafahia-cart',
  PAGE: 1,
  PER_PAGE: 12,
};

export const ERROR_MESSAGES = {
  API_ERROR: 'API request failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  ORDER_CREATION_FAILED: 'Failed to create order. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  CART_EMPTY: 'Your cart is empty.',
};

export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully.',
  PAYMENT_SUCCESS: 'Payment completed successfully.',
};



