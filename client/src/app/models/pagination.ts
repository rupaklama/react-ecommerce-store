// note - this should match Pagination data in Response Header
export interface MetaData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export class PaginatedResponse<T> {
  // items: T;
  // metaData: MetaData;

  constructor(public items: T, public metaData: MetaData) {}
}
