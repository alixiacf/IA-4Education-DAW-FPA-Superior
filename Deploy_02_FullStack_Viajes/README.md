# Travel Map Application

A full-stack web application for tracking visited places and creating travel wishlists. Users can mark locations they've visited or wish to visit on an interactive map, share their experiences, and view other travelers' adventures.

## 🌟 Features

- 📍 Mark visited and desired locations on an interactive map
- 👥 Multi-user support with individual profiles
- 🌎 View all users' travel marks in a consolidated view
- ⭐ Rate and review visited places
- 🗺️ Interactive map interface using Leaflet
- 💫 Beautiful and responsive UI with Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- React with TypeScript
- Leaflet for maps
- Tailwind CSS for styling
- Lucide React for icons
- Vite as build tool

### Backend
- Node.js with Express
- MongoDB for data storage
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/travel-map.git
   cd travel-map
   ```

2. Create environment files:

   Create `.env` in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://mongo:27017/travelmap
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## 📁 Project Structure

```
/
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   ├── Dockerfile         # Frontend Docker configuration
│   └── nginx.conf         # Nginx configuration
├── backend/               # Node.js backend application
│   ├── src/              # Source files
│   └── Dockerfile        # Backend Docker configuration
└── docker-compose.yml    # Docker Compose configuration
```

## 🔄 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Places
- `GET /api/places` - Get all places
- `GET /api/places/:userId` - Get places for a specific user
- `POST /api/places` - Create a new place
- `PUT /api/places/:id` - Update a place
- `DELETE /api/places/:id` - Delete a place

## 🛡️ Development

To run the application in development mode:

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🐳 Docker Commands

- Build and start all services:
  ```bash
  docker-compose up --build
  ```

- Stop all services:
  ```bash
  docker-compose down
  ```

- View logs:
  ```bash
  docker-compose logs -f
  ```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ✨ Acknowledgments

- Map data provided by OpenStreetMap
- Icons by Lucide React
- User avatars from Unsplash