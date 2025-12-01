/* PayFast client helpers - frontend holds no secrets. The WP backend signs and returns a redirect URL. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PAYFAST_CONFIG } from '@/utils/constants';

type PaymentInit = {
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  itemName?: string;
  itemDescription?: string;
  lineItems?: Array<{ product_id: number; quantity: number }>;
};

export function generatePayFastPaymentData(init: PaymentInit) {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : '';
  const returnUrl = PAYFAST_CONFIG.RETURN_URL || (origin ? `${origin}/payment/success` : '');
  const cancelUrl = PAYFAST_CONFIG.CANCEL_URL || (origin ? `${origin}/payment/failure` : '');

  return {
    order_id: init.orderId,
    order_number: init.orderNumber,
    customer_name: init.customerName,
    customer_email: init.customerEmail,
    customer_phone: init.customerPhone || '',
    amount: Number(init.amount),
    item_name: init.itemName || `Order #${init.orderNumber}`,
    item_description: init.itemDescription || '',
    return_url: returnUrl,
    cancel_url: cancelUrl,
    line_items: init.lineItems || [],
  };
}

// Minimal HTTP helper (mirrors services/woocommerce http config)
function getBase(): string {
  const base =
    (typeof process !== 'undefined' &&
      ((process.env.NEXT_PUBLIC_WORDPRESS_URL as string) ||
        (process.env.REACT_APP_WORDPRESS_URL as string))) ||
    '';
  return String(base).replace(/\/+$/, '');
}

function getNamespace(): string {
  return (
    (typeof process !== 'undefined' &&
      ((process.env.NEXT_PUBLIC_WP_API_NAMESPACE as string) ||
        (process.env.REACT_APP_WP_API_NAMESPACE as string))) ||
    'alrafahia/v1'
  );
}

function getApiKey(): string {
  return (
    (typeof process !== 'undefined' &&
      ((process.env.NEXT_PUBLIC_WP_API_KEY as string) ||
        (process.env.REACT_APP_WP_API_KEY as string))) ||
    'alrafahia-react-2025'
  );
}

export async function submitPayFastPayment(data: any): Promise<{
  success: boolean;
  redirectUrl?: string;
  paymentId?: string | number;
  error?: string;
  message?: string;
  formData?: Record<string, any>;
  orderedFields?: string[];
}> {
  const base = getBase();
  if (!base) {
    throw new Error('WORDPRESS_URL is not configured');
  }
  const ns = getNamespace();
  const url = `${base}/wp-json/${ns}/payments/create`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': getApiKey(),
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      success: false,
      error: json?.message || res.statusText || 'Payment request failed',
    };
  }

  // WordPress handler returns: { success, payment_url, form_data, ordered_fields }
  if (json?.success) {
    const formData = json?.form_data && typeof json.form_data === 'object' ? json.form_data : {};
    const orderedFields: string[] =
      Array.isArray(json?.ordered_fields) && json.ordered_fields.length > 0
        ? json.ordered_fields
        : Object.keys(formData);

    return {
      success: true,
      redirectUrl: json?.payment_url || json?.redirect_url,
      paymentId: json?.payment_id,
      message: 'OK',
      formData,
      orderedFields,
    };
  }

  return {
    success: false,
    error: json?.error || 'Payment initialization failed',
    message: json?.message,
  };
}


