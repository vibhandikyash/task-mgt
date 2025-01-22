"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { TaskStatus } from "../organisms/TaskComponent";
import NewTaskDialog from "../organisms/NewTaskDialog";
import EditTaskDialog from "../organisms/EditTaskDialog";
import NewProjectDialog from "../organisms/NewProjectDialog";
import ProjectsSidebar from "../organisms/ProjectsSidebar";
import TasksSection from "./TasksSection";
import { useRouter, useParams } from "next/navigation";
import { getAllProjects, createNewProject, createNewTask, deleteExistingTask, updateExistingTask, getTasksByProject, getAllUsers } from "@/lib/api";
import client from "@/graphql/apollo-client";
import { Task } from "@/types/task";
import { Project } from "@/types/project";
import ConfirmDialog from "../molecules/ConfirmDialog";
import { useProjectContext } from '@/contexts/ProjectContext';
import { 
  CreateTaskInput, 
  ProjectTask,
} from '@/types';
import type { User } from "@/types";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const currentProjectId = params?.id as string;
  
  const { 
    projects, 
    setProjects, 
    setSelectedProjectId,
    updateProjectTasks
  } = useProjectContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Memoize selected project
  const selectedProject = useMemo(() => 
    projects.find((p) => p.id === currentProjectId),
    [projects, currentProjectId]
  );

  // Memoize grouped tasks
  const groupedTasks = useMemo(() => ({
    pending: tasks?.filter((task) => task.status === "PENDING") || [],
    in_progress: tasks?.filter((task) => task.status === "INPROGRESS") || [],
    completed: tasks?.filter((task) => task.status === "COMPLETED") || [],
  }), [tasks]);

  // Update project selection
  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProjectId(project.id);
    router.push(`/projects/${project.id}`, { scroll: false });
  }, [router, setSelectedProjectId]);

  // Fetch projects only if not already loaded
  useEffect(() => {
    if (projects.length === 0) {
      const fetchProjects = async () => {
        try {
          setIsLoading(true);
          const data = await getAllProjects(client);
          setProjects(data as Project[]);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjects();
    }
  }, [projects.length, setProjects]); // Empty dependency array

  // Fetch tasks when project ID changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProjectId) return;
      
      try {
        setIsLoading(true);
        const projectTasks = await getTasksByProject(client, currentProjectId);
        setTasks(projectTasks);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [currentProjectId]);

  // Update selected project ID when URL changes
  useEffect(() => {
    if (currentProjectId) {
      setSelectedProjectId(currentProjectId);
    }
  }, [currentProjectId, setSelectedProjectId]);

  // Add useEffect to fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers(client);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [client]);

  const handleAddTask = useCallback(async (newTask: { 
    title: string; 
    description: string;
    assignedTo?: string;
    status: TaskStatus;
  }) => {
    if (!selectedProject) return;

    try {
      const taskInput: CreateTaskInput = {
        title: newTask.title,
        description: newTask.description || '',
        status: "PENDING",
        projectId: selectedProject.id,
        ...(newTask.assignedTo ? { assignedTo: newTask.assignedTo } : {})
      };

      const createdTask = await createNewTask(client, taskInput);
      setTasks(prevTasks => [...prevTasks, createdTask]);
      
      // Use context method for updating project tasks
      const updatedTasks: ProjectTask[] = [
        ...(selectedProject.tasks || []),
        {
          id: createdTask.id,
          title: createdTask.title,
          description: createdTask.description,
          status: createdTask.status,
          assignedTo: createdTask.assignedTo || '',
          projectId: selectedProject.id
        }
      ];
      
      updateProjectTasks(selectedProject.id, updatedTasks);
      setIsNewTaskDialogOpen(false);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to create task'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, updateProjectTasks]);

  // Update handleEditTask to handle user assignments
  const handleEditTask = useCallback(async (task: {
    id: string;
    title: string;
    description: string;
    assignedTo?: string;
    status: TaskStatus;
  }) => {
    if (!selectedProject) return;

    try {
      const updateInput = {
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.assignedTo
      };

      const updatedTask = await updateExistingTask(
        client,
        task.id,
        updateInput,
        selectedProject.id
      );
      
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
      
      setEditTask(null);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to update task'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!selectedProject) return;

    try {
      await deleteExistingTask(client, taskId, selectedProject.id);
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === selectedProject.id 
            ? { 
                ...project, 
                tasks: (project.tasks || []).filter(t => t.id !== taskId)
              }
            : project
        )
      );

      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to delete task'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, setProjects]);

  const handleAddProject = useCallback(async ({ name, description }: { name: string; description?: string }) => {
    try {
      const newProject = await createNewProject(client, { name, description });
      setIsNewProjectDialogOpen(false);
      setProjects((prevProjects) => [...prevProjects, newProject as Project]);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to create project'));
    } finally {
      setIsLoading(false);
    }
  }, [setProjects]);

  const handleTaskStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
    });
  };

  const statusHeaders = {
    pending: { title: "PENDING", color: "#FF991F" },
    in_progress: { title: "INPROGRESS", color: "#0052CC" },
    completed: { title: "COMPLETED", color: "#36B37E" },
  };

  const handleDeleteConfirm = async () => {
    if (deleteTaskId) {
      await handleDeleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#1E1F21",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <ProjectsSidebar
        projects={projects}
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        onAddProject={() => setIsNewProjectDialogOpen(true)}
      />

      <TasksSection
        selectedProject={selectedProject}
        groupedTasks={groupedTasks}
        statusHeaders={statusHeaders}
        onAddTask={() => setIsNewTaskDialogOpen(true)}
        onEditTask={setEditTask}
        onDeleteTask={(taskId) => setDeleteTaskId(taskId)}
        loading={isLoading}
        onStatusChange={handleTaskStatusUpdate}
        users={users}
      />

      <NewTaskDialog
        open={isNewTaskDialogOpen}
        onClose={() => {
          setIsNewTaskDialogOpen(false);
          setError(null);
        }}
        onAdd={handleAddTask}
        error={error?.message}
        users={users}
      />

      <EditTaskDialog
        open={!!editTask}
        onClose={() => {
          setEditTask(null);
          setError(null);
        }}
        onSave={handleEditTask}
        task={editTask}
        error={error?.message}
        users={users}
      />

      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => {
          setIsNewProjectDialogOpen(false);
          setError(null);
        }}
        onAdd={handleAddProject}
        error={error?.message}
      />

      <ConfirmDialog
        open={!!deleteTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTaskId(null)}
      />
    </Box>
  );
}
