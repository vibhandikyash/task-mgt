"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  Project, 
  ProjectTask,  
  UpdateProjectInput 
} from '@/types';

interface ProjectContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  deleteProject: (projectId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, data: UpdateProjectInput) => void;
  updateProjectTasks: (projectId: string, tasks: ProjectTask[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [...prev, project]);
  }, []);

  const updateProject = useCallback((projectId: string, data: UpdateProjectInput) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...data }
        : project
    ));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  }, []);

  const updateProjectTasks = useCallback((projectId: string, tasks: ProjectTask[]) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, tasks }
          : project
      )
    );
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      setProjects,
      selectedProjectId,
      setSelectedProjectId,
      deleteProject,
      addProject,
      updateProject,
      updateProjectTasks,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
} 