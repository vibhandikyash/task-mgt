import { DialogActions, Button } from "@mui/material";

interface DialogFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitDisabled: boolean;
}

const DialogFooter = ({
  onClose,
  onSubmit,
  submitLabel,
  isSubmitDisabled,
}: DialogFooterProps) => (
  <DialogActions
    sx={{
      borderTop: "1px solid rgba(255,255,255,0.1)",
      p: 3,
      gap: 1,
    }}
  >
    <Button
      onClick={onClose}
      variant="outlined"
      sx={{
        color: "white",
        borderColor: "rgba(255,255,255,0.2)",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={onSubmit}
      variant="contained"
      disabled={isSubmitDisabled}
      sx={{
        bgcolor: "#0052CC",
        "&:hover": {
          bgcolor: "#0047B3",
        },
        "&.Mui-disabled": {
          bgcolor: "rgba(0, 82, 204, 0.5)",
        },
      }}
    >
      {submitLabel}
    </Button>
  </DialogActions>
);

export default DialogFooter;
