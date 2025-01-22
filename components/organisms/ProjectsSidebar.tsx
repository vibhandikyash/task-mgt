import { Paper, Drawer, useMediaQuery, useTheme } from "@mui/material";
import SectionHeader from "../molecules/SectionHeader";
import ProjectsList from "./ProjectsList";
import { Project } from "../../types/project";
import { useState } from "react";

interface ProjectsSidebarProps {
  projects: Project[];
  selectedProject?: Project;
  onProjectSelect: (project: Project) => void;
  onAddProject: () => void;
}

const ProjectsSidebar = ({
  projects,
  selectedProject,
  onProjectSelect,
  onAddProject,
}: ProjectsSidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sidebarContent = (
    <>
      <SectionHeader 
        title="Projects" 
        onAddClick={onAddProject}
        showDrawerIcon={false}
      />
      
      <ProjectsList
        projects={projects}
        selectedProjectId={selectedProject?.id}
        onProjectSelect={(project) => {
          onProjectSelect(project);
          if (isMobile) setIsDrawerOpen(false);
        }}
      />
    </>
  );

  if (isMobile) {
    return (
      <>
        <Paper
          sx={{
            width: "100%",
            p: 2,
            borderBottom: 1,
            borderColor: "rgba(255,255,255,0.1)",
            bgcolor: "#2C2C2C",
            color: "white",
          }}
        >
          <SectionHeader 
            title="Projects" 
            onAddClick={onAddProject}
            onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
            showDrawerIcon={true}
          />
        </Paper>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: "80%",
              maxWidth: 300,
              bgcolor: "#2C2C2C",
              color: "white",
              p: 2,
            }
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  return (
    <Paper
      sx={{
        width: "35%",
        maxWidth: 300,
        p: 2,
        borderRadius: 0,
        borderRight: 1,
        borderColor: "rgba(255,255,255,0.1)",
        bgcolor: "#2C2C2C",
        color: "white",
      }}
    >
      {sidebarContent}
    </Paper>
  );
};

export default ProjectsSidebar;
