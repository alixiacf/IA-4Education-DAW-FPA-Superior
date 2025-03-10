# Task Management Application

A full-stack application for managing tasks with estimated and actual execution times.

## Overview

This application allows users to:
- Create and manage tasks
- Track estimated time for completion
- Record actual time spent on tasks
- Visualize the difference between estimated and real execution times

## Architecture

The application follows a microservices architecture with three main components:

### Frontend
- React application with TypeScript
- Vite as build tool
- Zustand for state management
- TailwindCSS for styling
- Components for task management (TaskList, TaskCard, NewTaskModal)

### Backend
- Node.js with Express framework
- REST API for CRUD operations on tasks
- MongoDB connection for data persistence
- API endpoints for task management

### Database
- MongoDB for storing task data
- Persistent volume for data storage

## Deployment

The application is containerized using Docker and can be deployed using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed on your system
- Git (for cloning the repository)

### Deployment Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Deploy_06_FullStack_agenda
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

### Stopping the Application

To stop the application:
```bash
docker-compose down
```

To stop and remove volumes (will delete all data):
```bash
docker-compose down -v
```

## Development

For development purposes, the docker-compose configuration mounts the local directories as volumes, allowing for live-reload during development.

## Environment Variables

- Frontend:
  - `VITE_API_URL`: URL to connect to the backend API

- Backend:
  - `MONGO_URI`: MongoDB connection string

## Services Communication

The frontend communicates with the backend through REST API calls, while the backend interacts with the MongoDB database for data persistence.