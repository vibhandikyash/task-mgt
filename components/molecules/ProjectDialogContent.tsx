import { DialogContent } from "@mui/material";
import { useState } from "react";
import StyledTextField from "../atoms/StyledTextField";
import DialogFooter from "../atoms/DialogFooter";

interface ProjectDialogContentProps {
  onSubmit: (data: { name: string }) => void;
}

const ProjectDialogContent = ({ onSubmit }: ProjectDialogContentProps) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({ name: name.trim() });
      setName("");
    }
  };

  return (
    <>
      <DialogContent sx={{ p: 3 }}>
        <StyledTextField
          autoFocus
          label="Project Name"
          placeholder="Enter project name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>

      <DialogFooter
        onSubmit={handleSubmit}
        submitLabel="Create Project"
        isSubmitDisabled={!name.trim()}
        onClose={() => setName("")}
      />
    </>
  );
};

export default ProjectDialogContent; 