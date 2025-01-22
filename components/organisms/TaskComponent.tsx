'use client';

import { Box, Card, CardContent, Typography, Select, MenuItem, SelectChangeEvent, IconButton, Menu } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { updateExistingTask } from '@/lib/api';
import client from '@/graphql/apollo-client';
import { Task } from '@/types/task';
import { Draggable } from 'react-beautiful-dnd';
import { User } from '@/types';

export type TaskStatus = 'PENDING' | 'INPROGRESS' | 'COMPLETED';

interface TaskProps {
  id: string;
  index: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  projectId?: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  users: User[];
}

const TaskComponent = ({ id, index, title, description, status, assignedTo, onStatusChange, onEdit, onDelete, projectId, users }: TaskProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit({ id, title, description, assignedTo: assignedTo || '', status, project: { id: projectId || '', name: '', description: '', createdAt: '' } });
    handleClose();
  };

  const handleDelete = () => {
    onDelete(id);
    handleClose();
  };

  const handleStatusChange = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value as TaskStatus;
    
    try {
      // Call the API to update the task status
      await updateExistingTask(
        client,
        id,
        { status: newStatus },
        projectId
      );
      
      // Call the parent handler to update local state
      onStatusChange(id, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
      // You might want to add error handling UI here
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return '#36B37E'; // Brighter green
      case 'INPROGRESS': 
        return '#0052CC'; // Brighter blue
      default:
        return '#FF991F'; // Brighter yellow/orange
    }
  };

  const getAssignedToName = (id: string) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : 'Unassigned';
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? provided.draggableProps.style?.transform 
              : 'none', // Only apply transform during drag
          }}
        >
          <Card 
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: snapshot.isDragging ? '#383838' : '#2C2C2C',
              boxShadow: snapshot.isDragging 
                ? '0 8px 16px rgba(0,0,0,0.4)' 
                : '0 2px 4px rgba(0,0,0,0.2)',
              '&:hover': {
                backgroundColor: '#383838',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transform: 'none', // Remove hover transform
                transition: 'all 0.2s ease-in-out'
              },
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              {/* Status Label and Menu */}
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
                  <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ color: '#0052CC' }} />
                    Edit Task
                  </MenuItem>
                  <MenuItem onClick={handleDelete} sx={{ color: '#FF4D4F !important' }}>
                    <DeleteIcon fontSize="small" sx={{ color: '#FF4D4F' }} />
                    Delete Task
                  </MenuItem>
                </Menu>
              </Box>

              {/* Title */}
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1.5,
                  fontSize: '1rem',
                  lineHeight: 1.3,
                  color: 'white'
                }}
              >
                {title}
              </Typography>

              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.5,
                  color: 'rgba(255,255,255,0.7)',
                  mb: 2
                }}
              >
                {description}
              </Typography>

              {/* Footer */}
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
                  <span>{assignedTo ? getAssignedToName(assignedTo) : 'Unassigned'}</span>
                </Box>

                <Select
                  value={status}
                  onChange={handleStatusChange}
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
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskComponent; 