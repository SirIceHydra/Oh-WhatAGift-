import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { IProductsProps } from "@/components/common/product/type";
import { fetchLimitProductsType } from "@/services/axios/requests/products/type";
import { getProducts } from "@/services/woocommerce";

const GetVitrineProducts = ({ limit, sortBy, order, categoryId, featured, enabled = true }: fetchLimitProductsType & { enabled?: boolean }) => {
  return useQuery<IProductsProps[], AxiosError>(
    ['VitrineProducts', limit, sortBy, order, categoryId, featured],
    async () => {
    try {
      const orderby =
        sortBy === 'createdAt' ? 'date' : sortBy === 'saleCount' ? 'date' : 'date';
      
      const params: any = {
        per_page: limit,
        orderby,
        order: order === 'ascending' ? 'asc' as const : 'desc' as const,
      };
      
      // Add featured filter if specified (default to true for featured vitrine)
      if (featured !== undefined) {
        params.featured = featured;
      } else {
        params.featured = true; // Default to featured for backward compatibility
      }
      
      // Add category filter if specified (must be valid number)
      if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
        const catIdNum = typeof categoryId === 'number' ? categoryId : parseInt(String(categoryId));
        if (!isNaN(catIdNum) && catIdNum > 0) {
          params.category = catIdNum;
          console.log('✅ [GetVitrineProducts] Filtering by category ID:', catIdNum, params);
        } else {
          console.warn('⚠️ [GetVitrineProducts] Invalid categoryId, skipping category filter:', categoryId);
        }
      } else if (featured === false) {
        // If we're not showing featured AND no category specified, warn (this might be an error)
        console.warn('⚠️ [GetVitrineProducts] No categoryId provided but featured=false. Will fetch all products!', params);
      }
      
      const resp = await getProducts(params);

      const mapped: IProductsProps[] = resp.data.map((p) => {
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

      return mapped.slice(0, limit);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  { enabled }
  );
};

export default GetVitrineProducts;
