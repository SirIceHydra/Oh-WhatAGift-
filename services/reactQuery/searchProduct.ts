import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { IProductsProps } from "@/components/common/product/type";
import { getProducts } from "@/services/woocommerce";

const GetSearchProduct = (query: string) => {
   return useQuery<IProductsProps[], AxiosError>(["SearchProduct", query], async () => {
      try {
         if (!query) return [];

         const resp = await getProducts({ search: query, per_page: 24 });
         return resp.data.map((p) => {
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
           } as IProductsProps;
         });
      } catch (error: any) {
         throw new Error(error.message);
      }
   });
};

export default GetSearchProduct;
