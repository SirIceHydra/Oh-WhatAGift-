export type TFilterState = {
  category?: string;
  pageNumber: number;
  limitPerPage: number;
  color?: string;
  prices: number[];
  sort: {
    sortBy: string;
    orderBy: string;
  };
};

