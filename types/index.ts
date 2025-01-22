// Common types
export type TaskStatus = "PENDING" | "INPROGRESS" | "COMPLETED";

// Base Task interface
export interface BaseTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
}

// Task with project reference
export interface Task extends BaseTask {
  project: Project;
}

// Task within project
export interface ProjectTask extends BaseTask {
  projectId: string;
}

// Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tasks?: ProjectTask[];
}

// Project statistics
export interface ProjectStats {
  completed: number;
  inProgress: number;
  pending: number;
}

// Project Input Types
export interface CreateProjectInput {
  name: string;
  description: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

// Project Update with ID
export interface ProjectUpdateInput extends UpdateProjectInput {
  id: string;
}

// Task Input Types
export interface CreateTaskInput {
  title: string;
  description: string;
  projectId: string;
  status?: TaskStatus;
  assignedTo?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
}

// Task Update with ID
export interface TaskUpdateInput extends UpdateTaskInput {
  id: string;
}

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  tasks?: BaseTask[];
}

export type UserRole = 'ADMIN' | 'USER';

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}
