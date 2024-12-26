import { TEMPLATE_TYPES_MAP } from "@/utils/Contants";
import { MAgent } from "./Agent.model";

class VTask {
  id!: string;
  organization_id!: string;
  task_id!: string;
  employee_id!: string;
  title?: string;
  description?: string;
  status?: "todo" | "in_review" | "approved" | "rejected";
  icon?: string;
  created_at!: string;
  updated_at!: string;
  start_date!: string;
  due_date?: string | null;
  end_date?: string | null;
  employee_details!: {
    id: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    country?: string | null;
    email?: string | null;
  };
  assignee_details!: MAgent | null;
  organization_details!: {
    name: string;
  };
  template_type?: keyof typeof TEMPLATE_TYPES_MAP | "";

  constructor(data?: Partial<VTask>) {
    this.id = data?.id || "";
    this.organization_id = data?.organization_id || "";
    this.task_id = data?.task_id || "";
    this.employee_id = data?.employee_id || "";
    this.title = data?.title || "";
    this.description = data?.description || "";
    this.status = data?.status || "todo";
    this.icon = data?.icon || "";
    this.created_at = data?.created_at || "";
    this.updated_at = data?.updated_at || "";
    this.start_date = data?.start_date || "";
    this.due_date = data?.due_date || null;
    this.end_date = data?.end_date || null;
    this.employee_details = data?.employee_details || {
      id: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
    };
    this.organization_details = data?.organization_details || {
      name: "",
    };
    this.template_type = data?.template_type || "";
    this.assignee_details = data?.assignee_details || null;
  }
}

export default VTask;
