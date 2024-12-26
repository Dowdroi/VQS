export class MFilterParams {
  page: number;
  page_size: number;
  sort_by: string;
  sort_direction: "asc" | "desc";
  name?: string;
  is_active?: boolean;

  constructor(data?: Partial<MFilterParams>) {
    this.page = data?.page || 1;
    this.page_size = data?.page_size || 20;
    this.sort_by = data?.sort_by || "created_at";
    this.sort_direction = data?.sort_direction || "desc";
    this.name = data?.name;
    this.is_active = data?.is_active;
  }
}
