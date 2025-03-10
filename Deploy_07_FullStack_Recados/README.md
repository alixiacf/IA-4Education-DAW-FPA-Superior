# FullStack Recados Application

A task and appointment management system with notifications, built using a microservices architecture.

## Overview

This application allows users to:
- Register tasks and appointments
- Get notifications for upcoming events
- Manage their personal schedule effectively

## Architecture

The application is built using a microservices approach with two main components:
- **Frontend**: React application with TypeScript and Tailwind CSS
- **Backend**: Node.js API server

## Deployment

The application is containerized using Docker and deployed using Docker Compose, making it easy to set up and run in any environment.

### Prerequisites

- Docker and Docker Compose installed on your system

### Steps to Deploy

1. Clone the repository
2. Navigate to the project directory
3. Run the following command:
   ```
   docker-compose up -d
   ```

This will:
- Build the frontend and backend containers
- Set up the network between services
- Start all services in detached mode

## Microservices Benefits

The microservices architecture provides several advantages:
- **Scalability**: Each service can be scaled independently
- **Maintainability**: Services can be developed and deployed separately
- **Resilience**: Failure in one service doesn't bring down the entire application
- **Technology flexibility**: Different technologies can be used for different services

## Accessing the Application

After deployment, the application can be accessed at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Notification System

The application includes a simple notification system that alerts users of upcoming tasks and appointments.