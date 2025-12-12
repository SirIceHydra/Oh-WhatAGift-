/* eslint-disable @typescript-eslint/no-explicit-any */

import { createOrder as createOrderApi } from './woocommerce';

type CartItem = {
  productId: number;
  quantity: number;
  variationId?: number;
  variationAttributes?: Record<string, string>;
  customDesignUrl?: string;
  customDesignMode?: 'composite' | 'overlay';
  customUploadUrl?: string;
  customText?: string | string[];
  customTextColors?: string | string[];
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
    ...(() => {
      const meta: Array<{ key: string; value: string }> = [];
      if (item.customDesignUrl) meta.push({ key: 'custom_design_url', value: String(item.customDesignUrl) });
      if (item.customDesignMode) meta.push({ key: 'custom_design_mode', value: String(item.customDesignMode) });
      if (item.customUploadUrl) meta.push({ key: 'custom_upload_url', value: String(item.customUploadUrl) });
      if (item.customText !== undefined) {
        const textVal = Array.isArray(item.customText) ? JSON.stringify(item.customText) : String(item.customText);
        meta.push({ key: 'custom_text', value: textVal });
      }
      if (item.customTextColors !== undefined) {
        const colorsVal = Array.isArray(item.customTextColors) ? JSON.stringify(item.customTextColors) : String(item.customTextColors);
        meta.push({ key: 'custom_text_colors', value: colorsVal });
      }
      return meta.length > 0 ? { meta_data: meta } : {};
    })(),
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
