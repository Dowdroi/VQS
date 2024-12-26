import { MAgent } from "./Agent.model";

export class VTaskDetail {
  _id!: string;
  organization_id!: string;
  task_id!: string;
  employee_id!: string;
  status!: string;
  start_date!: string;
  end_date!: string | null;
  due_date!: string | null;
  completed_at!: string | null;
  created_at!: string;
  updated_at!: string;
  created_by!: string;
  updated_by!: string;
  title!: string;
  description!: string;
  task_template_id!: string;
  image_key!: string;
  thumbnail_key!: string;
  template_type!: string;
  action_status!: string;
  action_result!: {
    not_started: {
      ui: Array<{
        type: string;
        id: string;
        key: string;
        label: string;
        text?: string;
        properties?: {
          button_type?: string;
          variant?: string;
          full_width?: boolean;
          size?: string;
        };
      }>;
    };
    ongoing: {
      ui: Array<any>;
      data: {
        transaction_id: string;
        voi_link: string;
        share_code: string;
      };
    };
    completed: {
      ui: Array<{
        type: string;
        id: string;
        key: string;
        label: string;
        text: string;
      }>;
    };
    in_review: {
      ui: Array<{
        type: string;
        id: string;
        key: string;
        label: string;
        text: string;
      }>;
    };
    rejected: {
      ui: Array<{
        type: string;
        id: string;
        key: string;
        label: string;
        text: string;
      }>;
    };
  };
  step_function_arn!: string;
  document_results!: null;
  execution_id!: string;
  final_result!: null;
  form_data!: Record<string, any>;
  sfn_token!: string;
  transaction_id!: string;
  employee_details!: MAgent | null;

  personal_information?: {
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
  card_information?: {
    card_number: string;
    license_number: string;
  };
  address_information?: {
    address: string;
  };
  additional_details?: {
    expiry_date: string;
    country: string;
    country_code: string;
  };

  constructor(data?: Partial<VTaskDetail>) {
    this._id = data?._id || "";
    this.organization_id = data?.organization_id || "";
    this.task_id = data?.task_id || "";
    this.employee_id = data?.employee_id || "";
    this.status = data?.status || "";
    this.start_date = data?.start_date || "";
    this.end_date = data?.end_date || null;
    this.due_date = data?.due_date || null;
    this.completed_at = data?.completed_at || null;
    this.created_at = data?.created_at || "";
    this.updated_at = data?.updated_at || "";
    this.created_by = data?.created_by || "";
    this.updated_by = data?.updated_by || "";
    this.title = data?.title || "";
    this.description = data?.description || "";
    this.task_template_id = data?.task_template_id || "";
    this.image_key = data?.image_key || "";
    this.thumbnail_key = data?.thumbnail_key || "";
    this.template_type = data?.template_type || "";
    this.action_status = data?.action_status || "";
    this.action_result = data?.action_result || {
      not_started: { ui: [] },
      ongoing: {
        ui: [],
        data: { transaction_id: "", voi_link: "", share_code: "" },
      },
      completed: { ui: [] },
      in_review: { ui: [] },
      rejected: { ui: [] },
    };
    this.step_function_arn = data?.step_function_arn || "";
    this.document_results = null;
    this.execution_id = data?.execution_id || "";
    this.final_result = null;
    this.form_data = data?.form_data || {};
    this.sfn_token = data?.sfn_token || "";
    this.transaction_id = data?.transaction_id || "";
    this.employee_details = data?.employee_details || null;

    this.personal_information = data?.personal_information || undefined;
    this.card_information = data?.card_information || undefined;
    this.address_information = data?.address_information || undefined;
    this.additional_details = data?.additional_details || undefined;
  }
}
