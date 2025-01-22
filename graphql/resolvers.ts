import prisma from '@/lib/prisma';
import { GraphQLDateTime } from 'graphql-scalars';
import { CreateTaskInput, QueryArgs, CreateUserInput, UpdateUserInput, UpdateTaskInput, UpdateProjectInput, CreateProjectInput, AssignTaskInput } from './types';
import { Context } from '@/types/auth';
import { authResolvers } from './resolvers/auth.resolver';

export const resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    projects: async () => {
      return await prisma.project.findMany({
        include: { tasks: true } //optional if require then use it 
      });
    },
    project: async (_: any, { id }: QueryArgs) => {
      return await prisma.project.findUnique({
        where: { id },
        include: { tasks: true }
      });
    },
    tasks: async () => {
      return await prisma.task.findMany({
        include: {
          project: true,
          assignedTo: true
        }
      });
    },
    task: async (_: any, { id }: QueryArgs) => {
      return await prisma.task.findUnique({
        where: { id },
        include: {
          project: true,
          assignedTo: true
        }
      });
    },
    tasksByProject: async (_: any, { projectId }: { projectId: string }) => {
      return await prisma.task.findMany({
        where: { projectId },
        include: {
          project: true,
          assignedTo: true
        },
        // orderBy: { createdAt: 'desc' }
      });
    },
    users: async () => {
      return await prisma.user.findMany({
        include: {
          tasks: true
        }
      });
    },
    user: async (_: any, { id }: QueryArgs) => {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          tasks: true
        }
      });
    },
  },

  Mutation: {
    ...authResolvers.Mutation,
    
    createProject: async (_: any, { input }: { input: CreateProjectInput }) => {      
    
      const { name, description } = input;
      
      try {
        if (!name || !name.trim()) {
          throw new Error('Project name is required');
        }
        
        const existingProject = await prisma.project.findFirst({
          where: { name: name.trim() }
        });

        if (existingProject) {
          throw new Error('A project with this name already exists');
        }

        return await prisma.project.create({
          data: {
            name: name.trim(),
            description: description?.trim()
          }
        });
      } catch (error: any) {
        console.error('Error creating project:', error);
        throw new Error(error.message || 'Failed to create project');
      }
    },

    updateProject: async (_: any, { id, input }: { id: string, input: UpdateProjectInput }) => {
    
      const { name, description } = input;
      
      try {
        if (!id) {
          throw new Error('Project ID is required');
        }

        const existingProject = await prisma.project.findUnique({
          where: { id }
        });

        if (!existingProject) {
          throw new Error('Project not found');
        }

        if (name) {
          const nameExists = await prisma.project.findFirst({
            where: {
              name: name.trim(),
              id: { not: id }
            }
          });

          if (nameExists) {
            throw new Error('A project with this name already exists');
          }
        }

        return await prisma.project.update({
          where: { id },
          data: {
            name: name?.trim(),
            description: description?.trim()
          }
        });
      } catch (error: any) {
        console.error('Error updating project:', error);
        throw new Error(error.message || 'Failed to update project');
      }
    },

    deleteProject: async (_: any, { id }: { id: string }) => {
      
      try {
        if (!id) {
          throw new Error('Project ID is required');
        }

        const project = await prisma.project.findUnique({
          where: { id },
          include: { tasks: true }
        });

        if (!project) {
          throw new Error('Project not found');
        }

        await prisma.task.deleteMany({
          where: { projectId: id }
        });

        return await prisma.project.delete({
          where: { id }
        });
      } catch (error: any) {
        console.error('Error deleting project:', error);
        throw new Error(error.message || 'Failed to delete project');
      }
    },

    createTask: async (_: any, { input }: { input: CreateTaskInput }) => {
      const { title, description, status, projectId, userId } = input;
      
      try {
        if (!title || !title.trim()) {
          throw new Error('Task title is required');
        }

        if (!projectId) {
          throw new Error('Project ID is required');
        }

        const project = await prisma.project.findUnique({
          where: { id: projectId }
        });

        if (!project) {
          throw new Error('Project not found');
        }

        const duplicateTask = await prisma.task.findFirst({
          where: {
            title: title.trim(),
            projectId: projectId
          }
        });

        if (duplicateTask) {
          throw new Error('A task with this title already exists in this project');
        }

        return await prisma.task.create({
          data: {
            title: title.trim(),
            description: description?.trim(),
            status,
            projectId,
            userId
          },
          include: {
            project: true,
            assignedTo: true
          }
        });
      } catch (error: any) {
        console.error('Error creating task:', error);
        throw new Error(error.message || 'Failed to create task');
      }
    },

    updateTask: async (_: any, { id, input }: {id: string, input: UpdateTaskInput}) => {
      const { title, description, status, projectId, userId } = input;
     
      try {
        if (!id) {
          throw new Error('Task ID is required');
        }

        const existingTask = await prisma.task.findUnique({
          where: { id },
          include: { project: true } // optional if required then
        });

        if (!existingTask) {
          throw new Error('Task not found');
        }

        if (title) {
          const targetProjectId = projectId || existingTask.projectId;
          
          const duplicateTask = await prisma.task.findFirst({
            where: {
              title: title.trim(),
              projectId: targetProjectId,
              id: { not: id }
            }
          });

          if (duplicateTask) {
            throw new Error('A task with this title already exists in this project');
          }
        }

        if (projectId) {
          const project = await prisma.project.findUnique({
            where: { id: projectId }
          });

          if (!project) {
            throw new Error('Project not found');
          }
        }

        if (userId) {
          const user = await prisma.user.findUnique({
            where: { id: userId }
          });

          if (!user) {
            throw new Error('User not found');
          }
        }

        const updateData: any = {};
        if (title) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description?.trim();
        if (status) updateData.status = status;
        if (projectId) updateData.projectId = projectId;
        if (userId !== undefined) updateData.userId = userId;

        const updatedTask = await prisma.task.update({
          where: { id },
          data: updateData,
          include: {
            project: true,
            assignedTo: true
          }
        });

        return updatedTask;
      } catch (error: any) {
        console.error('Error updating task:', error);
        throw new Error(error.message || 'Failed to update task');
      }
    },

    deleteTask: async (_: any, { id }: { id: string }) => {
      try {
        if (!id) {
          throw new Error('Task ID is required');
        }

        const task = await prisma.task.findFirst({
          where: {
            id
          }
        });

        if (!task) {
          throw new Error('Task not found in this project');
        }

        return await prisma.task.delete({
          where: { id },
          include: {
            project: true,
            assignedTo: true
          }
        });

      } catch (error: any) {
        console.error('Error deleting task:', error);
        throw new Error(error.message || 'Failed to delete task');
      }
    },

    createUser: async (_: any, { input }: { input: CreateUserInput }) => {
      const { name, email } = input;
      
      try {
        if (!name?.trim() || !email?.trim()) {
          throw new Error('Name and email are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Invalid email format');
        }
        
        const existingUser = await prisma.user.findUnique({
          where: { email: email.trim() }
        });

        if (existingUser) {
          throw new Error('Email already exists');
        }

        return await prisma.user.create({
          data: {
            name: name.trim(),
            email: email.trim()
          },
          include: {
            tasks: true
          }
        });
      } catch (error: any) {
        console.error('Error creating user:', error);
        throw new Error(error.message || 'Failed to create user');
      }
    },

    updateUser: async (_: any, { id, input }: { id: string, input: UpdateUserInput }) => {
      const { name, email } = input;
      try {

        if (!id) {
          throw new Error('User ID is required');
        }

        const existingUser = await prisma.user.findUnique({
          where: { id }
        });

        if (!existingUser) {
          throw new Error('User not found');
        }

        if (email) {
          const emailExists = await prisma.user.findFirst({
            where: {
              email: email.trim(),
            }
          });

          if (emailExists) {
            throw new Error('Email already exists');
          }
        }

        return await prisma.user.update({
          where: { id },
          data: {
            name: name?.trim(),
            email: email?.trim()
          },
          include: {
            tasks: true
          }
        });
      } catch (error: any) {
        console.error('Error updating user:', error);
        throw new Error(error.message || 'Failed to update user');
      }
    },

    deleteUser: async (_: any, { id }: QueryArgs) => {
      try {
        if (!id) {
          throw new Error('User ID is required');
        }

        const user = await prisma.user.findUnique({
          where: { id }
        });

        if (!user) {
          throw new Error('User not found');
        }

        return await prisma.user.delete({
          where: { id },
          include: {
            tasks: true
          }
        });
      } catch (error: any) {
        console.error('Error deleting user:', error);
        throw new Error(error.message || 'Failed to delete user');
      }
    },

    assignTaskToUser: async (_: any, { input }: { input: AssignTaskInput }) => {
      const { taskId, userId } = input;
      
      try {
        if (!taskId || !userId) {
          throw new Error('Task ID and User ID are required');
        }

        // Verify task exists
        const task = await prisma.task.findUnique({
          where: { id: taskId }
        });

        if (!task) {
          throw new Error('Task not found');
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Assign task to user
        return await prisma.task.update({
          where: { id: taskId },
          data: { userId },
          include: {
            project: true,
            assignedTo: true
          }
        });
      } catch (error: any) {
        console.error('Error assigning task to user:', error);
        throw new Error(error.message || 'Failed to assign task to user');
      }
    },
  }
}; 