import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ProjectHeaderProps {
  name?: string;
  taskCount?: number;
  onAddTask: () => void;
}

const ProjectHeader = ({ name, taskCount, onAddTask }: ProjectHeaderProps) => (
  <Box
    sx={{
      mb: 4,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "70px",
    }}
  >
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: "white",
          fontWeight: 600,
          mb: 1,
          "@media (max-width: 768px)": {
            fontSize: "18px",
          }
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: "rgba(255,255,255,0.7)",
          fontWeight: 400,
        }}
      >
        {taskCount} Tasks
      </Typography>
    </Box>

    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onAddTask}
      sx={{
        bgcolor: "#0052CC",
        "&:hover": {
          bgcolor: "#0047B3",
        },
        "@media (max-width: 768px)": {
          padding: "6px 12px",
          fontSize: "12px",
          "& .MuiSvgIcon-root": {
            fontSize: "18px",
          },
        },
        "@media (max-width: 425px)": {
          minWidth: 0,
          padding: "8px",
          "& .MuiButton-startIcon": {
            margin: 0,
          },
          "& .MuiButton-startIcon + .MuiButton-endIcon": {
            display: "none",
          },
        }
      }}
    >
      <Box sx={{ "@media (max-width: 425px)": { display: "none" } }}>
        Add New Task
      </Box>
    </Button>
  </Box>
);

export default ProjectHeader;
