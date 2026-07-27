export const TASK_STATUS = {
  NEW: 'New',
  IN_PROGRESS: 'InProgress',
  REJECTED: 'Rejected',
  VERIFIED: 'Verified',
  COMPLETED: 'Completed',
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const TASK_STATUSES: readonly TaskStatus[] = Object.values(TASK_STATUS);

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}
