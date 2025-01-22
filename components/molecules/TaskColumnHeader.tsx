import { Box } from '@mui/material';
import StatusDot from '../atoms/StatusDot'; 
import ColumnTitle from '../atoms/ColumnTitle';
import TaskCount from '../atoms/TaskCount';

interface TaskColumnHeaderProps {
  color: string;
  title: string;
  count: number;
}

const TaskColumnHeader = ({ color, title, count }: TaskColumnHeaderProps) => (
  <Box
    sx={{
      mb: 2,
      p: 2,
      backgroundColor: `${color}10`,
      borderRadius: "8px",
      border: `1px solid ${color}30`,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <StatusDot color={color} />
      <ColumnTitle title={title} />
      <TaskCount count={count} />
    </Box>
  </Box>
);

export default TaskColumnHeader;