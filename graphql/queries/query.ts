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

  