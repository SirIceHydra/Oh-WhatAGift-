import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { IProductsProps } from "@/components/common/product/type";
import { TFilterState } from "@/components/forPages/products";
import { getProducts } from "@/services/woocommerce";
import { mockProducts } from "@/data/mockProducts";

const GetAllProducts = (query: TFilterState) => {
   return useQuery<{ products: IProductsProps[]; allProductsCount: number }, AxiosError>(
      ["AllProducts", query],
      async () => {
         try {
            // Map UI filters to backend params (best-effort)
            const orderby =
              query.sort.sortBy === "price"
                ? "price"
                : query.sort.sortBy === "createdAt"
                ? "date"
                : "name";
            const order =
              query.sort.orderBy === "asc" || query.sort.orderBy === "desc"
                ? (query.sort.orderBy as "asc" | "desc")
                : "desc";

            const resp = await getProducts({
              page: query.pageNumber,
              per_page: query.limitPerPage,
              // We don't have category id here; rely on search for now if category provided
              search: query.category || undefined,
              orderby,
              order,
              // onSale not wired in this page's filter; price/colour filters are UI-only here
            });

            const products: IProductsProps[] = resp.data.map((p) => {
              const regular = Number(p.regularPrice || p.price || 0);
              const sale = p.salePrice !== undefined && p.salePrice !== null ? Number(p.salePrice) : undefined;
              const discount =
                sale !== undefined && regular > 0 ? Math.max(0, Math.round(((regular - sale) / regular) * 100)) : 0;
              return {
                id: p.id,
                rate: 0,
                slug: p.slug,
                price: Number(sale ?? p.price ?? 0),
                title: p.name,
                imgs: Array.isArray(p.images) ? p.images : [],
                discount,
                saleCount: 0,
                createdAt: new Date().toISOString(),
                count: p.stockQuantity ?? 0,
                colors: [],
                size: [],
                description: p.shortDescription || p.description || "",
                category: p.categories?.[0] || "",
              };
            });

            return {
              products,
              allProductsCount: resp.total,
            };
         } catch (error: any) {
            // Fallback to mock data if API fails
            return {
              products: [...mockProducts].slice(
                (query.pageNumber - 1) * query.limitPerPage,
                (query.pageNumber - 1) * query.limitPerPage + query.limitPerPage
              ),
              allProductsCount: mockProducts.length,
            };
         }
      },
      {
         keepPreviousData: true,
      },
   );
};

export default GetAllProducts;
