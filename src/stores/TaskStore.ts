// src/stores/TaskStore.js
import VTask from "@/models/Task.model";
import { makeAutoObservable } from "mobx";
import { mockTaskList } from "@/mocks/mockTaskData";

class TaskStore {
  tasks: VTask[] = mockTaskList;
  taskTypes: { key: string; label: string }[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async setTasks(tasks: VTask[]) {
    this.tasks = tasks.length ? tasks : mockTaskList; // Fallback to mock data if no tasks provided
  }

  async setTaskTypes(types: any[]) {
    this.taskTypes = types.length
      ? types
      : [{ key: "default", label: "Default Type" }];
  }
}

export default TaskStore;
