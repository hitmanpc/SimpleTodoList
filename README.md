# Todo Assessment

A simple to-do list built with Angular 22. The project demonstrates reactive forms,
property and event binding, reusable components, dependency injection, and browser
storage without a database.

## Features

- Display a list of tasks
- Add a task using a validated reactive form
- Edit a task's title and status
- Delete a task
- Persist tasks in browser `localStorage`
- Continue in memory when browser storage is unavailable
- Restrict task status to:
  - `New`
  - `InProgress`
  - `Rejected`
  - `Verified`
  - `Completed`

## Project structure

```text
src/app/
├── app.ts                         Main application component
├── app.html                       Task form and task list
├── app.spec.ts                    Application component tests
├── services/
│   ├── task.service.ts            Task state, CRUD, and persistence
│   └── task.service.spec.ts       Task service tests
└── task/
    ├── task.component.ts          Reusable task component
    ├── task.component.html
    ├── task.component.scss
    └── task.model.ts              Task model and status constants
```

The main component passes each task to `TaskComponent` through `@Input`. Task updates
and deletions are sent back through `@Output` events. `TaskService` owns task state
and persistence so that components remain focused on forms and presentation.

Storage is provided through the injectable `TASK_STORAGE` token. The application
uses `window.localStorage`, while unit tests use isolated in-memory storage.

## Requirements

- WSL with NVM
- Node.js 26 (tested with 26.1.0)
- npm

## Setup

From WSL:

```bash
nvm use 26
npm install
npm start
```

Open `http://localhost:4200/`.

## Tests

Run the Vitest unit tests:

```bash
nvm use 26
npm test -- --watch=false
```

The test suite covers the main component and the task service, including adding,
updating, deleting, and protecting the service's internal task collection.

## Production build

```bash
nvm use 26
npm run build
```

Build output is written to `dist/todoAssessment/`.
