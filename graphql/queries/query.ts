import { gql } from "@apollo/client";

export const getProjects = gql`
  query GetProjects {
    projects {
      id
      name
      description
      tasks {
        id
        title
        status
      }
    }
  }
`;

export const createProject = gql`mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    description
    createdAt
    tasks {
      id
      title
    }
    }
  }
`;

export const updateProject = gql`mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    name
    description
    createdAt
    tasks {
      id
      title
      status
    }
    }
  }
`;

export const deleteProject = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export const createTask = gql`mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    description
    status
    project {
      id
      name
      description
      createdAt
    }
    assignedTo {
      id
      name
      email
    }
    createdAt
  }
}
`;

export const getTasks = gql`query GetTasks {
  tasks {
    id
    title
    description
    status
    project {
      id
      name
      description
      createdAt
    }
    assignedTo {
      id
      name
      }
      createdAt
    }
  }
`;

export const getTaskByProject = gql`query GetTasksByProject($projectId: ID!) {
  tasksByProject(projectId: $projectId) {
    id
    title
    description
    status
    createdAt
    project {
      id
      name
      description
    }
    assignedTo {
      id
      name
      email
    }
  }
}
`;

export const updateTask = gql`mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
  updateTask(id: $id, input: $input) {
    id
    title
    description
    status
    createdAt
    project {
      id
      name
      description
      createdAt
    }
    assignedTo {
      id
      name
      email
    }
  }
}
`;

export const deleteTask = gql`mutation DeleteTask($id: ID!) {
  deleteTask(id: $id) {
    id
    title
    description
    status
    assignedTo {
      id
      name      
    }
    project {
      id
      name
    }
    createdAt
  }
}
`;

export const createUser = gql`mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}`;

export const getUsers = gql`query GetUsers {
  users {
    id
    name
    email
    tasks {
      id
      title
      description
      status  
      createdAt
    }
  }
}`;

export const signUp = gql`
mutation SignUp($input: SignUpInput!) {
  signUp(input: $input)  {
    token
    user {
      id
      name
      email
      role
    }
  }
}`;

export const signIn = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const onProjectCreated = gql`
  subscription OnProjectCreated {
    projectCreated {
      id
      name
      description
      createdAt
      tasks {
        id
        title
        status
      }
    }
  }
`;

export const onProjectUpdated = gql`
  subscription OnProjectUpdated {
    projectUpdated {
      id
      name
      description
      createdAt
      tasks {
        id
        title
        status
      }
    }
  }
`;

export const onProjectDeleted = gql`
  subscription OnProjectDeleted {
    projectDeleted {
      id
      name
      description
    }
  }
`;

// Task Subscriptions
export const onTaskCreated = gql`
  subscription OnTaskCreated {
    taskCreated {
      id
      title
      description
      status
      createdAt
      project {
        id
        name
        description
      }
      assignedTo {
        id
        name
        email
      }
    }
  }
`;

export const onTaskUpdated = gql`
  subscription OnTaskUpdated {
    taskUpdated {
      id
      title
      description
      status
      createdAt
      project {
        id
        name
        description
      }
      assignedTo {
        id
        name
        email
      }
    }
  }
`;

export const onTaskDeleted = gql`
  subscription OnTaskDeleted {
    taskDeleted {
      id
      title
      status
      project {
        id
        name
      }
      assignedTo {
        id
        name
      }
    }
  }
`;

export const onTaskAssigned = gql`
  subscription OnTaskAssigned {
    taskAssigned {
      id
      title
      status
      project {
        id
        name
      }
      assignedTo {
        id
        name
        email
      }
    }
  }
`;

// User Subscriptions
export const onUserCreated = gql`
  subscription OnUserCreated {
    userCreated {
      id
      name
      email
      tasks {
        id
        title
        status
      }
    }
  }
`;
