import { Grid } from '@mui/material';
import ProjectCard from '@/components/molecules/ProjectCard';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';

interface ProjectsGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  tasks: Task[];
}

const ProjectsGrid = ({ projects, onEdit, onDelete, tasks }: ProjectsGridProps) => (
  <Grid container spacing={3}>
    {projects.map((project) => (
      <Grid item xs={12} sm={6} md={4} key={project.id}>
        <ProjectCard 
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          tasks={tasks.filter(task => task.project.id === project.id)}
        />
      </Grid>
    ))}
  </Grid>
);

export default ProjectsGrid; 