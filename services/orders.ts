/* eslint-disable @typescript-eslint/no-explicit-any */
import { createOrder as createOrderApi } from './woocommerce';

type CartItem = {
  productId: number;
  quantity: number;
  variationId?: number;
  variationAttributes?: Record<string, string>;
  // Optional customization payload carried from cart
  customization?: {
    overlayPngDataUrl?: string;
    config?: {
      imagePosition?: { x: number; y: number };
      textPosition?: { x: number; y: number };
      text?: string;
      textColor?: string;
      textSize?: number;
      instructions?: string;
    };
  };
};

export async function createOrder(
  cartItems: CartItem[],
  formData: any
): Promise<{ id: number; order_number?: string }> {
  // Build WooCommerce-compatible payload for our secure WP endpoint
  const line_items = (cartItems || []).map((item) => ({
    product_id: Number(item.productId),
    quantity: Number(item.quantity),
    ...(item.variationId ? { variation_id: Number(item.variationId) } : {}),
    ...(item.variationAttributes && Object.keys(item.variationAttributes).length > 0
      ? { variation: item.variationAttributes }
      : {}),
    ...(item.customization && (item.customization.overlayPngDataUrl || item.customization.config)
      ? {
          meta_data: [
            ...(item.customization.overlayPngDataUrl
              ? [{ key: 'customization_overlay_png', value: String(item.customization.overlayPngDataUrl) }]
              : []),
            ...(item.customization.config
              ? [{ key: 'customization_config', value: JSON.stringify(item.customization.config) }]
              : []),
          ],
        }
      : {}),
  }));

  const billing = {
    first_name: String(formData.firstName || ''),
    last_name: String(formData.lastName || ''),
    email: String(formData.email || ''),
    phone: String(formData.phone || ''),
    address_1: String(formData.address || ''),
    city: String(formData.city || ''),
    state: String(formData.province || ''),
    postcode: String(formData.postalCode || ''),
    country: String(formData.country || 'ZA'),
  };

  const shipping = {
    first_name: String(formData.firstName || ''),
    last_name: String(formData.lastName || ''),
    address_1: String(formData.address || ''),
    city: String(formData.city || ''),
    state: String(formData.province || ''),
    postcode: String(formData.postalCode || ''),
    country: String(formData.country || 'ZA'),
  };

  const shipping_lines =
    formData.shippingCost !== undefined
      ? [
          {
            method_title: String(formData.shippingMethodTitle || 'Shipping'),
            method_id: String(formData.shippingMethodId || 'flat_rate'),
            total: String(Number(formData.shippingCost || 0)),
          },
        ]
      : [];

  const payload = {
    line_items,
    billing,
    shipping,
    shipping_lines,
  };

  const resp = await createOrderApi(payload);
  if (!resp?.success || !resp?.orderId) {
    throw new Error(resp?.error || 'Failed to create order');
  }
  return { id: resp.orderId, order_number: resp.orderNumber };
}


