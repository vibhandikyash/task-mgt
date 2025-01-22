import { Box } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import TaskColumnHeader from '../molecules/TaskColumnHeader';
import TaskComponent from './TaskComponent';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { Task } from '@/types/task';
import { TaskStatus, User } from '@/types';
import { memo } from 'react';

interface TaskColumnProps {
  status: string;
  tasks: Task[];
  statusHeader: {
    title: string;
    color: string;
  };
  taskCount: number;
  loading: boolean;
  selectedProjectId?: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  users: User[];
}

const TaskColumn = memo(({
  status,
  tasks,
  statusHeader,
  taskCount,
  loading,
  selectedProjectId,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  users,
}: TaskColumnProps) => (
  <Box sx={{ minWidth: 0 }}>
    <TaskColumnHeader
      color={statusHeader.color}
      title={statusHeader.title}
      count={taskCount}
    />
    
    <Droppable 
      droppableId={status}
      type="TASK"
      direction="vertical"
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={false}
    >
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            minHeight: 100,
            backgroundColor: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'transparent',
            transition: 'background-color 0.2s ease',
            borderRadius: 8,
            padding: snapshot.isDraggingOver ? 1 : 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {tasks.map((task, index) => (
                <TaskComponent
                  key={`${selectedProjectId}-${task.id}`}
                  {...task}
                  projectId={selectedProjectId || ''}
                  index={index}
                  onStatusChange={onStatusChange}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  users={users}
                  assignedTo={task?.assignedTo?.id}
                />
                // <div key={`${selectedProjectId}-${task.id}`}>{console.log(task?.assignedTo?.id)}</div>
              ))}
              {provided.placeholder}
            </>
          )}
        </Box>
      )}
    </Droppable>
  </Box>
));

TaskColumn.displayName = 'TaskColumn';
export default TaskColumn;