// REMOVED: MD5 import - no longer needed for signature generation
// Signature generation is now handled securely by WordPress backend

export function formatPrice(value) {
  // Use consistent formatting to avoid hydration mismatches between server and client
  // Always use period as decimal separator and comma as thousands separator
  const num = Number(value || 0);
  const parts = num.toFixed(2).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  // Add thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `R ${formattedInteger}.${decimalPart}`;
}

export const storage = {
  get(key) { 
    try { 
      if (typeof window === 'undefined') return null;
      const v = localStorage.getItem(key); 
      return v ? JSON.parse(v) : null; 
    } catch { 
      return null; 
    } 
  },
  set(key, val) { 
    try { 
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(val)); 
    } catch {} 
  },
  remove(key) { 
    try { 
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key); 
    } catch {} 
  },
};

/**
 * REMOVED: generatePayFastSignature function
 * 
 * Security Enhancement:
 * PayFast signature generation with merchant secrets is now handled
 * securely by WordPress backend (functions.php). This prevents
 * exposing sensitive credentials in the frontend code.
 * 
 * The WordPress endpoint /alrafahia/v1/payments/create now handles:
 * - Merchant ID and Key
 * - Passphrase
 * - Signature generation
 * 
 * Frontend only sends customer and order data to WordPress.
 */

export function isProductInStock(stockStatus, stockQuantity) {
  // Treat undefined/null stock quantity as unknown -> rely on stock status
  if (!stockStatus) return true; // default to true if status missing
  if (String(stockStatus).toLowerCase() === 'outofstock') return false;
  if (stockQuantity === undefined || stockQuantity === null) return true;
  return Number(stockQuantity) > 0;
}

export function getStockStatusText(stockStatus, stockQuantity) {
  switch (stockStatus) {
    case 'instock': return stockQuantity ? `${stockQuantity} in stock` : 'In stock';
    case 'outofstock': return 'Out of stock';
    case 'onbackorder': return 'On backorder';
    default: return 'Stock status unknown';
  }
}

// Cart helpers
export function calculateCartTotal(items) {
  try { return (items || []).reduce((sum, i) => sum + (Number(i.price || 0) * Number(i.quantity || 0)), 0); } catch { return 0; }
}

export function calculateCartItemCount(items) {
  try { return (items || []).reduce((sum, i) => sum + Number(i.quantity || 0), 0); } catch { return 0; }
}

export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Checkout validation
export function validateCheckoutForm(formData, deliveryMethod = 'shipping') {
  const errors = {};
  if (!formData?.firstName?.trim()) errors.firstName = 'First name is required';
  if (!formData?.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!formData?.email?.trim()) errors.email = 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData?.email && !emailRegex.test(formData.email)) errors.email = 'Valid email is required';
  if (!formData?.phone?.trim()) errors.phone = 'Phone number is required';
  
  // Only validate address fields if shipping is selected
  if (deliveryMethod === 'shipping') {
    if (!formData?.address?.trim()) errors.address = 'Address is required';
    if (!formData?.city?.trim()) errors.city = 'City is required';
    if (!formData?.postalCode?.trim()) errors.postalCode = 'Postal code is required';
    if (!formData?.country?.trim()) errors.country = 'Country is required';
    if (!formData?.province?.trim()) errors.province = 'Province is required';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

// WooCommerce -> App product transforms
export function transformWooCommerceProduct(woo) {
  if (!woo) return null;
  // attempt to derive brand from brands array or attributes if present
  let brand = woo.brand; // prefer server-provided brand from WordPress endpoint
  if (Array.isArray(woo.brands) && woo.brands.length > 0) {
    brand = woo.brands[0].name;
  } else if (Array.isArray(woo.attributes)) {
    const attr = woo.attributes.find(a => {
      const name = (a?.name || '').toLowerCase();
      const slug = (a?.slug || '').toLowerCase();
      return name === 'brand' || slug === 'brand' || slug === 'pa_brand';
    });
    if (attr) {
      if (Array.isArray(attr.options) && attr.options.length > 0) {
        brand = attr.options[0];
      } else if (typeof attr.option === 'string' && attr.option) {
        brand = attr.option;
      }
    }
  }
  const price = parseFloat(woo.price || woo.regular_price || '0') || 0;
  const regularPrice = parseFloat(woo.regular_price || woo.price || '0') || 0;
  const salePrice = woo.sale_price ? parseFloat(woo.sale_price) : undefined;
  // Transform variations if present from WP backend
  let variations = undefined;
  if (Array.isArray(woo.variations)) {
    variations = woo.variations.map(v => ({
      id: v.id,
      sku: v.sku,
      price: parseFloat(v.price || v.regular_price || '0') || 0,
      regularPrice: parseFloat(v.regular_price || v.price || '0') || 0,
      salePrice: v.sale_price ? parseFloat(v.sale_price) : undefined,
      onSale: Boolean(v.on_sale),
      stockStatus: v.stock_status || 'instock',
      stockQuantity: typeof v.stock_quantity === 'number' ? v.stock_quantity : undefined,
      attributes: v.attributes || {},
      image: v?.image?.src || undefined,
      displayName: Object.values(v.attributes || {}).join(' / ')
    }));
  }

  // Variation attributes map (server uses snake_case)
  const variationAttributes = woo.variation_attributes || woo.variationAttributes || undefined;
  const defaultAttributes = woo.default_attributes || woo.defaultAttributes || undefined;

  return {
    id: woo.id,
    name: woo.name,
    description: woo.description || '',
    shortDescription: (woo.short_description || '').replace(/<[^>]*>/g, ''),
    type: woo.type || undefined,
    price,
    regularPrice,
    salePrice,
    onSale: Boolean(woo.on_sale),
    images: Array.isArray(woo.images) ? woo.images.map(i => i.src) : [],
    stockStatus: woo.stock_status || 'instock',
    stockQuantity: typeof woo.stock_quantity === 'number' ? woo.stock_quantity : undefined,
    categories: Array.isArray(woo.categories) ? woo.categories.map(c => c.name) : [],
    brand,
    slug: woo.slug,
    permalink: woo.permalink,
    hasVariations: woo.has_variations || woo.type === 'variable' || false,
    variations,
    variationAttributes,
    defaultAttributes,
    soldIndividually: Boolean(woo.sold_individually),
  };
}

export function transformWooCommerceProducts(list) {
  return Array.isArray(list) ? list.map(transformWooCommerceProduct) : [];
}


