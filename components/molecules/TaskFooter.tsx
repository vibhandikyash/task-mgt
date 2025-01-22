import { Box, Select, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { TaskStatus } from '../organisms/TaskComponent';

interface TaskFooterProps {
  assignedTo: string;
  status: TaskStatus;
  onStatusChange: (newStatus: TaskStatus) => void;
}

const teamMembers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
];

const TaskFooter = ({ assignedTo, status, onStatusChange }: TaskFooterProps) => {
  const getAssignedToName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED': return '#36B37E';
      case 'INPROGRESS': return '#0052CC';
      default: return '#FF991F';
    }
  };

  return (
    <Box sx={{ 
      pt: 2,
      mt: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.75rem',
      color: 'rgba(255,255,255,0.5)'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'rgba(255,255,255,0.7)'
      }}>
        <PersonIcon sx={{ fontSize: '0.875rem' }} />
        <span>{getAssignedToName(assignedTo)}</span>
      </Box>

      <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        size="small"
        variant="standard"
        sx={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.7)',
          '& .MuiSelect-select': {
            color: getStatusColor(status),
            py: 0
          },
          '&:before, &:after': {
            display: 'none'
          },
          '& .MuiSvgIcon-root': {
            color: 'rgba(255,255,255,0.5)'
          }
        }}
      >
        <MenuItem value="PENDING">Pending</MenuItem>
        <MenuItem value="INPROGRESS">In Progress</MenuItem>
        <MenuItem value="COMPLETED">Completed</MenuItem>
      </Select>
    </Box>
  );
};

export default TaskFooter; 