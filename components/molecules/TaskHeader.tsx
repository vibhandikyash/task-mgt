import { Box, IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
      case 'COMPLETED': return '#36B37E';
      case 'INPROGRESS': return '#0052CC';
      default: return '#FF991F';
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
      >
        <MoreHorizIcon />
      </IconButton>
    </Box>
  );
};

export default TaskHeader; 