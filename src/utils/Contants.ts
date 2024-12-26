export const USER_TOKEN_KEY = "user_token_key";
export const CURRENT_ORGANIZATION = "current_organization";

export const TEMPLATE_TYPES = [
  {
    key: "id_vero",
    label: "ID Vero",
  },
  {
    key: "id_vevo",
    label: "VEVO",
  },
  {
    key: "police_check",
    label: "Police Check",
  },
  {
    key: "id_wwc",
    label: "WWC",
  },
  {
    key: "custom",
    label: "Custom Template",
  },
];

export const TASK_ACTION_STATUS = [
  "not_started",
  "ongoing",
  "in_review",
  "completed",
  "rejected",
];

export const TEMPLATE_TYPES_MAP = {
  id_vero: "ID Vero",
  id_vevo: "VEVO",
  police_check: "Police Check",
  id_wwc: "WWC",
  custom: "Custom Template",
  qual_check: "Qual Check",
  "": "Unknown",
};
