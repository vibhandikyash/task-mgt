import { Typography } from "@mui/material";

interface TaskCountProps {
  count: number;
}

const TaskCount = ({ count }: TaskCountProps) => (
  <Typography
    sx={{
      ml: "auto",
      color: "rgba(255,255,255,0.5)",
      fontSize: "0.875rem",
    }}
  >
    {count}
  </Typography>
);

export default TaskCount;
