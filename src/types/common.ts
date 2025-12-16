// 범용 타입 정의

export interface Pagination {
  totalCount: number;
  resultCount: number;
  totalPage: number;
  page: number;
  isEnd: boolean;
}
