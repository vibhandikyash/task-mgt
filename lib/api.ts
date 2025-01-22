import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  createTask,
  getTasks,
  getTaskByProject,
  updateTask,
  deleteTask,
  signUp,
  signIn,
  getUsers
} from '@/graphql/queries/query';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import type { AuthPayload } from '@/types/auth';
import type { User } from '@/types';

// Project Types
interface CreateProjectInput {
  name: string;
  description?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
}

// Task Types
interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  projectId: string;
  assignedTo?: string | null;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  userId?: string | null;
}

interface SignUpInput {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}
interface SignInInput {
  email: string;
  password: string;
}

// Project Functions
export async function getAllProjects(client: ApolloClient<NormalizedCacheObject>): Promise<Project[]> {
  try {
    const { data } = await client.query({
      query: getProjects,
      fetchPolicy: 'network-only'
    });
    return data.projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function createNewProject(
  client: ApolloClient<NormalizedCacheObject>,
  input: CreateProjectInput
): Promise<Project> {
  try {
    const { data } = await client.mutate({
      mutation: createProject,
      variables: { input },
      update: (cache, { data }) => {
        const existingProjects = cache.readQuery({ query: getProjects });
        cache.writeQuery({
          query: getProjects,
          data: {
            projects: [...existingProjects.projects, data.createProject]
          }
        });
      }
    });
    return data.createProject;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateExistingProject(
  client: ApolloClient<NormalizedCacheObject>,
  id: string, 
  input: UpdateProjectInput
): Promise<Project> {
  try {
    const { data } = await client.mutate({
      mutation: updateProject,
      variables: { id, input },
      update: (cache, { data }) => {
        const existingProjects = cache.readQuery({ query: getProjects });
        const updatedProjects = existingProjects.projects.map((project: Project) => 
          project.id === id ? data.updateProject : project
        );
        cache.writeQuery({
          query: getProjects,
          data: { projects: updatedProjects }
        });
      }
    });
    return data.updateProject;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteExistingProject(
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<void> {
  try {
    await client.mutate({
      mutation: deleteProject,
      variables: { id },  // Pass id directly as variable
      update: (cache) => {
        const existingProjects = cache.readQuery<{ projects: Project[] }>({ 
          query: getProjects 
        });
        
        if (existingProjects) {
          cache.writeQuery({
            query: getProjects,
            data: {
              projects: existingProjects.projects.filter(project => project.id !== id)
            }
          });
        }
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

// Task Functions
export async function getAllTasks(
  client: ApolloClient<NormalizedCacheObject>
): Promise<Task[]> {
  try {
    const { data } = await client.query({
      query: getTasks,
      fetchPolicy: 'network-only'
    });
    return data.tasks;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTasksByProject(
  client: ApolloClient<NormalizedCacheObject>,
  projectId: string
): Promise<Task[]> {
  try {
    const { data } = await client.query({
      query: getTaskByProject,
      variables: { projectId },
      fetchPolicy: 'network-only'
    });
    return data.tasksByProject;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createNewTask(
  client: ApolloClient<NormalizedCacheObject>,
  input: CreateTaskInput
): Promise<Task> {
  try {
    const taskInput = {
      title: input.title,
      description: input.description,
      status: input.status || "PENDING",
      projectId: input.projectId,
      ...(input.assignedTo ? { userId: input.assignedTo } : {})
    };

    const { data } = await client.mutate({
      mutation: createTask,
      variables: { input: taskInput },
      update: (cache, { data }) => {
        try {
          const existingTasks = cache.readQuery({ 
            query: getTaskByProject,
            variables: { projectId: input.projectId }
          });
          if (existingTasks) {
            cache.writeQuery({
              query: getTaskByProject,
              variables: { projectId: input.projectId },
              data: {
                tasksByProject: [...existingTasks.tasksByProject, data.createTask]
              }
            });
          }
        } catch (error) {
          console.warn('Cache update failed:', error);
          // Refetch the query instead
          client.refetchQueries({
            include: [{
              query: getTaskByProject,
              variables: { projectId: input.projectId }
            }]
          });
        }
      },
      // Add this to ensure we get all the fields we need
      refetchQueries: ['GetTaskByProject']
    });
    return data.createTask;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateExistingTask(
  client: ApolloClient<NormalizedCacheObject>,
  id: string,
  input: UpdateTaskInput,
  projectId?: string
): Promise<Task> {
  try {
    const { data } = await client.mutate({
      mutation: updateTask,
      variables: { id, input },
      update: (cache, { data }) => {
        try {
          const existingTasks = cache.readQuery({
            query: getTaskByProject,
            variables: { projectId }
          });
          if (existingTasks) {
            const updatedTasks = existingTasks.tasksByProject.map((task: Task) =>
              task.id === id ? data.updateTask : task
            );
            cache.writeQuery({
              query: getTaskByProject,
              variables: { projectId },
              data: { tasksByProject: updatedTasks }
            });
          }
        } catch (error) {
          console.warn('Cache update failed:', error);
          // Refetch the query instead
          client.refetchQueries({
            include: [{
              query: getTaskByProject,
              variables: { projectId }
            }]
          });
        }
      },
      // Add this to ensure we get all the fields we need
      refetchQueries: ['GetTaskByProject']
    });
    return data.updateTask;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteExistingTask(
  client: ApolloClient<NormalizedCacheObject>,
  id: string,
  projectId: string
): Promise<void> {
  try {
    await client.mutate({
      mutation: deleteTask,
      variables: { id },
      update: (cache) => {
        const existingTasks = cache.readQuery<{ tasksByProject: Task[] }>({
          query: getTaskByProject,
          variables: { projectId }
        });
        
        if (existingTasks) {
          cache.writeQuery({
            query: getTaskByProject,
            variables: { projectId },
            data: {
              tasksByProject: existingTasks.tasksByProject.filter(task => task.id !== id)
            }
          });
        }
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function signUpUser(
  client: ApolloClient<NormalizedCacheObject>,
  input: SignUpInput
): Promise<AuthPayload> {
  try {
    const { data } = await client.mutate({
      mutation: signUp,
      variables: { input }
    });
    
    localStorage.setItem('token', data.signUp.token);
    
    return data.signUp;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function signInUser(
  client: ApolloClient<NormalizedCacheObject>,
  input: SignInInput
): Promise<AuthPayload> {
  try {
    const { data } = await client.mutate({
      mutation: signIn,
      variables: { input }
    });
    
    localStorage.setItem('token', data.signIn.token);
    
    return data.signIn;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAllUsers(
  client: ApolloClient<NormalizedCacheObject>
): Promise<User[]> {
  try {
    const { data } = await client.query({
      query: getUsers,
      fetchPolicy: 'network-only'
    });
    return data.users;
  } catch (error) {
    throw new Error(error.message);
  }
}
