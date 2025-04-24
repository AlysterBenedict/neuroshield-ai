
# NeuroShield AI Guardian

A mobile application that performs non-invasive, AI-driven early detection and monitoring of neurological disorders using users' webcam/microphone data.

## Project Structure

- `src/` - Frontend React code
- `backend/` - Express.js backend for API endpoints
- `ml_service/` - Python FastAPI service for ML inference

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- Python 3.8+
- Docker and Docker Compose (optional)

### Development Setup

1. **Clone the repository**

2. **Frontend Setup**

   ```bash
   # Install dependencies
   npm install

   # Create .env file (already created in repo)
   echo "VITE_API_URL=http://localhost:5000" > .env

   # Start the development server
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   # Navigate to backend directory
   cd backend

   # Install dependencies
   npm install

   # Set up environment variables (already created in repo)
   # Edit .env file if needed

   # Initialize Prisma
   npx prisma migrate dev --name init

   # Start the development server
   npm run dev
   ```

4. **ML Service Setup**

   ```bash
   # Navigate to ml_service directory
   cd ml_service

   # Create a virtual environment
   python -m venv venv

   # Activate the virtual environment
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Start the server
   uvicorn main:app --reload
   ```

5. **Using Docker Compose (Optional)**

   ```bash
   # Start all services
   docker-compose up -d

   # Stop all services
   docker-compose down
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Sessions

- `GET /api/sessions` - Get all sessions for the authenticated user
- `POST /api/sessions` - Create a new session

### Upload

- `POST /api/upload` - Upload video and audio for ML processing

## ML Inference Endpoints

- `POST /infer/video` - Process video and extract features
- `POST /infer/audio` - Process audio and extract features
- `POST /infer/fusion` - Combine features and generate risk score

## License

[MIT](LICENSE)
