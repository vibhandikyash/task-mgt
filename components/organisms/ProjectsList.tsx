import { Box } from "@mui/material";
import ProjectItem from "./ProjectItem";
import { Project } from "../../types/project";

interface ProjectsListProps {
  projects: Project[];
  selectedProjectId?: string;
  onProjectSelect: (project: Project) => void;
}

const ProjectsList = ({
  projects,
  selectedProjectId,
  onProjectSelect,
}: ProjectsListProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    {projects?.map((project) => (
      <ProjectItem
        key={project.id}
        project={project}
        isSelected={selectedProjectId === project.id}
        onSelect={() => onProjectSelect(project)}
      />
    ))}
  </Box>
);

export default ProjectsList;
