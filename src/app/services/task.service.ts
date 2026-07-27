import { inject, Injectable, InjectionToken } from '@angular/core';
import { TASK_STATUS, TASK_STATUSES, Task, TaskStatus } from '../task/task.model';

const STORAGE_KEY = 'simpletodolist.tasks';

export interface TaskStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const TASK_STORAGE = new InjectionToken<TaskStorage | null>('TASK_STORAGE', {
  providedIn: 'root',
  factory: () => {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  },
});

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly storage = inject(TASK_STORAGE);
  private tasks: Task[] = this.getStoredTasks();

  getTasks(): Task[] {
    return [...this.tasks];
  }

  addTask(title: string): Task[] {
    const task: Task = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      title,
      status: TASK_STATUS.NEW,
    };

    this.tasks = [task, ...this.tasks];
    return this.saveTasksToLocalStorage();
  }

  updateTask(updatedTask: Task): Task[] {
    this.tasks = this.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    return this.saveTasksToLocalStorage();
  }

  deleteTask(taskId: string): Task[] {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    return this.saveTasksToLocalStorage();
  }

  private getStoredTasks(): Task[] {
    try {
      const storedTasks = this.storage?.getItem(STORAGE_KEY);
      if (!storedTasks) {
        return [];
      }

      const parsedTasks = JSON.parse(storedTasks) as Task[];
      return Array.isArray(parsedTasks)
        ? parsedTasks.filter(
            (task) =>
              TASK_STATUSES.includes(task.status as TaskStatus),
          )
        : [];
    } catch {
      return [];
    }
  }

  private saveTasksToLocalStorage(): Task[] {
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch {
    }

    return this.getTasks();
  }
}
