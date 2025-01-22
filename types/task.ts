import { Project } from "./project";

export type TaskStatus = "PENDING" | "INPROGRESS" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: TaskStatus;
  project: Project;
}
