import { DialogTitle, Box, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface DialogHeaderProps {
  icon: SvgIconComponent;
  title: string;
  subtitle: string;
}

const DialogHeader = ({ icon: Icon, title, subtitle }: DialogHeaderProps) => (
  <DialogTitle
    sx={{
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      p: 3,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Icon sx={{ color: "#0052CC", fontSize: 28 }} />
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
        {subtitle}
      </Typography>
    </Box>
  </DialogTitle>
);

export default DialogHeader;
