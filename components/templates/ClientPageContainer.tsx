"use client";

import { useState, useEffect } from 'react';
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

  const handleAddProject = async (projectData: CreateProjectInput) => {
    try {
      const newProject = await createNewProject(client, projectData);
      addProject(newProject as Project); // Use context method
      setIsNewProjectDialogOpen(false);
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
        deleteProject(deleteProjectId); // Use context method
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
          projects={projects} // Use projects from context
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