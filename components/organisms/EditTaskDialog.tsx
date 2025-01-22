"use client";

import { DialogContent, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { TaskStatus } from "./TaskComponent";
import StyledDialog from "../atoms/StyledDialog";
import DialogHeader from "../atoms/DialogHeader";
import DialogFooter from "../atoms/DialogFooter";
import StyledTextField from "../atoms/StyledTextField";
import StyledSelect from "../atoms/StyledSelect";
import type { User } from "@/types";

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: {
    id: string;
    title: string;
    description: string;
    assignedTo?: string;
    status: TaskStatus;
    error?: string;
  }) => void;
  task: {
    id: string;
    title: string;
    description: string;
    assignedTo?: string;
    status: TaskStatus;
    error?: string;
  } | null;
  error?: string;
  users: User[];
}

const   EditTaskDialog = ({
  open,
  onClose,
  onSave,
  task,
  error,
  users,
}: EditTaskDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "PENDING" as TaskStatus,
  });

  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assignedTo: task.assignedTo || "",
        status: task.status || "PENDING",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        status: "PENDING",
      });
    }
  }, [task, open]);

  const handleSubmit = () => {
    if (task) {
      onSave({
        id: task.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        assignedTo: formData.assignedTo
      });
    }
  };
  const handleChange = (field: string) => (
    event: SelectChangeEvent<unknown> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogHeader
        icon={EditIcon}
        title="Edit Task"
        subtitle="Update task details"
      />

      <DialogContent sx={{ p: 3 }}>
          {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 2, 
                  mb: 1,
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
          value={formData.title}
          onChange={handleChange("title")}
        />

        <StyledTextField
          label="Description"
          placeholder="Enter task description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange("description")}
        />

        <StyledSelect
          label="Assigned To"
          value={formData.assignedTo}
          onChange={handleChange("assignedTo")}
          formControlProps={{ sx: { mb: 3 } }}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </StyledSelect>

        <StyledSelect
          label="Status"
          value={formData.status}
          onChange={handleChange("status")}
        >
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="INPROGRESS">In Progress</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </StyledSelect>
      </DialogContent>

      <DialogFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isSubmitDisabled={
          !formData.title ||
          !formData.description ||
          !formData.status
        }
      />
    </StyledDialog>
  );
};

export default EditTaskDialog;
