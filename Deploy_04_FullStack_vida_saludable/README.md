# Healthy Life Dashboard

A full-stack application for tracking fitness activities, diet plans, and health metrics.

## Overview

This application provides a comprehensive dashboard for users to track their fitness journey, including:
- Workout tracking
- Calorie and nutrition monitoring
- Health metrics visualization
- Personalized health advice

## Architecture

The application is built with a microservices architecture consisting of:

1. **Frontend Service**
   - React/TypeScript application with Tailwind CSS
   - Responsive dashboard interface
   - Built with Vite for optimal performance

2. **Backend Service**
   - Node.js RESTful API
   - Handles user data, workout plans, diet information
   - Authentication and data validation

3. **Database Service**
   - MongoDB for persistent data storage
   - Stores user profiles, activity logs, and health metrics

## Deployment

The application is configured for Docker Compose deployment:

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd Deploy_04_FullStack_vida_saludable

# Start the application
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

## Main Features

- **User Registration & Profiles**
- **Workout Planning & Tracking**
- **Diet and Nutrition Monitoring** 
- **Progress Dashboard**
- **Health Insights and Recommendations**

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose