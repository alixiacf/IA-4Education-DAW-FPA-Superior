
# Shared Trip Cost Calculator App

This web application allows users to create shared trips and calculate costs per person. It's perfect for organizing car journeys with friends, coworkers, or any group that wants to share transportation expenses.

## Features

- Create trips by specifying destination, car model, fuel consumption, distance, and fuel price
- Automatic calculation of total cost and cost per person
- Join existing trips
- Pre-populated car catalog with common models to simplify trip creation
- Standalone calculator to estimate expenses before creating a trip

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## Deployment Instructions

1. Clone this repository
   ```bash
   git clone <repository-url>
   cd Deploy_09_FullStack_Calculo_Gastos_Coche
   ```

2. Make sure you have Docker and Docker Compose installed on your system

3. Start all services using Docker Compose
   ```bash
   docker-compose up -d
   ```

4. The application will be available at:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

5. To stop the application:
   ```bash
   docker-compose down
   ```

## Demo Usage Guide

1. When you first access the app, you'll see a list of available trips (empty on first run)
2. Click "Create Trip" to create a new shared journey
3. Fill in the details:
   - Destination
   - Select a car from the database (type to search)
   - Enter the distance in kilometers
   - Enter the current fuel price
   - Specify how many travelers you need
   - Enter your name as the driver
   - Add any notes about the trip
4. Submit the form to create your trip
5. On the trip details page, you'll see the calculated cost per person
6. Other users can join your trip, which will recalculate the cost per person

## API Endpoints

### Trips
- `GET /viajes` - List all trips
- `GET /viajes/:id` - Get trip details
- `POST /viajes` - Create a new trip
- `PUT /viajes/:id/join` - Join a trip
- `DELETE /viajes/:id` - Delete a trip

### Cars
- `GET /coches` - List all cars
- `GET /coches/buscar` - Search cars by brand or model
- `GET /coches/:id` - Get car details

### Calculator
- `GET /calcular` - Calculate trip costs

## Troubleshooting

If you experience issues with the application:
1. Ensure all containers are running correctly with `docker-compose ps`
2. Check if MongoDB is accessible
3. Verify credentials in configuration files
4. Check Docker logs for possible errors: `docker-compose logs`
5. Make sure ports 8080 and 3000 are not already in use on your system

## Project Structure

- `frontend/` - React frontend application
- `backend/` - Express API server
- `docker-compose.yml` - Docker Compose configuration

## Authors

- [@alixiacf](https://www.github.com/alixiacf)

