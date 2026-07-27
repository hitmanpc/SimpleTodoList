import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TASK_STATUS, Task, TaskStatus } from './task.model';

@Component({
  selector: 'app-task',
  imports: [ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  readonly completedStatus = TASK_STATUS.COMPLETED;

  @Input({ required: true }) task!: Task;
  @Input({ required: true }) statuses: readonly TaskStatus[] = [];

  @Output() readonly taskUpdated = new EventEmitter<Task>();
  @Output() readonly taskDeleted = new EventEmitter<string>();

  isEditing = false;
  readonly editForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    }),
    status: new FormControl<TaskStatus>(TASK_STATUS.NEW, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  startEditing(): void {
    this.editForm.setValue({
      title: this.task.title,
      status: this.task.status,
    });
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveTask(): void {
    const title = this.editForm.controls.title.value.trim();
    if (this.editForm.invalid || title.length < 2) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.taskUpdated.emit({
      ...this.task,
      title,
      status: this.editForm.controls.status.value,
    });
    this.isEditing = false;
  }

  deleteTask(): void {
    this.taskDeleted.emit(this.task.id);
  }
}
