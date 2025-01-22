export interface Task {
  projectId: string;
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'INPROGRESS' | 'COMPLETED';
  assignedTo: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tasks?: Array<Task>;
}

export interface ProjectCardStats {
  completed: number;
  inProgress: number;
  pending: number;
} 