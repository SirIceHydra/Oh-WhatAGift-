"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import { ProductGrid } from "../ui/ProductGrid";
import { useCategories } from "../core/hooks/useCategories";
import { useProducts } from "../core/hooks/useProducts";
import { useBrands } from "../core/hooks/useBrands";
import { Search, Filter, Grid, List, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Loading } from "../../components/ui/Loading";
import AddItemPopup from "../../components/ui/AddItemPopup";
import { useCart } from "../core/cart/CartContext";

import { Slider } from "@/components/ui/slider";

// Filters panel (left side)
function Filters(props: any) {
  const {
    categories = [],
    brands = [],
    selectedCategories = [],
    onToggleCategory,
    selectedBrand,
    onSelectBrand,
    onSale,
    onToggleSale,
    searchTerm,
    setSearchTerm,
    prices = [0, 500],
    sliderBound = [0, 500],
    onPriceChange,
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderChange,
  } = props || {};

  return (
    <div className="w-full lg:w-1/4 pr-6">
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 text-tertiary">Search</h4>
          <input
            value={searchTerm ?? ""}
            onChange={(e) => setSearchTerm?.(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-secondary/50 bg-transparent px-3 py-2 text-tertiary focus:outline-none focus:border-secondary"
          />
        </div>

        <div>
          <h4 className="mb-3 text-tertiary">Brand</h4>
          <select
            className="w-full border border-secondary/50 bg-transparent px-3 py-2 text-tertiary focus:outline-none focus:border-secondary"
            value={selectedBrand ?? ""}
            onChange={(e) => onSelectBrand?.(e.target.value || undefined)}
          >
            <option value="">All brands</option>
            {Array.isArray(brands) &&
              brands.map((b: any) => (
                <option key={String(b.id)} value={b.name}>
                  {b.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-tertiary">
            <input
              type="checkbox"
              checked={!!onSale}
              onChange={(e) => onToggleSale?.(e.target.checked)}
            />
            On Sale
          </label>
        </div>

        <div>
          <h4 className="mb-3 text-tertiary">Categories</h4>
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {Array.isArray(categories) &&
              categories.map((c: any) => {
                const checked = selectedCategories?.includes?.(c.name);
                return (
                  <label
                    key={String(c.id)}
                    className="flex items-center gap-2 text-tertiary"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked}
                      onChange={() => onToggleCategory?.(c.name)}
                    />
                    {c.name}
                  </label>
                );
              })}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-tertiary">Price</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={Array.isArray(prices) ? Number(prices[0]) : 0}
              min={Array.isArray(sliderBound) ? Number(sliderBound[0]) : 0}
              max={Array.isArray(sliderBound) ? Number(sliderBound[1]) : 999999}
              onChange={(e) =>
                onPriceChange?.(null, [
                  Number(e.target.value),
                  Array.isArray(prices) ? Number(prices[1]) : 0,
                ])
              }
              className="w-1/2 border border-secondary/50 bg-transparent px-3 py-2 text-tertiary focus:outline-none focus:border-secondary"
            />
            <input
              type="number"
              value={Array.isArray(prices) ? Number(prices[1]) : 0}
              min={Array.isArray(sliderBound) ? Number(sliderBound[0]) : 0}
              max={Array.isArray(sliderBound) ? Number(sliderBound[1]) : 999999}
              onChange={(e) =>
                onPriceChange?.(null, [
                  Array.isArray(prices) ? Number(prices[0]) : 0,
                  Number(e.target.value),
                ])
              }
              className="w-1/2 border border-secondary/50 bg-transparent px-3 py-2 text-tertiary focus:outline-none focus:border-secondary"
            />
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-tertiary">Sort</h4>
          <div className="flex items-center gap-2">
            <select
              className="flex-1 border border-secondary/50 bg-transparent px-3 py-2 text-tertiary focus:outline-none focus:border-secondary"
              value={sortBy}
              onChange={(e) =>
                onSortByChange?.(
                  e.target.value as "date" | "price" | "name"
                )
              }
            >
              <option value="date">Newest</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
            <select
              className="flex-1 border border-secondary/50 bg-transparent px-3 py-2 text-tertiary focus:outline-none focus:border-secondary"
              value={sortOrder}
              onChange={(e) =>
                onSortOrderChange?.(e.target.value as "asc" | "desc")
              }
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
const HorizontalLine = ({ className }: { className?: string }) => (
  <hr className={className} />
);

export default function Shop() {
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const onSaleParam = searchParams.get("onSale");
  const initialOnSale =
    onSaleParam === "true" || onSaleParam === "True" || onSaleParam === "1";
  const initialSearchTerm = searchParams.get("search") || "";
  const initialBrand = searchParams.get("brand") || undefined;
  const initialCategoryParam = searchParams.get("category");
  const initialCategories = initialCategoryParam
    ? initialCategoryParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const initialOrderByParam = searchParams.get("orderBy") || "date";
  const initialOrderParam = searchParams.get("order") || "desc";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    initialBrand
  );
  const [onSale, setOnSale] = useState<boolean>(initialOnSale);
  const [orderBy, setOrderBy] = useState<"date" | "price" | "name">(
    initialOrderByParam === "price" || initialOrderByParam === "name"
      ? (initialOrderByParam as "price" | "name")
      : "date"
  );
  const [order, setOrder] = useState<"asc" | "desc">(
    initialOrderParam === "asc" ? "asc" : "desc"
  );
  const { popupOpen, popupMessage, hidePopup } = useCart();
  // Filters layout state (styling pulled from products page)
  const [isCloseFilterOnMobile, setIsCloseFilterOnMobile] =
    useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [sliderBound, setSliderBound] = useState<[number, number]>([0, 500]);

  const { categories, loading: catsLoading, fetchCategories } = useCategories();
  const { brands, loading: brandsLoading, refetch: fetchBrands } = useBrands();

  // Use useProducts directly with all filters
  const { products, loading, error, fetchProducts } = useProducts({
    perPage: 100, // Fetch all products at once (no pagination)
    page: 1,
    category: undefined,
    brand: selectedBrand,
    search: searchTerm,
    onSale: onSale,
    orderBy: orderBy,
    order: order,
  });

  const catMenuRef = useRef<HTMLDivElement | null>(null);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const [expandedParents, setExpandedParents] = useState<
    Record<number, boolean>
  >({});
  const brandMenuRef = useRef<HTMLDivElement | null>(null);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);

  // Load categories and brands on mount
  useEffect(() => {
    fetchCategories({ forceRefresh: true } as any);
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  // Parse URL parameters and set initial state
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const onSaleParam = searchParams.get("onSale");
    const searchParam = searchParams.get("search");
    const orderByParam = searchParams.get("orderBy");
    const orderParam = searchParams.get("order");

    setSearchTerm(searchParam || "");
    // Handle onSale parameter - check for 'true', 'True', or '1'
    setOnSale(
      onSaleParam === "true" || onSaleParam === "True" || onSaleParam === "1"
    );
    const brandValue = brandParam || undefined;
    setSelectedBrand(brandValue);

    if (categoryParam) {
      const parts = categoryParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setSelectedCategories(parts);
    } else {
      setSelectedCategories([]);
    }

    // Apply sort from URL when present
    if (
      orderByParam === "price" ||
      orderByParam === "name" ||
      orderByParam === "date"
    ) {
      setOrderBy(orderByParam);
    }
    if (orderParam === "asc" || orderParam === "desc") {
      setOrder(orderParam);
    }
  }, [searchParams]);

  // Fetch products whenever filters change
  useEffect(() => {
    // Build category id when exactly one category selected (server-side filter)
    let categoryId: number | undefined = undefined;
    if (selectedCategories.length === 1 && categories.length > 0) {
      const found = categories.find(
        (c) => c.name.toLowerCase() === selectedCategories[0].toLowerCase()
      );
      categoryId = found?.id;
    }

    console.log("✅ [Shop] Fetching products with filters:", {
      categoryId,
      selectedBrand,
      searchTerm,
      onSale,
      orderBy,
      order,
    });

    fetchProducts({
      perPage: 100,
      page: 1,
      category: categoryId,
      brand: selectedBrand,
      search: searchTerm,
      onSale: onSale,
      orderBy: orderBy,
      order: order,
    });
  }, [
    selectedCategories,
    selectedBrand,
    searchTerm,
    onSale,
    orderBy,
    order,
    fetchProducts,
    categories,
  ]);

  // Close category menu on outside click
  useEffect(() => {
    if (!isCatMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (catMenuRef.current && !catMenuRef.current.contains(target)) {
        setIsCatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isCatMenuOpen]);

  // Close brand menu on outside click
  useEffect(() => {
    if (!isBrandMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (brandMenuRef.current && !brandMenuRef.current.contains(target)) {
        setIsBrandMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isBrandMenuOpen]);

  // wire Filters component
  const onToggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };
  const onSelectColor = (c: string) => setSelectedColor(c);
  const onResetFilters = () => {
    setSelectedColor("");
    setPriceRange(sliderBound);
    setSelectedCategories([]);
    setSelectedBrand(undefined);
    setOnSale(false);
    // Optionally update URL (client-only)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("onSale");
      url.searchParams.delete("brand");
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Handle brand selection and update URL
  const handleBrandSelect = (brand?: string) => {
    setSelectedBrand(brand);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (brand) {
        url.searchParams.set("brand", brand);
      } else {
        url.searchParams.delete("brand");
      }
      window.history.replaceState(null, "", url.toString());
    }
  };
  const onPriceChange = (_: any, prices: number | number[]) =>
    setPriceRange(prices as number[]);
  const toggleFilterOnMobile = () => setIsCloseFilterOnMobile((prev) => !prev);

  // Handle sale filter toggle and update URL
  const onToggleSale = (checked: boolean) => {
    setOnSale(checked);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (checked) {
        url.searchParams.set("onSale", "true");
      } else {
        url.searchParams.delete("onSale");
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Derived visible products after category/brand filtering (client-side for multi-category support)
  const visibleAfterCatBrand = (products || []).filter((p) => {
    // Brand
    if (
      selectedBrand &&
      (p.brand || "").toLowerCase() !== selectedBrand.toLowerCase()
    )
      return false;
    // Categories
    if (selectedCategories.length > 0) {
      const pCats = Array.isArray(p.categories)
        ? p.categories.map((c) => c.toLowerCase())
        : [];
      const wants = selectedCategories.map((c) => c.toLowerCase());
      const matchAny = wants.some((w) => pCats.includes(w));
      if (!matchAny) return false;
    }
    return true;
  });

  // Adjust slider bounds effect dependency to use derived products
  useEffect(() => {
    if (loading) return;
    if (visibleAfterCatBrand.length === 0) return;
    const maxPrice = visibleAfterCatBrand.reduce((m, p) => {
      const price = Number(p.price ?? 0);
      return Number.isFinite(price) && price > m ? price : m;
    }, 0);
    const newMax = Math.max(0, Math.ceil(maxPrice));
    if (newMax !== sliderBound[1]) {
      setSliderBound([0, newMax]);
      setPriceRange((prev) => {
        const prevMin = Array.isArray(prev) ? Number(prev[0]) : 0;
        const prevMax = Array.isArray(prev) ? Number(prev[1]) : 0;
        if (prevMin === 0 && prevMax === sliderBound[1]) {
          return [0, newMax];
        }
        const clampedMin = Math.max(0, Math.min(prevMin, newMax));
        const clampedMax = Math.max(clampedMin, Math.min(prevMax, newMax));
        return [clampedMin, clampedMax];
      });
    }
  }, [visibleAfterCatBrand, loading, sliderBound]);

  // Check if any filters are applied
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrand ||
    onSale ||
    searchTerm ||
    priceRange[0] !== sliderBound[0] ||
    priceRange[1] !== sliderBound[1];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6">

          {/* Applied Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-support/20">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-sm font-medium text-tertiary/70 mr-2">
                  Applied filters:
                </span>

                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-support/20 text-support rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}

                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-support/20 text-support rounded-full text-sm">
                    Brand: {selectedBrand}
                  </span>
                )}

                {onSale && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-support/20 text-support rounded-full text-sm">
                    On Sale
                  </span>
                )}

                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-support/20 text-support rounded-full text-sm">
                    Search: &quot;{searchTerm}&quot;
                  </span>
                )}

                {(priceRange[0] !== sliderBound[0] ||
                  priceRange[1] !== sliderBound[1]) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-support/20 text-support rounded-full text-sm">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Mobile filter toggle + sort summary */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={toggleFilterOnMobile}
              className="inline-flex items-center gap-2 border px-3 py-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {visibleAfterCatBrand.length > 0 && (
              <span className="text-xs text-gray-600">
                {visibleAfterCatBrand.length} item
                {visibleAfterCatBrand.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

          <div className="flex flex-row gap-8">
            <aside className="basis-1/5 min-w-[220px]">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-brand-gold">Search</h4>
                  <input
                    value={searchTerm ?? ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search…"
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>



                <div>
                  <h4 className="mb-2 text-sm font-medium text-brand-gold">Categories</h4>
                  <div className="space-y-1.5 max-h-48 overflow-auto pr-1">
                    {Array.isArray(categories) &&
                      categories.map((c: any) => {
                        const checked = selectedCategories.includes(c.name);
                        return (
                          <label
                            key={String(c.id)}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => onToggleCategory(c.name)}
                            />
                            {c.name}
                          </label>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-brand-gold">Price</h4>
                  <div className="space-y-2">
                    <Slider
                      min={Array.isArray(sliderBound) ? Number(sliderBound[0]) : 0}
                      max={Array.isArray(sliderBound) ? Number(sliderBound[1]) : 1000}
                      step={1}
                      value={Array.isArray(priceRange) ? priceRange : [0, 0]}
                      onValueChange={(v) => onPriceChange?.(null, v as number[])}
                      className="py-1"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>R {Array.isArray(priceRange) ? Number(priceRange[0]) : 0}</span>
                      <span>R {Array.isArray(priceRange) ? Number(priceRange[1]) : 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!onSale}
                      onChange={(e) => onToggleSale(e.target.checked)}
                      className="w-4 h-4"
                    />
                    On Sale
                  </label>
                </div>
              </div>
            </aside>
            <div className="flex-1 min-w-0 space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loading size="lg" text="Loading products..." />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400 mb-4">
                    Error loading products: {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="border px-4 py-2 text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <ProductGrid
                  products={visibleAfterCatBrand?.filter((p) => {
                    const price = Number(p.price ?? 0);
                    return price >= priceRange[0] && price <= priceRange[1];
                  })}
                  loading={loading}
                  error={error}
                  variant={viewMode === "list" ? "list" : "grid"}
                  columns={4}
                  onViewDetails={(p) => {
                    if (typeof window !== "undefined") {
                      window.location.hash = `/product/${p.id}`;
                    }
                  }}
                  className="gears-list"
                />
              )}
              <HorizontalLine className="my-8" />
            </div>
          </div>
        </div>
      </main>
      <AddItemPopup
        isOpen={popupOpen}
        message={popupMessage}
        onClose={hidePopup}
      />
    </div>
  );
}
