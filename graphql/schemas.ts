import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    tasks: [Task!]
  }

  type Project {
    id: ID!
    name: String!
    description: String
    createdAt: DateTime!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    createdAt: DateTime!
    project: Project!
    assignedTo: User
  }

  enum TaskStatus {
    PENDING
    INPROGRESS
    COMPLETED
  }

  type Query {
    projects: [Project!]!
    project(id: ID!): Project
    tasks: [Task!]!
    task(id: ID!): Task
    tasksByProject(projectId: ID!): [Task!]!
    users: [User!]!
    user(id: ID!): User
  }

  input CreateProjectInput {
    name: String!
    description: String
  }

  input UpdateProjectInput {
    name: String
    description: String
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus!
    projectId: ID!
    userId: ID
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    projectId: ID
    userId: ID
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  input AssignTaskInput {
    taskId: ID!
    userId: ID!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum Role {
    ADMIN
    USER
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    role: Role!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Project!
    
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Task!
    
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    
    assignTaskToUser(input: AssignTaskInput!): Task!
    
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
  }
`;