import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskComponent } from './task/task.component';
import { TASK_STATUS, TASK_STATUSES, Task, TaskStatus } from './task/task.model';

const STORAGE_KEY = 'todo-assessment.tasks';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, TaskComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly statuses = TASK_STATUSES;
  readonly taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    }),
  });

  tasks: Task[] = this.loadTasks();

  get titleControl(): FormControl<string> {
    return this.taskForm.controls.title;
  }

  get openTaskCount(): number {
    return this.tasks.filter((task) => task.status !== TASK_STATUS.COMPLETED).length;
  }

  addTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const title = this.titleControl.value.trim();
    if (title.length < 2) {
      this.titleControl.setErrors({ minlength: true });
      return;
    }

    this.tasks = [
      {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        title,
        status: TASK_STATUS.NEW,
      },
      ...this.tasks,
    ];
    this.taskForm.reset();
    this.saveTasks();
  }

  updateTask(updatedTask: Task): void {
    this.tasks = this.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    this.saveTasks();
  }

  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();
  }

  private loadTasks(): Task[] {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (!storedTasks) {
        return [];
      }

      const parsedTasks = JSON.parse(storedTasks) as Task[];
      return Array.isArray(parsedTasks)
        ? parsedTasks.filter(
            (task) =>
              typeof task.id === 'string' &&
              typeof task.title === 'string' &&
              TASK_STATUSES.includes(task.status as TaskStatus),
          )
        : [];
    } catch {
      return [];
    }
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch {
    }
  }
}
