# Shop Framework (Portable WooCommerce + PayFast)

This folder contains a portable, provider-agnostic e-commerce layer designed to be copy-pasted into any React app (Vite/CRA/Next.js client routes). It targets WooCommerce (catalog/orders) and PayFast (hosted checkout) by default, with a clean provider interface for future gateways.

## Goals
- Drop-in folder: minimal external wiring
- Provider interfaces for Catalog and Payments
- Keep UI and hooks provider-agnostic
- Works with hosted checkout redirects (no server needed for front-end)

## Folder Structure
```
src/shop/
  core/
    ShopProvider.tsx            # Provides runtime ShopConfig
    config/ShopConfig.ts        # Shape + loader mapping current app constants
    ports.ts                    # Interfaces: ShopDataProvider, PaymentProvider
    hooks/
      useProducts.ts            # Provider-agnostic products hook
  adapters/
    catalog/woocommerce.ts      # WooCommerce REST implementation of ShopDataProvider
    payments/payfast.ts         # PayFast hosted checkout implementation
  ui/
    ProductGrid.tsx             # Re-export shim to existing grid (provider-agnostic UI)
  pages/
    Shop.tsx                    # Example shop page using new hook/UI
  index.ts                      # Public exports
```

> Note: More modules (cart, checkout, success/cancel pages, product cards) can be added or swapped in; this is intentionally modular.

## Concepts
- ShopProvider: supplies a `ShopConfig` (currency, WooCommerce, PayFast config). By default, it reads your current `src/utils/constants.ts` so it works immediately.
- Ports (interfaces):
  - `ShopDataProvider`: products, categories, create order
  - `PaymentProvider`: `startPayment()` -> returns form-post/redirect info
- Adapters: concrete implementations for WooCommerce and PayFast.
- UI: provider-agnostic components; you can keep your existing components and re-export them here or replace with your own.

## Config
`ShopConfig` is the single place to configure providers. The default loader (`ShopConfigFromExisting`) maps from your current `src/utils/constants.ts` so no env changes are required.

To override explicitly in your app root:
```tsx
import { ShopProvider } from '@shop/core/ShopProvider';
import { type ShopConfig } from '@shop/core/config/ShopConfig';

const shopConfig: ShopConfig = {
  paymentProvider: 'payfast',
  currency: 'ZAR',
  wooCommerce: {
    baseUrl: 'https://example.com',
    consumerKey: 'ck_...',
    consumerSecret: 'cs_...',
    productsPerPage: 12,
  },
  payfast: {
    merchantId: '...',
    merchantKey: '...',
    passphrase: '...',
    returnUrl: 'https://site/payment/success',
    cancelUrl: 'https://site/payment/cancel',
    notifyUrl: 'https://site/wc-api/payfast',
    testMode: true,
  },
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ShopProvider config={shopConfig}>{children}</ShopProvider>;
}
```

## Using in routes/pages
- Example shop page is provided at `@shop/pages/Shop`.
- You can keep using your existing pages and only adopt the core/hooks and adapters.

```tsx
import Shop from '@shop/pages/Shop';
<Route path="/shop" element={<Shop />} />
```

## Payments (PayFast)
- Front-end performs hosted checkout via form-post to PayFast.
- Success/Cancel: ensure you have routes `/payment/success` and `/payment/cancel`.
- Notify URL: should point to your WooCommerce PayFast plugin endpoint so orders auto-update server-side. No front-end webhook handling required.
- For local demo, you can swap to a mock provider later with `paymentProvider: 'mock'`.

## Copy-paste into another React app
1. Copy the entire `src/shop` folder.
2. Add a path alias (optional, recommended):
   - tsconfig: `"paths": { "@shop/*": ["src/shop/*"] }`
   - Vite: `resolve.alias['@shop'] = path.resolve(__dirname, 'src/shop')`
3. Wrap your app in `<ShopProvider>` (or use the default loader).
4. Add routes for `/shop`, `/cart`, `/checkout`, `/payment/success`, `/payment/cancel` (pages will be added as you adopt them).
5. Make sure Tailwind scans `src/shop/**/*` and install `@tailwindcss/typography` if you use rich HTML descriptions.
6. Ensure WooCommerce REST is accessible and PayFast credentials are valid.

## Next.js compatibility
- Use these components in client routes/components (`'use client'` as needed).
- Use a NEXT_PUBLIC_* env mapping or pass explicit `ShopConfig` prop. This folder does not depend on Vite APIs.

## Migration Checklist (from a legacy codebase)
- Replace direct calls to `services/woocommerce` with `@shop/core/hooks/useProducts` (or use the WooCommerce adapter directly if needed).
- Move/point your UI components via re-export shims in `shop/ui/` (as shown with `ProductGrid`).
- Gradually migrate `Cart`, `Checkout`, payment submission, and payment result pages into `shop/pages/` using the ports.
- Keep your WooCommerce PayFast plugin enabled so `notify_url` works.

## Roadmap
- Add `useCart`, `useCheckout` and cart reducer under `core/`
- Add pages: Cart, Checkout, PaymentSuccess, PaymentFailure (provider-agnostic)
- Add `payments/mock.ts` toggleable via config

---
This README is meant as a quick guide for copying this folder into other React apps and wiring WooCommerce + PayFast with minimal changes. If you need a full example or additional providers (e.g., PayGate), add adapters under `adapters/payments/` implementing `PaymentProvider`.

