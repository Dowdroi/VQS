import { generateId } from "@/utils/utils";

export class MAgent {
  id?: string;
  user_id?: string;
  sub?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  phone?: string | null;
  role?: string;

  constructor(data: any) {
    this.id = data.id || "";
    this.user_id = data.user_id || "";
    this.sub = data.sub || generateId();
    this.first_name = data.first_name || "";
    this.last_name = data.last_name || "";
    this.email = data.email || "";
    this.is_active = data.is_active ?? true;
    this.created_at = data.created_at || "";
    this.updated_at = data.updated_at || "";
    this.phone = data.phone || null;
    this.role = data.role || "";
  }

  get fullName(): string {
    return `${this.first_name} ${this.last_name}`.trim();
  }
}
