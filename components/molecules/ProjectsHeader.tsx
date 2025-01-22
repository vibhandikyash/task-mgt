import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { RoleBasedRender } from './RoleBasedRender';
import LogoutButton from '../atoms/LogoutButton';

interface ProjectsHeaderProps {
  projectCount: number;
  onAddProject: () => void;
}

export default function ProjectsHeader({ projectCount, onAddProject }: ProjectsHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start' 
      }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
          Projects
          <Typography sx={{color: 'rgba(255,255,255,0.6)', mb: 2 }}>
          {projectCount} Total Projects
        </Typography>
      </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-end' : 'center',
          gap: isMobile ? 1 : 2  // Adds space between buttons
        }}>
          <RoleBasedRender>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddProject}
              sx={{
                backgroundColor: '#2196f3',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
                "@media (max-width: 768px)": {
                  padding: "6px 12px",
                  fontSize: "12px",
                  "& .MuiSvgIcon-root": {
                    fontSize: "18px",
                  },
                },
                "@media (max-width: 425px)": {
                  minWidth: 0,
                  padding: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                  "& .MuiButton-startIcon + .MuiButton-endIcon": {
                    display: "none",
                  },
                }
              }}
            >
              <Box sx={{ "@media (max-width: 425px)": { display: "none" } }}>
                Add New Project
              </Box>
            </Button>
          </RoleBasedRender>
          <LogoutButton />
        </Box>
      </Box>
    </Box>
  );
} 