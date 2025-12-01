// Shop-native checkout hook (migrated from legacy implementation)
import { useState, useCallback } from 'react';
import { generatePayFastPaymentData, submitPayFastPayment } from '../../../services/payfast';
import { createOrder } from '../../../services/orders';
import { validateCheckoutForm } from '../../../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../utils/constants';

interface UseCheckoutReturn {
  loading: boolean;
  error: string | null;
  orderId: number | null;
  paymentUrl: string | null;
  createOrder: (cartItems: any[], formData: any, deliveryMethod?: string) => Promise<any>;
  processPayment: (orderId: number, orderNumber: string, customerData: any, cartItems?: any[]) => Promise<any>;
  clearError: () => void;
  resetCheckout: () => void;
}

export function useCheckout(): UseCheckoutReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const createOrderHandler = useCallback(async (
    cartItems: any[],
    formData: any,
    deliveryMethod: string = 'shipping'
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    setOrderId(null);
    setPaymentUrl(null);

    try {
      const validation = validateCheckoutForm(formData, deliveryMethod);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }
      if (cartItems.length === 0) {
        throw new Error(ERROR_MESSAGES.CART_EMPTY);
      }

      const order = await createOrder(cartItems, formData);
      setOrderId(order.id);

      return { success: true, orderId: order.id, message: SUCCESS_MESSAGES.ORDER_CREATED };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.ORDER_CREATION_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (
    orderId: number,
    orderNumber: string,
    customerData: any,
    cartItems: any[] = []
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      // ✅ REMOVED: Redundant frontend stock validation
      // Backend already validates stock with proper locking in handle_payfast_payment()
      // Removing this prevents race conditions between two separate validations

      const paymentData = generatePayFastPaymentData({
        orderId,
        orderNumber,
        customerName: `${customerData.firstName} ${customerData.lastName}`,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        amount: customerData.total,
        itemName: `Order #${orderNumber}`,
        itemDescription: `Oracle Gaming Order #${orderNumber}`,
      });

      const paymentResponse = await submitPayFastPayment(paymentData);

      // ✅ Successful initialization - redirect to PayFast with full query string
      if (paymentResponse.success && paymentResponse.redirectUrl && paymentResponse.formData) {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams();
          Object.entries(paymentResponse.formData).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') return;
            params.append(key, String(value));
          });

          const separator = paymentResponse.redirectUrl.includes('?') ? '&' : '?';
          const targetUrl = `${paymentResponse.redirectUrl}${separator}${params.toString()}`;
          window.location.href = targetUrl;
        }

        // Return metadata for callers (not strictly needed for redirect)
        return {
          success: true,
          orderId,
          paymentId: paymentResponse.paymentId,
          redirectUrl: paymentResponse.redirectUrl,
          message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
        };
      }
      
      // ✅ Handle stock validation errors (redirect to failure page when provided)
      if (paymentResponse.error === 'insufficient_stock') {
        const failureUrl = paymentResponse.message || '/payment/failure?reason=out_of_stock';
        if (typeof window !== 'undefined') {
          window.location.href = failureUrl;
        }
        return {
          success: false,
          error: 'insufficient_stock',
          message: paymentResponse.message || 'Items no longer available',
          redirectUrl: failureUrl,
        };
      }
      
      throw new Error(paymentResponse.error || ERROR_MESSAGES.PAYMENT_FAILED);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.PAYMENT_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const resetCheckout = useCallback(() => {
    setLoading(false);
    setError(null);
    setOrderId(null);
    setPaymentUrl(null);
  }, []);

  return { loading, error, orderId, paymentUrl, createOrder: createOrderHandler, processPayment, clearError, resetCheckout };
}


