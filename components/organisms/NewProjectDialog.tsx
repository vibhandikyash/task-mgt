import DialogHeader from "../atoms/DialogHeader";
import StyledDialog from "../atoms/StyledDialog";
import AddIcon from "@mui/icons-material/Add";
import { DialogContent, Typography } from "@mui/material";
import { useState } from "react";
import StyledTextField from "../atoms/StyledTextField";
import DialogFooter from "../atoms/DialogFooter";

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; description: string }) => void;
  error?: string ;
}

const NewProjectDialog = ({ open, onClose, onAdd, error }: NewProjectDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = () => {
    if (formData.name && formData.description) {
      onAdd(formData);
      setFormData({ name: '', description: '' });
    }
  };
  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogHeader
        icon={AddIcon}
        title="Create New Project"
        subtitle="Add a new project to your workspace"
      />

    <DialogContent sx={{ p: 3 }}>
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mt: 2, 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1 
            }}
          >
         {error}
          </Typography>
        )}
        <StyledTextField
          autoFocus
          label="Project Name"
          placeholder="Enter project name"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          sx={{ mb: 3 }}
        />

        <StyledTextField
          label="Description"
          placeholder="Enter project description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </DialogContent>

      <DialogFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Create Project"
        isSubmitDisabled={!formData.name || !formData.description}
      />
    </StyledDialog>
  );
};

export default NewProjectDialog; 