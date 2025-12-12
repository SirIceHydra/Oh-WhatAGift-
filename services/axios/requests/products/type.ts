export type fetchLimitProductsType = {
   limit: number;
   sortBy: 'createdAt' | 'saleCount';
   order: "descending" | "ascending";
   categoryId?: number | string;
   featured?: boolean;
};

export type TFilterState = {
   category?: string;
   pageNumber: number;
   limitPerPage: number;
   color?: string;
   prices: number[];
   sort: {
      sortBy?: string;
      orderBy?: string;
   };
};