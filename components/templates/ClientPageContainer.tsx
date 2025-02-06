"use client";

import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { 
  Project,  
  CreateProjectInput, 
  UpdateProjectInput 
} from '@/types'
import { Task } from '@/types/task';
import { useProjectContext } from '@/contexts/ProjectContext';
import ProjectsContent from '@/components/organisms/ProjectsContent';
import NewProjectDialog from '@/components/organisms/NewProjectDialog';
import EditProjectDialog from '@/components/organisms/EditProjectDialog';
import { getAllProjects, createNewProject, updateExistingProject, deleteExistingProject, getAllTasks } from '@/lib/api';
import client from '@/graphql/apollo-client';
import PageLayout from '../atoms/PageLayout';
import ConfirmDialog from '@/components/molecules/ConfirmDialog';
import {
  onProjectCreated,
  onProjectUpdated,
  onProjectDeleted,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  onTaskAssigned, 
} from '@/graphql/queries/query';

export default function ClientPageContainer() {
  const { 
    projects, 
    setProjects, 
    deleteProject, 
    addProject,
    updateProject 
  } = useProjectContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [projectsData, tasksData] = await Promise.all([
          getAllProjects(client),
          getAllTasks(client)
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setProjects]);

  // Project Subscriptions
  useSubscription(onProjectCreated, {
    onData: ({ data }) => {
      const newProject = data?.data?.projectCreated;
      if (newProject && !projects.some(project => project.id === newProject.id)) {
        setProjects(prevProjects => [...prevProjects, newProject]);
      }
    }
  });

  useSubscription(onProjectUpdated, {
    onData: ({ data }) => {
      const updatedProject = data?.data?.projectUpdated;
      if (updatedProject) {
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === updatedProject.id ? updatedProject : project
          )
        );
      }
    }
  });

  useSubscription(onProjectDeleted, {
    onData: ({ data }) => {
      const deletedProject = data?.data?.projectDeleted;
      if (deletedProject) {
        setProjects(prevProjects => 
          prevProjects.filter(project => project.id !== deletedProject.id)
        );
      }
    }
  });

  // Task Subscriptions
  useSubscription(onTaskCreated, {
    onData: ({ data }) => {
      const newTask = data?.data?.taskCreated;
      if (newTask) {
        setTasks(prevTasks => {
          if (!prevTasks.some(task => task.id === newTask.id)) {
            return [...prevTasks, newTask];
          }
          return prevTasks;
        });
      }
    }
  });

  useSubscription(onTaskUpdated, {
    onData: ({ data }) => {
      const updatedTask = data?.data?.taskUpdated;
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      }
    }
  });

  useSubscription(onTaskDeleted, {
    onData: ({ data }) => {
      const deletedTask = data?.data?.taskDeleted;
      if (deletedTask) {
        setTasks(prevTasks => 
          prevTasks.filter(task => task.id !== deletedTask.id)
        );
      }
    }
  });

  useSubscription(onTaskAssigned, {
    onData: ({ data }) => {
      const assignedTask = data?.data?.taskAssigned;
      if (assignedTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === assignedTask.id ? assignedTask : task
          )
        );
      }
    }
  });

  const handleAddProject = async (projectData: CreateProjectInput) => {
    try {
      const newProject = await createNewProject(client, projectData);
      addProject(newProject as Project);
      setIsNewProjectDialogOpen(false);
      
      setTimeout(() => {
        setProjects(prevProjects => {
          return prevProjects.filter((project, index, self) =>
            index === self.findIndex(p => p.id === project.id)
          );
        });
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create project:', error);
      setError(error instanceof Error ? error : new Error('Failed to create project'));
    }
  };

  const handleUpdateProject = async (projectData: { id: string; name: string; description: string }) => {
    try {
      const updateInput: UpdateProjectInput = {
        name: projectData.name,
        description: projectData.description
      };

      await updateExistingProject(client, projectData.id, updateInput);
      updateProject(projectData.id, updateInput);
      setEditingProject(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to update project'));
    }
  };

  const handleDeleteProject = (project: Project) => {
    setDeleteProjectId(project.id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteProjectId) {
      try {
        await deleteExistingProject(client, deleteProjectId);
        deleteProject(deleteProjectId);
        setDeleteProjectId(null);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to delete project'));
      }
    }
  };

  return (
    <PageLayout>
      {tasks.length > 0 && (
        <ProjectsContent 
          projects={projects}
          onAddProject={() => setIsNewProjectDialogOpen(true)}
          onUpdateProject={(project) => setEditingProject(project)}
          onDeleteProject={handleDeleteProject}
          isLoading={isLoading}
          tasks={tasks}
        />
      )}
      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => {
          setIsNewProjectDialogOpen(false);
          setError(null);
        }}
        onAdd={handleAddProject}
        error={error?.message}
      />
      <EditProjectDialog
        open={Boolean(editingProject)}
        onClose={() => {
          setEditingProject(null);
          setError(null);
        }}
        onSave={handleUpdateProject}
        project={editingProject}
        error={error?.message}
      />
      <ConfirmDialog
        open={!!deleteProjectId}
        title="Delete Project"
        message="Are you sure you want to delete this project? All tasks within this project will be permanently deleted. This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteProjectId(null)}
      />
    </PageLayout>
  );
} 