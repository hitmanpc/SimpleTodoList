import { TestBed } from '@angular/core/testing';
import { TASK_STATUS } from '../task/task.model';
import { TASK_STORAGE, TaskService, TaskStorage } from './task.service';

function createMemoryStorage(): TaskStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TASK_STORAGE, useFactory: createMemoryStorage }],
    });
    service = TestBed.inject(TaskService);
  });

  it('should add a new task', () => {
    const tasks = service.addTask('Write service tests');

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      title: 'Write service tests',
      status: TASK_STATUS.NEW,
    });
  });

  it('should update a task', () => {
    const task = service.addTask('Complete assessment')[0];
    const tasks = service.updateTask({ ...task, status: TASK_STATUS.COMPLETED });

    expect(tasks[0].status).toBe(TASK_STATUS.COMPLETED);
  });

  it('should delete a task', () => {
    const task = service.addTask('Temporary task')[0];
    const tasks = service.deleteTask(task.id);

    expect(tasks).toHaveLength(0);
  });

  it('should return a copy of its task collection', () => {
    const tasks = service.addTask('Protected task');
    tasks.length = 0;

    expect(service.getTasks()).toHaveLength(1);
  });
});
