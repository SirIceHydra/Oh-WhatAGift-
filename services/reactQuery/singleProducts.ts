import { useQuery } from "react-query";
import { IProductsProps } from "@/components/common/product/type";
import { AxiosError } from "axios";
import { getProducts } from "@/services/woocommerce";

const GetSingleProducts = (slug: string) => {
   return useQuery<IProductsProps[], AxiosError>(["SingleProduct", slug], async () => {
      try {
         if (!slug) return [];
         // Backend single endpoint is ID-based; search by slug then pick exact match
         const resp = await getProducts({ search: slug, per_page: 20 });
         const p = resp.data.find((x) => x.slug === slug) ?? resp.data[0];
         if (!p) throw new Error("Product not found");

         const regular = Number(p.regularPrice || p.price || 0);
         const sale = p.salePrice !== undefined && p.salePrice !== null ? Number(p.salePrice) : undefined;
         const discount =
           sale !== undefined && regular > 0 ? Math.max(0, Math.round(((regular - sale) / regular) * 100)) : 0;

         const mapped: IProductsProps = {
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

         return [mapped];
      } catch (error: any) {
         throw new Error(error.message);
      }
   });
};

export default GetSingleProducts;
