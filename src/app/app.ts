import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from './services/task.service';
import { TaskComponent } from './task/task.component';
import { TASK_STATUS, TASK_STATUSES, Task } from './task/task.model';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, TaskComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly taskService = inject(TaskService);

  readonly statuses = TASK_STATUSES;
  readonly taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    }),
  });

  tasks: Task[] = this.taskService.getTasks();

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

    this.tasks = this.taskService.addTask(title);
    this.taskForm.reset();
  }

  updateTask(updatedTask: Task): void {
    this.tasks = this.taskService.updateTask(updatedTask);
  }

  deleteTask(taskId: string): void {
    this.tasks = this.taskService.deleteTask(taskId);
  }
}
