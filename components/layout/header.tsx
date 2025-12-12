'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/shop/core/cart/CartContext';
import { useEffect, useRef, useState } from 'react';
import { getProducts } from '@/services/woocommerce';
import type { Product } from '@/shop/core/ports';
import { fetchPosts } from '@/posts/services/wordpress-api';
import type { Post } from '@/posts/types/post';

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart?.itemCount ?? 0;
  const [searchTerm, setSearchTerm] = useState('');
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [postResults, setPostResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setProductResults([]);
      setPostResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const [productResp, postsResp] = await Promise.all([
          getProducts({ search: searchTerm.trim(), per_page: 5 }),
          fetchPosts({ search: searchTerm.trim(), perPage: 5, orderBy: 'date', order: 'desc' }),
        ]);
        setProductResults(productResp?.data ?? []);
        setPostResults(postsResp?.posts ?? []);
      } catch (e) {
        setProductResults([]);
        setPostResults([]);
      } finally {
        setLoading(false);
        setShowResults(true);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const productLinkFor = (p: Product) => {
    const isCustom = Array.isArray(p.categories) && p.categories.some(cat => cat.toLowerCase().trim() === 'custom');
    return isCustom ? '/custom' : `/shop#/product/${p.id}`;
  };

  return (
    <header className="bg-brand-cream">
      <div className="container mx-auto px-4 py-4">
        {/* Top section with logo and search/cart */}
        <div className="relative flex items-end justify-center w-full pb-4 border-b">
          {/* Logo centered */}
          <Link href="/home" className="flex justify-center">
            <Image
              src="/logos/logo-main.svg"
              alt="Logo"
              width={432}
              height={144}
              className="h-auto"
            />
          </Link>
          
          {/* Search bar and cart icons on the right */}
          <div className="absolute right-0 flex items-center gap-4 pb-2">
            {/* Search bar */}
            <div className="relative">
              <div className="flex items-center border border-brand-green rounded-full px-3 py-1 bg-white">
                <Search size={20} className="text-brand-green" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 150)}
                  className="px-2 py-1 bg-transparent border-none outline-none text-brand-green placeholder:text-brand-green/60 w-48"
                />
                {loading && <Loader2 className="w-4 h-4 text-brand-green animate-spin ml-2" />}
              </div>

              {showResults && searchTerm.trim() && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-brand-green/30 rounded-lg shadow-lg z-30">
                  <div className="max-h-96 overflow-y-auto divide-y divide-brand-green/10">
                    {loading && (
                      <div className="p-3 text-sm text-brand-grey-green flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching...
                      </div>
                    )}

                    {!loading && (
                      <>
                        <div className="p-3">
                          <p className="text-xs uppercase text-brand-grey-green/70 mb-2">Products</p>
                          {productResults.length === 0 && (
                            <p className="text-sm text-brand-grey-green/60">No products found</p>
                          )}
                          <div className="space-y-2">
                            {productResults.map((p) => (
                              <Link
                                key={p.id}
                                href={productLinkFor(p)}
                                className="flex items-center gap-3 p-2 rounded hover:bg-brand-light-green/40 transition-colors"
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                <img
                                  src={p.images?.[0] || '/placeholder-product.jpg'}
                                  alt={p.name}
                                  className="w-10 h-10 object-cover rounded border border-brand-green/20"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-brand-grey-green line-clamp-1">{p.name}</p>
                                  <p className="text-xs text-brand-grey-green/70">{p.price ? `R${p.price}` : ''}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="p-3">
                          <p className="text-xs uppercase text-brand-grey-green/70 mb-2">Blog Posts</p>
                          {postResults.length === 0 && (
                            <p className="text-sm text-brand-grey-green/60">No posts found</p>
                          )}
                          <div className="space-y-2">
                            {postResults.map((post) => (
                              <Link
                                key={post.id}
                                href={`/journal/${post.slug}`}
                                className="block p-2 rounded hover:bg-brand-light-green/40 transition-colors"
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                <p className="text-sm font-semibold text-brand-grey-green line-clamp-1">{post.title}</p>
                                <p className="text-xs text-brand-grey-green/70 line-clamp-2">{post.excerpt}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {!loading && productResults.length === 0 && postResults.length === 0 && (
                      <div className="p-3 text-sm text-brand-grey-green/60">No results found.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Cart icon with item count badge */}
            <Link href="/cart" className="relative inline-flex items-center text-brand-green">
              <ShoppingCart size={24} />
              {mounted && itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-brand-green text-brand-cream text-[11px] leading-[18px] text-center font-semibold px-1"
                  aria-label={`${itemCount} item${itemCount === 1 ? '' : 's'} in cart`}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation links - full width green bar */}
      <nav className="bg-brand-green w-full pt-4 pb-4">
        <div className="container mx-auto px-4">
          <ul className="flex justify-between w-full gap-6">
            <li>
              <Link href="/home" className="text-brand-cream uppercase hover:text-brand-cream/80 hover:underline transition-all duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-brand-cream uppercase hover:text-brand-cream/80 hover:underline transition-all duration-200">
                Shop exclusive ranges
              </Link>
            </li>
            <li>
              <Link href="/personalise" className="text-brand-cream uppercase hover:text-brand-cream/80 hover:underline transition-all duration-200">
                Personalise a gift
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-brand-cream uppercase hover:text-brand-cream/80 hover:underline transition-all duration-200">
                About us
              </Link>
            </li>
            <li>
              <Link href="/journal" className="text-brand-cream uppercase hover:text-brand-cream/80 hover:underline transition-all duration-200">
                Our journal
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-brand-cream uppercase hover:text-brand-cream/80 hover:underline transition-all duration-200">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
