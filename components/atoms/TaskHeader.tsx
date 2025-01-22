import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { TaskStatus } from '../organisms/TaskComponent';

interface TaskHeaderProps {
  status: TaskStatus;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskHeader = ({ status, onEdit, onDelete }: TaskHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return '#36B37E';
      case 'INPROGRESS': 
        return '#0052CC';
      default:
        return '#FF991F';
    }
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: `${getStatusColor(status)}20`,
          color: getStatusColor(status),
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {status.replace('_', ' ')}
      </Box>
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
        <MenuItem onClick={() => { onEdit(); handleClose(); }}>
          <EditIcon fontSize="small" sx={{ color: '#0052CC' }} />
          Edit Task
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleClose(); }} sx={{ color: '#FF4D4F !important' }}>
          <DeleteIcon fontSize="small" sx={{ color: '#FF4D4F' }} />
          Delete Task
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskHeader; 