import { BaseController } from "@/controllers/index";
import Stores from "@/stores/Stores";
import { MResponse } from "@/models/index";
import VTask from "@/models/Task.model";
import { VTaskDetail } from "@/models/TaskDetail.model";
import { mockTaskDetail } from "@/mocks/mockTaskData";

export class TaskController extends BaseController {
  constructor() {
    super();
  }

  async getTasks({
    page = 1,
    pageSize = 20,
    sortBy = "created_at",
    sortDirection = "desc",
  }: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<MResponse> {
    try {
      const url = "/tasks/filter";
      const rs = await this.api.get(url, VTask, {
        page: page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_direction: sortDirection,
      });
      console.log("🚀dev-portal: ~ TaskController ~ getTasks ~ rs:", rs);
      if (rs?.isSuccessful() && rs?.data?.length > 0) {
        Stores.taskStore.setTasks(rs.data);
      }
      return rs;
    } catch (error) {
      console.log("🚀dev-portal: ~ TaskController ~ getTasks ~ error:", error);
      return this.throwError(error);
    }
  }

  async getTaskDetail(taskId: string): Promise<MResponse> {
    const url = `/tasks/detail/${taskId}`;
    try {
      const rs = await this.api.get(url, VTaskDetail);
      return rs;
    } catch (error) {
      console.error("API Error: Falling back to mock data", error);
      return { data: mockTaskDetail } as MResponse; // Fallback to mock data if API fails
    }
  }

  async generatePdf(taskId: string, data: any): Promise<MResponse> {
    const url = `/tasks/generate-pdf/${taskId}`;
    const rs = await this.api.post(url, undefined, data);
    return rs;
  }

  async submitTask(taskId: string): Promise<MResponse> {
    const url = `/tasks/confirm-task/${taskId}`;
    const rs = await this.api.post(url, undefined, null);
    return rs;
  }

  async rejectTask(taskId: string, comment?: string): Promise<MResponse> {
    const url = `/tasks/reject-task/${taskId}`;
    const rs = await this.api.post(url, undefined, {
      comment: comment,
    });
    return rs;
  }

  async assignTask(taskId: string, agentId: string): Promise<MResponse> {
    return await this.api.post(`/tasks/assign-task/${taskId}`, VTask, {
      user_id: agentId,
    });
  }
}
