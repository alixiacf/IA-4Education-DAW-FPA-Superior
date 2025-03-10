# Pet Vaccination Tracker

A full-stack web application for tracking pet vaccinations and connecting with veterinary clinics.

## Features

- User registration and management
- Pet profile creation and management
- Vaccination record tracking
- Interactive map of veterinary clinics
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker

## Project Structure

```
├── backend/               # Node.js backend API
│   ├── src/               # Source code
│   │   ├── models/        # Database models
│   │   └── routes/        # API routes
│   └── Dockerfile         # Backend Docker configuration
├── frontend/              # React frontend application
│   ├── src/               # Source code
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript type definitions
│   └── Dockerfile         # Frontend Docker configuration
└── docker-compose.yml     # Docker Compose configuration
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git for version control

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Deploy_03_FullStack_Mascotas
   ```

2. Start the application with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Development

To develop the application locally:

1. Start the containers in development mode:
   ```bash
   docker-compose up
   ```

2. Make changes to the code and they will be automatically reflected thanks to the volume mounts configured in the docker-compose.yml file.

## Deployment

The application can be deployed to any environment that supports Docker:

1. Build the production-ready images:
   ```bash
   docker-compose build
   ```

2. Deploy the stack to your hosting provider.

## License

[MIT License](LICENSE)