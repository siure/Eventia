# Eventia

Eventia is a full-stack event management platform that allows users to create, browse, and register for events. Organizers can manage their events and track registrations, while participants can discover upcoming events and manage their registrations.

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory with the following variables:

```env
ATLAS_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend

Create a `.env` file in the `frontend/` directory with the following variable:

```env
VITE_API_URL=http://localhost:5000
```

Replace `http://localhost:5000` with your backend API URL.

## Getting Started

1. Install backend dependencies:
   ```bash
   cd backend 
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

4. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

