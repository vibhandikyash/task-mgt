import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Chip, 
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import ProgressBar from '../atoms/ProgressBar';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { RoleBasedRender } from './RoleBasedRender';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  tasks: Task[];
}

export default function ProjectCard({ project, onEdit, onDelete, tasks }: ProjectCardProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const completedTasks = tasks?.filter(task => task.status === 'COMPLETED').length;
  const totalTasks = tasks?.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const taskStats = {
    completed: completedTasks,
    inProgress: tasks?.filter(task => task.status === 'INPROGRESS').length,
    pending: tasks?.filter(task => task.status === 'PENDING').length
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click when clicking menu
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent navigation
    handleClose();
    onEdit?.(project);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent navigation
    handleClose();
    if (onDelete) {
      onDelete(project);
    }
  };

  return (
    <Card 
      onClick={() => router.push(`/projects/${project.id}`)}
      sx={{
        bgcolor: '#2A2A2A',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        },
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
              {project.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {project.description}
            </Typography>
          </Box>
          
          <RoleBasedRender>
            <IconButton 
              onClick={handleClick}
              size="small" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                sx: {
                  bgcolor: '#2C2C2C',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    fontSize: '0.875rem',
                    gap: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }
                }
              }}
            >
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ color: '#0052CC' }} />
                Edit Project
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: '#FF4D4F !important' }}>
                <DeleteIcon fontSize="small" sx={{ color: '#FF4D4F' }} />
                Delete Project
              </MenuItem>
            </Menu>
          </RoleBasedRender>
        </Box>

        <Box sx={{ mb: 3 }}>
          <ProgressBar value={progress} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', mb: 0.5 }}>
              Tasks Status
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`${taskStats.completed} Done`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  color: '#4CAF50',
                  fontSize: '0.75rem'
                }}
              />
              <Chip 
                label={`${totalTasks - taskStats.completed} Left`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  color: '#FFA726',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', mb: 0.5 }}>
              Tasks
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '0.875rem', textAlign: 'right' }}>
              {completedTasks}/{totalTasks}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 