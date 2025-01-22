import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useMemo } from 'react';
import ProjectHeader from "../molecules/ProjectHeader";
import { TaskStatus } from "@/types";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Box } from "@mui/material";
import TaskColumn from "../organisms/TaskColumn";
import { updateExistingTask } from "@/lib/api";
import client from "@/graphql/apollo-client";
import { User } from "@/types";

interface TasksSectionProps {
  selectedProject?: Project;
  groupedTasks: {
    pending: Task[];
    in_progress: Task[];
    completed: Task[];
  };
  statusHeaders: {
    [key: string]: { title: string; color: string };
  };
  onAddTask: () => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  loading: boolean;
  users: User[];
}

const TasksSection = ({
  loading,
  selectedProject,
  groupedTasks,
  statusHeaders,
  onAddTask,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  users,
}: TasksSectionProps) => {
  // Memoize the status map to prevent recreating on each render
  const statusMap = useMemo(() => ({
    'pending': 'PENDING',
    'in_progress': 'INPROGRESS',
    'completed': 'COMPLETED'
  } as const), []);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceKey = source.droppableId.toLowerCase() as keyof typeof groupedTasks;
    const destinationKey = destination.droppableId.toLowerCase() as keyof typeof groupedTasks;

    if (sourceKey === destinationKey && source.index === destination.index) {
      return; // No movement occurred
    }

    // Optimistically update UI first
    const newStatus = statusMap[destinationKey];
    onStatusChange(draggableId, newStatus);

    // Then update backend
    try {
      await updateExistingTask(
        client,
        draggableId,
        { status: newStatus },
        selectedProject?.id
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert the optimistic update on error
      onStatusChange(draggableId, statusMap[sourceKey]);
    }
  };

  // Memoize the columns to prevent unnecessary re-renders
  const columns = useMemo(() => (
    (Object.keys(groupedTasks) as Array<keyof typeof groupedTasks>).map(
      (status) => (
        <TaskColumn
          key={`${selectedProject?.id}-${status}`}
          status={status}
          tasks={groupedTasks[status]}
          statusHeader={statusHeaders[status]}
          taskCount={groupedTasks[status].length}
          loading={loading}
          selectedProjectId={selectedProject?.id}
          onStatusChange={onStatusChange}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          users={users}
        />
      )
    )
  ), [selectedProject?.id, groupedTasks, statusHeaders, loading, onStatusChange, onEditTask, onDeleteTask, users]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        width: { xs: "100%", md: "65%" },
        bgcolor: "#1E1F21",
        overflowY: "auto",
      }}
    >
      <ProjectHeader
        name={selectedProject?.name}
        taskCount={Object.values(groupedTasks).flat().length}
        onAddTask={onAddTask}
      />

      <DragDropContext 
        onDragEnd={handleDragEnd}
        key={selectedProject?.id || 'no-project'}
      >
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 3fr)"
            },
          }}
        >
          {columns}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default TasksSection;
