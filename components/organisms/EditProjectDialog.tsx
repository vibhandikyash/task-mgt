import { DialogContent } from "@mui/material";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import StyledDialog from "../atoms/StyledDialog";
import DialogHeader from "../atoms/DialogHeader";
import DialogFooter from "../atoms/DialogFooter";
import StyledTextField from "../atoms/StyledTextField";
import type { Project } from "@/types/project";
import { Typography } from "@mui/material";

interface EditProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: { id: string; name: string; description: string }) => void;
  project: Project | null;
  error?: string;
}

const EditProjectDialog = ({
  open,
  onClose,
  onSave,
  project,
  error,
}: EditProjectDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (project && open) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [project, open]);

  const handleSubmit = () => {
    if (project) {
      onSave({
        id: project.id,
        ...formData,
      });
    }
  };

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogHeader
        icon={EditIcon}
        title="Edit Project"
        subtitle="Update project details"
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
          onChange={handleChange("name")}
          sx={{ mb: 3 }}
        />

        <StyledTextField
          label="Description"
          placeholder="Enter project description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange("description")}
        />
      </DialogContent>

      <DialogFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isSubmitDisabled={!formData.name || !formData.description}
      />
    </StyledDialog>
  );
};

export default EditProjectDialog; 