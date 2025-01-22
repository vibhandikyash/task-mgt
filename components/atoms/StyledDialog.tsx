import { Dialog, DialogProps } from "@mui/material";

interface StyledDialogProps extends DialogProps {
  children: React.ReactNode;
}

const StyledDialog = ({ children, ...props }: StyledDialogProps) => (
  <Dialog
    {...props}
    PaperProps={{
      sx: {
        bgcolor: "#2C2C2C",
        color: "white",
        minWidth: { xs: "90%", sm: 500 },
        maxWidth: "90%",
      },
    }}
  >
    {children}
  </Dialog>
);

export default StyledDialog;
