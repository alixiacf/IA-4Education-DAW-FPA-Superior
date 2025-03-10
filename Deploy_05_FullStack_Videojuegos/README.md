# GameRecommender - Video Games Library and Recommendation System

A full-stack web application for users to register video games they've played and receive personalized recommendations based on their gaming preferences.

## Project Overview

GameRecommender is a microservices-based application that allows users to:

- Create a personal profile and maintain a library of video games they've played
- Filter and search through a catalog of video games by tags (genres)
- Receive personalized game recommendations based on their gaming preferences
- Explore new games similar to ones they've already enjoyed

## Architecture

The application follows a microservices architecture with three main components:

### Frontend
- Built with React, TypeScript, and Vite
- Uses Tailwind CSS for styling
- Implements a responsive, component-based UI
- Communicates with the backend through RESTful API calls

### Backend
- Node.js with Express framework
- RESTful API for user and game management
- Game recommendation engine based on tag similarity
- Database connection management

### Database
- MongoDB for data persistence
- Stores user profiles, game libraries, and game catalog
- Supports complex queries for recommendation features

## Key Features

1. **User Management**
   - Simple user registration without password requirements
   - Personal game library management

2. **Game Catalog**
   - Pre-populated catalog of games with titles, descriptions, images, and tags
   - Game filtering by genre tags

3. **Recommendation System**
   - Personalized recommendations based on user's favorite genres
   - Algorithm that identifies preferred game types

4. **Tag-Based Organization**
   - Color-coded tag system for easy genre identification
   - Multi-tag filtering for precise game discovery

## Deployment Instructions

### Prerequisites
- Docker and Docker Compose installed on your system
- Git for cloning the repository

### Steps to Deploy

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Deploy_05_Fullstack_Videojuegos
   ```

2. Run with Docker Compose:
   ```
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

### Docker Services

The application is containerized using Docker with the following services:

1. **Frontend Container**
   - Builds from the `./frontend` directory
   - Exposed on port 8080
   - Connects to the backend service

2. **Backend Container**
   - Builds from the `./backend` directory
   - Exposed on port 3000
   - Connects to the MongoDB database

3. **Database Container**
   - Uses the official MongoDB image
   - Exposed on port 27017 (default MongoDB port)
   - Persists data using Docker volumes

## API Endpoints

The backend provides the following main API endpoints:

- `/usuarios` - User management (GET, POST, PUT, DELETE)
- `/usuarios/:id/juegos` - User game library management
- `/juegos` - Game catalog access
- `/juegos/buscar` - Game search by tags
- `/recomendaciones/:userId` - Personalized game recommendations
- `/recomendaciones` - General recommendations based on specific tags

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **Network**: Docker Bridge Network for service communication

## Data Persistence

The application uses Docker volumes to persist MongoDB data across container restarts. User profiles and their game libraries will be maintained even if the containers are restarted.