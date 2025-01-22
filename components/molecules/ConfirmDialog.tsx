import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) => (
  <Dialog 
    open={open} 
    onClose={onCancel}
    PaperProps={{
      sx: {
        bgcolor: '#2D2D2D',
        color: 'white',
        minWidth: '300px'
      }
    }}
  >
    <DialogTitle sx={{ color: 'white' }}>{title}</DialogTitle>
    <DialogContent>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{message}</Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button 
        onClick={onCancel}
        sx={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          '&:hover': { color: 'white' }
        }}
      >
        Cancel
      </Button>
      <Button 
        onClick={onConfirm}
        variant="contained" 
        color="error"
        autoFocus
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog; 