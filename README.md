# Project Management Application
 
A full-featured project management application built with Next.js, GraphQL, and Material-UI. Manage projects, tasks, and team collaboration efficiently with a modern, responsive interface.
 
## Features
 
- 🔐 **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Protected routes
 
- 📊 **Project Management**
  - Create and manage multiple projects
  - Track project progress
  - Assign team members
 
- ✅ **Task Management**
  - Create, update, and delete tasks
  - Task status tracking
  - Task assignments
 
## Tech Stack
 
- **Frontend**:
  - Next.js
  - TypeScript
  - Material-UI
  - Apollo Client

 
- **Backend**:
  - GraphQL API
  - Apollo Server
  - Prisma ORM
  - Node.js
- **Database**:
     - MySQL
 
## Getting Started
 
### Prerequisites
 
- Node.js (v16.14 or higher)
- npm (v8 or higher)
 
### Setup Instructions
 
1. Install dependencies:
```bash
npm install
```
 
2. Generate Prisma client:
```bash
npx prisma generate
```
 
3. Start the development server:
```bash
npm run dev
```
 
The application will be available at `http://localhost:3000`
 
## Database Schema
 
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  role          Role      @default(USER)
  tasks         Task[]
  createdAt     DateTime  @default(now())
}
 
model Project {
  id          String    @id @default(cuid())
  name        String
  description String?
  tasks       Task[]
  createdAt   DateTime  @default(now())
}
 
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      Status    @default(TODO)
  projectId   String
  project     Project   @relation(fields: [projectId], references: [id])
  assignedTo  User?     @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  userId      String?
}
 
enum Role {
  USER
  ADMIN
}
 
```
 
## Project Structure
 
```
project-management/
├── app/                   # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── projects/          # Project pages
├── components/            # React components
│   ├── atoms/             # Basic UI components
│   ├── molecules/         # Composite components
│   └── organisms/         # Complex components
├── graphql/               # GraphQL configuration
└── contexts/              # React contexts
```