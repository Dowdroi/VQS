export class MResponse<T = any> {
  code: number;
  status: string;
  message: string;
  data: T | T[];
  meta: {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    has_previous: boolean;
    has_next: boolean;
  };
  error: any;

  constructor(data?: Partial<MResponse<T>>) {
    this.code = data?.code || 13;
    this.status = data?.status || "";
    this.message = data?.message || "";
    this.data = data?.data || ([] as T[]);
    this.meta = {
      page: data?.meta?.page || 0,
      page_size: data?.meta?.page_size || 0,
      total_pages: data?.meta?.total_pages || 0,
      total_items: data?.meta?.total_items || 0,
      has_previous: data?.meta?.has_previous || false,
      has_next: data?.meta?.has_next || false,
    };
    this.error = data?.error || {};
  }

  isSuccessful(): boolean {
    return [200, 201, 202, 203, 204, 205, 206].includes(this.code);
  }
}
