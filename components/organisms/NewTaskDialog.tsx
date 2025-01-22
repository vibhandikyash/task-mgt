"use client";

import { DialogContent, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { TaskStatus } from "./TaskComponent";
import StyledDialog from "../atoms/StyledDialog";
import DialogHeader from "../atoms/DialogHeader";
import DialogFooter from "../atoms/DialogFooter";
import StyledTextField from "../atoms/StyledTextField";
import StyledSelect from "../atoms/StyledSelect";
import type { User } from "@/types";

interface NewTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    description: string;
    assignedTo?: string;
    status: TaskStatus;
  }) => void;
  error?: string;
  users: User[];
}

const NewTaskDialog = ({ 
  open, 
  onClose, 
  onAdd, 
  error,
  users 
}: NewTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = () => {
    if (title && description) {
      onAdd({
        title,
        description,
        ...(assignedTo ? { assignedTo } : {}),
        status: "PENDING", // Always pending for new tasks
      });
      // Reset form
      setTitle("");
      setDescription("");
      setAssignedTo("");
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogHeader
        icon={AssignmentIcon}
        title="Create New Task"
        subtitle="Add a new task to your project"
      />

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 2, 
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
          label="Task Title"
          placeholder="Enter task title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <StyledTextField
          label="Description"
          placeholder="Enter task description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <StyledSelect
          label="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value as string)}
          formControlProps={{ sx: { mb: 3 } }}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </StyledSelect>
      </DialogContent>

      <DialogFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Create Task"
        isSubmitDisabled={!title || !description}
      />
    </StyledDialog>
  );
};

export default NewTaskDialog;
