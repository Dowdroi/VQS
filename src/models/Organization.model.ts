export class MOrganization {
  id: string;
  name: string;
  description: string;
  website: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  constructor(data?: Partial<MOrganization>) {
    this.id = data?.id || "";
    this.name = data?.name || "";
    this.description = data?.description || "";
    this.website = data?.website || "";
    this.is_active = data?.is_active || false;
    this.created_at = data?.created_at || "";
    this.updated_at = data?.updated_at || "";
  }
}
