import { Box } from "@mui/material";

interface StatusDotProps {
  color: string;
}

const StatusDot = ({ color }: StatusDotProps) => (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: color,
    }}
  />
);

export default StatusDot;
