import StatusDot from "../atoms/StatusDot";

import { Box, Typography } from "@mui/material";
import TaskCount from "../atoms/TaskCount";

interface StatusColumnHeaderProps {
  title: string;
  color: string;
  count: number;
}

const StatusColumnHeader = ({
  title,
  color,
  count,
}: StatusColumnHeaderProps) => (
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
      <Typography
        variant="subtitle1"
        sx={{
          color: "white",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <TaskCount count={count} />
    </Box>
  </Box>
);

export default StatusColumnHeader;
