
# NeuroShield AI Platform

NeuroShield AI is a comprehensive platform for early detection of neurological disorders using advanced AI algorithms to analyze micro-expressions, hand tremors, and voice patterns.

## Project Structure

The project consists of two main parts:

- **Frontend**: React/TypeScript app with Vite and Tailwind CSS
- **Backend**: FastAPI application with Firebase integration

## Prerequisites

- Node.js 16+
- Python 3.9+
- Docker and Docker Compose (optional)
- Firebase account with Firestore database and Authentication enabled

## Setup Instructions

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password sign-in method
3. Create a Firestore database
4. Generate a Firebase Admin SDK service account key
5. Save the key as `firebase-credentials.json` in the `backend` folder

### Frontend Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Firebase config values
```
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

### Backend Setup

1. Create a Python virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and configure your environment variables

4. Start the FastAPI server
```bash
uvicorn app.main:app --reload
```

### Using Docker Compose

To run the entire application stack with Docker Compose:

```bash
docker-compose up
```

## Development

### Frontend Development

The frontend is built with:
- React + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Shadcn UI for components
- React Router for navigation
- Firebase for authentication and database

### Backend Development

The backend API is built with:
- FastAPI framework
- Firebase Admin SDK for auth and database
- Pydantic for data validation
- Uvicorn as ASGI server

## Deployment

### Frontend Deployment

The frontend can be easily deployed to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy

### Backend Deployment

The backend can be deployed to any cloud platform that supports Docker:

1. Build the Docker image:
```bash
docker build -t neuroshield-backend ./backend
```

2. Deploy to your preferred platform (AWS, GCP, Digital Ocean, etc.)

## API Documentation

Once the backend is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is proprietary and confidential.
