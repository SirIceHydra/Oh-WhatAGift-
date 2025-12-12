import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { storage, calculateCartTotal, calculateCartItemCount, generateUniqueId } from '../../../utils/helpers';
import { DEFAULTS, ERROR_MESSAGES } from '../../../utils/constants';

type CartItem = {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stockQuantity?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  variationId?: number;
  variationName?: string;
  variationAttributes?: any;
  bundleSelections?: any[];
  soldIndividually?: boolean;
  // Optional customiser metadata
  customDesignUrl?: string;
  customDesignMode?: 'composite' | 'overlay';
  customUploadUrl?: string;
  customText?: string | string[];
  customTextColors?: string | string[];
};

type Cart = { items: CartItem[]; total: number; itemCount: number };

type Product = {
  id: number;
  name: string;
  price: number;
  images: string[];
  stockQuantity?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  type?: string;
  variations?: any[];
  soldIndividually?: boolean;
};

interface CartContextType {
  cart: Cart;
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number, variationId?: number, variationName?: string, bundleSelections?: any[], variationAttributes?: any, customMeta?: { designUrl?: string; mode?: 'composite' | 'overlay'; uploadUrl?: string; text?: string | string[]; textColors?: string | string[] }) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartItem: (productId: number) => CartItem | undefined;
  isInCart: (productId: number) => boolean;
  getCartItemQuantity: (productId: number) => number;
  clearError: () => void;
  // Global popup state
  popupOpen: boolean;
  popupMessage: string;
  showPopup: (message: string) => void;
  hidePopup: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize with empty cart to prevent hydration mismatch
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const lastItemCountRef = React.useRef<number>(cart.itemCount);
  const pendingPopupRef = React.useRef<string | null>(null);

  // Hydrate cart from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    const savedCart = storage.get(DEFAULTS.CART_STORAGE_KEY);
    if (savedCart) {
      setCart(savedCart);
      lastItemCountRef.current = savedCart.itemCount || 0;
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only save to localStorage after hydration to prevent mismatches
    if (isHydrated) {
      storage.set(DEFAULTS.CART_STORAGE_KEY, cart);
      // Notify listeners outside of React context (e.g., Header Basket)
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated', { detail: { itemCount: cart.itemCount } }));
        }
      } catch {}
    }
  }, [cart, isHydrated]);

  // Separate effect to show popup when cart item count increases
  useEffect(() => {
    if (cart.itemCount > lastItemCountRef.current && pendingPopupRef.current) {
      setPopupMessage(pendingPopupRef.current);
      setPopupOpen(true);
      pendingPopupRef.current = null; // Clear after showing
    }
    lastItemCountRef.current = cart.itemCount;
  }, [cart.itemCount]);

  const showPopup = useCallback((message: string) => {
    setPopupMessage(message);
    setPopupOpen(true);
  }, []);
  
  const hidePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1, variationId?: number, variationName?: string, bundleSelections?: any[], variationAttributes?: any, customMeta?: { designUrl?: string; mode?: 'composite' | 'overlay'; uploadUrl?: string; text?: string | string[]; textColors?: string | string[] }) => {
    setLoading(true);
    setError(null);
    
    try {
      // For variable products with variations, use the variation data
      let effectivePrice = product.price;
      let effectiveStockStatus = product.stockStatus;
      let effectiveStockQuantity = product.stockQuantity;
      let effectiveImage = product.images[0] || '';
      let effectiveName = product.name;
      let effectiveSoldIndividually = product.soldIndividually;
      
      // If this is a variation, find the variation details
      if (variationId && product.type === 'variable' && product.variations) {
        const variation = product.variations.find(v => v.id === variationId);
        if (variation) {
          effectivePrice = variation.price;
          effectiveStockStatus = variation.stockStatus;
          effectiveStockQuantity = variation.stockQuantity;
          effectiveImage = variation.image || product.images[0] || '';
          effectiveName = `${product.name} - ${variationName || variation.displayName}`;
          effectiveSoldIndividually = variation.soldIndividually;
        }
      }

      // Oh What A Gift: products are made-to-order, so stock levels must NOT block adding to cart.
      // We normalise stock to "instock" with undefined quantity to bypass stock validation checks below,
      // while still allowing stock information to be displayed elsewhere if needed.
      effectiveStockStatus = 'instock';
      effectiveStockQuantity = undefined;
      
      // VALIDATE using LIVE product data (not stale cart data)
      // NOTE: For made-to-order products we skip hard stock blocking checks, so users can always add to cart.
      
      // Check if item already in cart and validate new total quantity
      let shouldShowPopup = false;
      setCart(prevCart => {
        // Check if this item has customization
        const hasCustomization = !!(customMeta?.designUrl || customMeta?.uploadUrl || customMeta?.text || customMeta?.textColors);
        
        // For customized items, always create a new cart item (don't merge with existing)
        // For non-customized items, check if the same variation is already in cart
        let existingItem = null;
        if (!hasCustomization) {
          // Only check for existing items if this item has no customization
          existingItem = variationId 
            ? prevCart.items.find(item => {
                // Match product and variation, and ensure the existing item also has no customization
                const existingHasCustom = !!(item.customDesignUrl || item.customUploadUrl || item.customText || item.customTextColors);
                return item.productId === product.id && item.variationId === variationId && !existingHasCustom;
              })
            : prevCart.items.find(item => {
                // Match product (no variation), and ensure the existing item also has no customization
                const existingHasCustom = !!(item.customDesignUrl || item.customUploadUrl || item.customText || item.customTextColors);
                return item.productId === product.id && !item.variationId && !existingHasCustom;
              });
        }
        
        // Check sold individually restriction
        if (effectiveSoldIndividually) {
          if (existingItem && existingItem.quantity >= 1) {
            setError('This item can only be purchased once per order.');
            setLoading(false);
            return prevCart; // Return unchanged cart
          }
          // Also check if trying to add more than 1 of a sold individually item
          if (quantity > 1) {
            setError('This item can only be purchased once per order.');
            setLoading(false);
            return prevCart; // Return unchanged cart
          }
        }
        
        // Safe to update cart now
        shouldShowPopup = true;
        if (existingItem && !hasCustomization) {
          // Only merge if no customization and item already exists
          const newQuantity = existingItem.quantity + quantity;
          const updatedItems = prevCart.items.map(item => 
            (variationId ? (item.productId === product.id && item.variationId === variationId) : (item.productId === product.id && !item.variationId))
              ? { 
                  ...item, 
                  quantity: newQuantity, 
                  ...(customMeta?.designUrl ? { customDesignUrl: customMeta.designUrl } : {}), 
                  ...(customMeta?.mode ? { customDesignMode: customMeta.mode } : {}),
                  ...(customMeta?.uploadUrl ? { customUploadUrl: customMeta.uploadUrl } : {}),
                  ...(customMeta?.text !== undefined ? { customText: customMeta.text } : {}),
                  ...(customMeta?.textColors !== undefined ? { customTextColors: customMeta.textColors } : {}),
                } : item
          );
          return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
        } else {
          const newItem: CartItem = {
            id: generateUniqueId(),
            productId: product.id,
            name: effectiveName,
            price: effectivePrice,
            quantity,
            image: effectiveImage,
            stockQuantity: effectiveStockQuantity,
            stockStatus: effectiveStockStatus,
            variationId,
            variationName,
            variationAttributes,
            bundleSelections,
            soldIndividually: effectiveSoldIndividually,
            ...(customMeta?.designUrl ? { customDesignUrl: customMeta.designUrl } : {}),
            ...(customMeta?.mode ? { customDesignMode: customMeta.mode } : {}),
            ...(customMeta?.uploadUrl ? { customUploadUrl: customMeta.uploadUrl } : {}),
            ...(customMeta?.text !== undefined ? { customText: customMeta.text } : {}),
            ...(customMeta?.textColors !== undefined ? { customTextColors: customMeta.textColors } : {}),
          };
          const newItems = [...prevCart.items, newItem];
          return { items: newItems, total: calculateCartTotal(newItems), itemCount: calculateCartItemCount(newItems) };
        }
      });
      
      // Store the product name and show popup after cart state updates
      if (shouldShowPopup) {
        pendingPopupRef.current = effectiveName;
        // Use setTimeout to ensure popup shows after React processes the state update
        setTimeout(() => {
          if (pendingPopupRef.current === effectiveName) {
            setPopupMessage(effectiveName);
            setPopupOpen(true);
            pendingPopupRef.current = null;
          }
        }, 10);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showPopup]);

  const removeFromCart = useCallback((productId: number) => {
    setLoading(true);
    setError(null);
    try {
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(i => i.productId !== productId);
        return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = useCallback((productId: number, quantity: number) => {
    setLoading(true);
    setError(null);
    
    try {
      if (quantity <= 0) { 
        removeFromCart(productId); 
        return; 
      }
      
      setCart(prevCart => {
        const item = prevCart.items.find(i => i.productId === productId);
        if (!item) {
          setError('Item not found in cart');
          setLoading(false);
          return prevCart;
        }
        
        // Check sold individually restriction
        if (item.soldIndividually && quantity > 1) {
          setError('This item can only be purchased once per order.');
          setLoading(false);
          return prevCart;
        }
        
        if (item.stockQuantity !== undefined && quantity > item.stockQuantity) {
          setError(`Only ${item.stockQuantity} items available in stock`);
          setLoading(false);
          return prevCart;
        }
        
        const updatedItems = prevCart.items.map(i => i.productId === productId ? { ...i, quantity } : i);
        return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0, itemCount: 0 });
  }, []);

  const getCartItem = useCallback((productId: number): CartItem | undefined => cart.items.find(i => i.productId === productId), [cart.items]);
  const isInCart = useCallback((productId: number): boolean => cart.items.some(i => i.productId === productId), [cart.items]);
  const getCartItemQuantity = useCallback((productId: number): number => (cart.items.find(i => i.productId === productId)?.quantity ?? 0), [cart.items]);
  const clearError = useCallback(() => setError(null), []);

  const value: CartContextType = { 
    cart, 
    loading, 
    error, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    getCartItem, 
    isInCart, 
    getCartItemQuantity, 
    clearError,
    popupOpen,
    popupMessage,
    showPopup,
    hidePopup
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
