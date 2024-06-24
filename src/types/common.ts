export interface ClimbingPlace {
  id: number;
  address: string;
  zipCode?: string;
  name: string;
}

export interface Pagination {
  totalCount: number;
  resultCount: number;
  totalPage: number;
  page: number;
  isEnd: boolean;
}
