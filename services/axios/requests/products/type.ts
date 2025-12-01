export type fetchLimitProductsType = {
   limit: number;
   sortBy: 'createdAt' | 'saleCount';
   order: "descending" | "ascending";
   categoryId?: number | string;
   featured?: boolean;
};
