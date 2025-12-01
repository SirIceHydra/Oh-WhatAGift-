// Public entrypoint for the shop framework
export * from './core/ShopProvider';
export * from './core/config/ShopConfig';
export * from './core/ports';

// Hooks
export * from './core/hooks/useCart';
export * from './core/hooks/useProducts';
export * from './core/hooks/useCheckout';

// UI
export { ProductCard } from './ui/ProductCard';
export { ProductGrid } from './ui/ProductGrid';
export { ProductDetailsModal } from './ui/ProductDetailsModal';
export { VariationSelector } from './ui/VariationSelector';
export { RelatedProducts } from './ui/RelatedProducts';

// Pages
export { default as ShopPage } from './pages/Shop';
export { default as DetailsPage } from './pages/DetailsPage';
export { default as CartPage } from './pages/Cart';
export { default as CheckoutPage } from './pages/Checkout';
export { default as PaymentSuccessPage } from './pages/PaymentSuccess';
export { default as PaymentFailurePage } from './pages/PaymentFailure';

