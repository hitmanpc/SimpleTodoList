import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TASK_STORAGE, TaskStorage } from './services/task.service';
import { TASK_STATUS } from './task/task.model';

function createMemoryStorage(): TaskStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: TASK_STORAGE, useFactory: createMemoryStorage }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Simple Todo List');
  });

  it('should add a task', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.titleControl.setValue('Write unit tests');
    app.addTask();

    expect(app.tasks).toHaveLength(1);
    expect(app.tasks[0]).toMatchObject({
      title: 'Write unit tests',
      status: TASK_STATUS.NEW,
    });
  });

  it('should update and delete a task', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.titleControl.setValue('Ship the app');
    app.addTask();
    const task = app.tasks[0];

    app.updateTask({ ...task, status: TASK_STATUS.COMPLETED });
    expect(app.tasks[0].status).toBe(TASK_STATUS.COMPLETED);

    app.deleteTask(task.id);
    expect(app.tasks).toHaveLength(0);
  });
});
