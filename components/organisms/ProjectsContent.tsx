import ProjectsHeader from '@/components/molecules/ProjectsHeader';
import ProjectsGrid from '@/components/organisms/ProjectsGrid';
import type { Project } from '@/types/project';
import LoadingSpinner from '../atoms/LoadingSpinner';
import type { Task } from '@/types/task';
interface ProjectsContentProps {
  projects: Project[];
  onAddProject: () => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  isLoading: boolean;
  tasks: Task[];
}

const ProjectsContent = ({ 
  projects, 
  tasks,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  isLoading,
}: ProjectsContentProps) => (
  <>
    <ProjectsHeader 
      projectCount={projects.length}
      onAddProject={onAddProject}
    />
    {isLoading ? <LoadingSpinner /> : (
    <ProjectsGrid 
      projects={projects}
      onEdit={onUpdateProject}
      onDelete={onDeleteProject}
      tasks={tasks}
    />
    )}
  </>
);

export default ProjectsContent; 