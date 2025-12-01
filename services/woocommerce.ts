/* WooCommerce/WordPress API service (Oracle/Al-Rafahia compatible)
 * Fetches products, categories, brands, product details, linked products, and attributes
 * Exposes helpers consumed by the shop adapter/provider.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Product } from '../shop/core/ports';

type HttpMethod = 'GET' | 'POST' | 'PUT';

// Resolve envs for Next.js (NEXT_PUBLIC_*) and CRA (REACT_APP_*)
const WP_BASE: string = String(
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.REACT_APP_WORDPRESS_URL)) || ''
).replace(/\/+$/, '');
// Namespace and key can be overridden via env; support both NEXT_PUBLIC_* and REACT_APP_*
const ENV_NAMESPACE: string | undefined =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_WP_API_NAMESPACE || process.env.REACT_APP_WP_API_NAMESPACE)) ||
  undefined;
const ENV_API_KEY: string | undefined =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_WP_API_KEY || process.env.REACT_APP_WP_API_KEY)) ||
  undefined;
const FALLBACK_CONFIGS: Array<{ ns: string; key: string }> = [
  // Preferred explicit env config first
  ...(ENV_NAMESPACE && ENV_API_KEY ? [{ ns: String(ENV_NAMESPACE), key: String(ENV_API_KEY) }] : []),
  // Common deployments
  { ns: 'alrafahia/v1', key: 'alrafahia-react-2025' },
];

function buildUrl(namespace: string, path: string, params?: Record<string, any>): string {
  const base = `${WP_BASE}/wp-json/${namespace}${path.startsWith('/') ? path : `/${path}`}`;
  if (!params || Object.keys(params).length === 0) return base;
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    usp.set(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
}

async function http<T = any>(method: HttpMethod, path: string, params?: Record<string, any>, body?: any): Promise<T> {
  if (!WP_BASE) {
    throw new Error('REACT_APP_WORDPRESS_URL is not configured');
  }

  // Try env-provided config first (if any), then known fallbacks
  const tried: string[] = [];
  let lastErr: any = null;
  for (const cfg of FALLBACK_CONFIGS) {
    const ns = cfg.ns;
    const key = cfg.key;
    const url = buildUrl(ns, path, params);
    tried.push(`${ns}`);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-API-Key': key,
      };
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });
      const text = await res.text();
      let json: any;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        // If parsing fails, try next config
        lastErr = new Error(`Invalid JSON from ${url}: ${text?.slice(0, 200) || 'empty response'}`);
        continue;
      }
      if (!res.ok) {
        // Try next config on 401/403/404; otherwise bubble the error
        if ([401, 403, 404].includes(res.status)) {
          lastErr = new Error(json?.message || res.statusText || `HTTP ${res.status}`);
          continue;
        }
        const message = json?.message || res.statusText || 'Request failed';
        throw new Error(message);
      }
      return json as T;
    } catch (e: any) {
      lastErr = e;
      // try next config
      continue;
    }
  }
  const detail = tried.length ? ` Tried namespaces: ${tried.join(', ')}` : '';
  throw new Error((lastErr?.message || 'Request failed') + detail);
}

function mapProduct(p: any): Product {
  const primaryImageList: string[] = Array.isArray(p?.images)
    ? p.images.map((img: any) => String(img?.src || '')).filter(Boolean)
    : [];
  const categories: string[] = Array.isArray(p?.categories)
    ? p.categories.map((c: any) => String(c?.name || '')).filter(Boolean)
    : [];

  const priceNum = Number(p?.price ?? 0);
  const regularNum = Number(p?.regular_price ?? p?.regularPrice ?? priceNum);
  const saleNum = p?.sale_price !== undefined && p?.sale_price !== null && p?.sale_price !== ''
    ? Number(p.sale_price)
    : (p?.salePrice !== undefined ? Number(p.salePrice) : undefined);

  // Map variations (if provided by backend with include_variations=true)
  let mappedVariations: any[] | undefined = undefined;
  if (Array.isArray(p?.variations)) {
    mappedVariations = p.variations.map((v: any) => ({
      id: Number(v?.id),
      sku: String(v?.sku || ''),
      price: Number(v?.price ?? 0),
      regularPrice: Number(v?.regular_price ?? v?.regularPrice ?? v?.price ?? 0),
      salePrice:
        v?.sale_price !== undefined && v?.sale_price !== null && v?.sale_price !== ''
          ? Number(v?.sale_price)
          : (v?.salePrice !== undefined ? Number(v?.salePrice) : undefined),
      onSale: Boolean(v?.on_sale ?? v?.onSale ?? false),
      stockStatus: String(v?.stock_status ?? v?.stockStatus ?? 'instock'),
      stockQuantity:
        v?.stock_quantity !== undefined
          ? Number(v?.stock_quantity)
          : (v?.stockQuantity !== undefined ? Number(v?.stockQuantity) : undefined),
      attributes: (v?.attributes && typeof v.attributes === 'object') ? v.attributes : {},
      image: typeof v?.image === 'string' ? v.image : (v?.image?.src || undefined),
      displayName: String(
        v?.displayName ||
          (v?.attributes ? (Object.values(v.attributes)[0] as any) : '') ||
          ''
      ),
      description: v?.description,
      weight: v?.weight,
      soldIndividually: Boolean(v?.sold_individually ?? v?.soldIndividually ?? false),
    }));
  }

  // Normalize variation attributes shape if provided
  let mappedVariationAttributes: Record<string, string[]> | undefined = undefined;
  const rawVA = p?.variation_attributes ?? p?.variationAttributes;
  if (rawVA && typeof rawVA === 'object') {
    mappedVariationAttributes = Object.fromEntries(
      Object.entries(rawVA).map(([k, v]) => [String(k), Array.isArray(v) ? (v as any[]).map((x) => String(x)) : []])
    );
  }

  const extra: Record<string, any> = {};
  if (mappedVariations) extra.variations = mappedVariations;
  if (mappedVariationAttributes) extra.variationAttributes = mappedVariationAttributes;
  if (p?.default_attributes || p?.defaultAttributes) {
    extra.defaultAttributes = p?.default_attributes ?? p?.defaultAttributes;
  }

  return {
    id: Number(p?.id),
    name: String(p?.name || ''),
    description: String(p?.description || ''),
    shortDescription: String(p?.short_description || p?.shortDescription || ''),
    type: p?.type,
    price: priceNum,
    regularPrice: regularNum,
    salePrice: saleNum,
    onSale: Boolean(p?.on_sale ?? p?.onSale ?? false),
    images: primaryImageList,
    stockStatus: (p?.stock_status || 'instock') as Product['stockStatus'],
    stockQuantity: p?.stock_quantity !== undefined ? Number(p.stock_quantity) : (p?.stockQuantity !== undefined ? Number(p.stockQuantity) : undefined),
    categories,
    brand: p?.brand || undefined,
    slug: String(p?.slug || ''),
    permalink: String(p?.permalink || ''),
    hasVariations: Boolean(p?.has_variations ?? p?.hasVariations ?? false),
    soldIndividually: Boolean(p?.sold_individually ?? p?.soldIndividually ?? false),
    ...extra,
  };
}

// Public API

export async function getProducts(params?: {
  page?: number;
  per_page?: number;
  category?: string | number;
  search?: string;
  orderby?: 'date' | 'price' | 'name';
  order?: 'asc' | 'desc';
  featured?: boolean;
  brand?: string;
  onSale?: string | boolean;
}): Promise<{ data: Product[]; total: number; totalPages: number; currentPage: number }> {
  const query: Record<string, any> = { ...(params || {}) };
  if (typeof query.featured === 'boolean') query.featured = query.featured ? 'true' : 'false';
  if (typeof query.onSale === 'boolean') query.onSale = query.onSale ? 'true' : 'false';

  const resp = await http<any>('GET', '/products', query);
  // Endpoint typically returns { success, data, total }
  const arr: any[] = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
  const data = arr.map(mapProduct);
  const total = Number(resp?.total ?? data.length);
  const perPage = Number(query.per_page ?? 12);
  const page = Number(query.page ?? 1);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return { data, total, totalPages, currentPage: page };
}

export async function getProduct(id: number, params?: { include_variations?: boolean }): Promise<Product> {
  const resp = await http<any>('GET', `/products/${id}`, params as any);
  // Some servers return the product object directly, others wrap it
  const p = resp?.data && !resp?.id ? resp.data : resp;
  return mapProduct(p);
}

export async function getCategories(params?: {
  hide_empty?: boolean;
  per_page?: number;
  orderby?: string;
  order?: string;
  force_refresh?: boolean;
}): Promise<Array<{ id: number; name: string; parent?: number; slug?: string; image?: { src: string; alt?: string } }>> {
  const resp = await http<any>('GET', '/products/categories', params as any);
  const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
  return list.map((c: any) => ({
    id: Number(c?.id ?? c?.term_id),
    name: String(c?.name || ''),
    parent: c?.parent !== undefined ? Number(c.parent) : undefined,
    slug: c?.slug,
    image: c?.image && c.image.src
      ? { src: String(c.image.src), alt: c.image.alt ? String(c.image.alt) : undefined }
      : undefined,
  }));
}

export async function getBrands(params?: { per_page?: number; hide_empty?: boolean }): Promise<Array<{ id: string; name: string }>> {
  const resp = await http<any>('GET', '/products/brands', params as any);
  const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
  return list.map((b: any) => ({
    id: String(b?.slug || b?.id || b?.name || ''),
    name: String(b?.name || b?.slug || ''),
  }));
}

export async function getLinkedProducts(productId: number): Promise<{ upsells: Product[]; crossSells: Product[]; totalUpsells: number; totalCrossSells: number }> {
  const resp = await http<any>('GET', `/products/${productId}/linked`);
  const ups = Array.isArray(resp?.upsells) ? resp.upsells.map(mapProduct) : [];
  const cross = Array.isArray(resp?.cross_sells) ? resp.cross_sells.map(mapProduct) : (Array.isArray(resp?.crossSells) ? resp.crossSells.map(mapProduct) : []);
  return {
    upsells: ups,
    crossSells: cross,
    totalUpsells: Number(resp?.total_upsells ?? ups.length),
    totalCrossSells: Number(resp?.total_cross_sells ?? cross.length),
  };
}

export async function createOrder(payload: any): Promise<{ success: boolean; orderId?: number; orderNumber?: string; error?: string }> {
  const resp = await http<any>('POST', '/orders', undefined, payload);
  return {
    success: Boolean(resp?.success),
    orderId: resp?.order_id,
    orderNumber: resp?.order_number,
    error: resp?.error,
  };
}

// Attribute helpers (for brand fallback)
export async function getProductAttributes(params?: { per_page?: number }): Promise<any[]> {
  const resp = await http<any>('GET', '/products/attributes', params as any);
  return Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
}

export async function getProductAttributeTerms(attributeId: number | string, params?: { per_page?: number }): Promise<any[]> {
  const resp = await http<any>('GET', `/products/attributes/${attributeId}/terms`, params as any);
  return Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
}

// Raw products (unmapped) - used as a fallback in brand detection
export async function getRawProducts(params?: Record<string, any>): Promise<{ data: any[] }> {
  const resp = await http<any>('GET', '/products', params as any);
  const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
  return { data: list };
}


