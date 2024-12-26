import VTask from "@/models/Task.model";
import { VTaskDetail } from "@/models/TaskDetail.model";

export const mockTaskList: VTask[] = [
  new VTask({
    id: "1",
    title: "Task 1",
    status: "todo",
    created_at: "2024-01-01",
    start_date: "2024-01-01",
    template_type: "id_wwc",
    employee_details: {
      id: "1",
      first_name: "Huh",
      last_name: "Cat",
      email: "meomeo@example.com",
      date_of_birth: "1990-01-01",
      gender: "Female",
      country: "Vietnam",
      middle_name: "Meow",
    },
  }),
  new VTask({
    id: "2",
    title: "Task 2",
    status: "approved",
    created_at: "2024-01-01",
    start_date: "2024-01-01",
    template_type: "id_vevo",
    employee_details: {
      id: "2",
      first_name: "U A I",
      last_name: "Cat",
      email: "Umeomeo@example.com",
      date_of_birth: "1985-05-05",
      gender: "Male",
      country: "USA",
      middle_name: "Tiger",
    },
  }),
];

export const mockTaskDetail: VTaskDetail = new VTaskDetail({
  _id: "1",
  title: "Task 1",
  description:
    "This is the mock detail of Task 1 with complete data for testing.",
  status: "todo",
  created_at: "2024-01-01",
  start_date: "2024-01-01",
  end_date: "2024-01-10",
  template_type: "id_wwc",
  action_result: {
    not_started: {
      ui: [
        {
          type: "button",
          id: "1",
          key: "start",
          label: "Start Task",
          text: "Click here to start the task", // Added text
        },
      ],
    },
    ongoing: {
      ui: [
        {
          type: "text",
          id: "2",
          key: "info",
          label: "Task is ongoing",
          text: "The task is currently in progress", // Added text
        },
      ],
      data: {
        transaction_id: "12345",
        voi_link: "https://example.com",
        share_code: "SHARE123",
      },
    },
    completed: {
      ui: [
        {
          type: "button",
          id: "3",
          key: "complete",
          label: "Complete Task",
          text: "Click to mark the task as completed",
        },
      ],
    },
    in_review: {
      ui: [
        {
          type: "text",
          id: "4",
          key: "review",
          label: "Task is under review",
          text: "The task is currently being reviewed",
        },
      ],
    },
    rejected: {
      ui: [
        {
          type: "text",
          id: "5",
          key: "rejected",
          label: "Task was rejected",
          text: "This task has been rejected",
        },
      ],
    },
  },
  personal_information: {
    first_name: "Huh",
    middle_name: "Meow",
    last_name: "Cat",
  },
  card_information: {
    card_number: "1234-5678-9876-5432",
    license_number: "LIC123456",
  },
  address_information: {
    address: "123 Mock Street, Mock City, Vietnam",
  },
  additional_details: {
    expiry_date: "2025-12-31",
    country: "Vietnam",
    country_code: "VN",
  },
});
