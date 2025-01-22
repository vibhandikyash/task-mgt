import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface CustomIconButtonProps extends ButtonProps {
  startIcon?: React.ReactNode;
}

const IconButton = styled(Button)<CustomIconButtonProps>(({ theme }) => ({
  color: "white",
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: "8px",
  padding: theme.spacing(0.75, 2),
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: "translateY(-1px)",
    transition: "all 0.2s",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

export default IconButton;
