
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

# Application Configuration
SECRET_KEY = os.environ.get("JWT_SECRET", "neuroshield_jwt_secret_change_me_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
MONGODB_URL = os.environ.get("DATABASE_URL", "mongodb://localhost:27017")
DATABASE_NAME = "neuroshield"

# Create FastAPI app
app = FastAPI(
    title="NeuroShield AI API",
    description="API for NeuroShield AI telehealth platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing utility
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# Database connection
client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    global client
    if client:
        client.close()

# --- Models ---

class UserBase(BaseModel):
    email: EmailStr
    role: str = "patient"

class UserCreate(UserBase):
    password: str
    name: str

class User(UserBase):
    id: str
    name: str
    created_at: datetime

    class Config:
        orm_mode = True

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class AssessmentCreate(BaseModel):
    patient_notes: Optional[str] = None
    symptoms: List[str] = []

class Assessment(AssessmentCreate):
    id: str
    user_id: str
    created_at: datetime
    video_id: Optional[str] = None
    audio_id: Optional[str] = None
    risk_score: Optional[float] = None
    status: str = "pending"

    class Config:
        orm_mode = True

class VisionAnalysisResult(BaseModel):
    tremor_score: float
    facial_asymmetry: float
    blink_rate: float
    expression_variability: float
    additional_metrics: Dict[str, Any] = {}

class AudioAnalysisResult(BaseModel):
    jitter: float
    shimmer: float
    pitch_variability: float
    articulation_rate: float
    additional_metrics: Dict[str, Any] = {}

class FusionRequest(BaseModel):
    video_id: Optional[str] = None
    audio_id: Optional[str] = None
    vision_results: Optional[VisionAnalysisResult] = None
    audio_results: Optional[AudioAnalysisResult] = None

class FusionResponse(BaseModel):
    risk_score: float
    confidence: float
    risk_factors: Dict[str, float]
    recommendations: List[str]

# --- Security utilities ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(email: str):
    user = await db["users"].find_one({"email": email})
    if user:
        return UserInDB(**user)

async def authenticate_user(email: str, password: str):
    user = await get_user(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    user = await db["users"].find_one({"id": token_data.user_id})
    if user is None:
        raise credentials_exception
    return User(**user)

# --- Routes ---

@app.get("/")
async def root():
    return {"status": "healthy", "service": "NeuroShield AI API", "version": "0.1.0"}

# Auth Routes
@app.post("/api/v1/auth/register", response_model=User)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    user_data = {
        "id": user_id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    await db["users"].insert_one(user_data)
    
    return {
        "id": user_id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "created_at": user_data["created_at"]
    }

@app.post("/api/v1/auth/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# ML Inference Routes
@app.post("/api/v1/vision/analyze", response_model=VisionAnalysisResult)
async def analyze_vision(current_user: User = Depends(get_current_user)):
    # In a real implementation, this would process an uploaded video file
    # For this example, we'll return mock data
    return {
        "tremor_score": 0.15,
        "facial_asymmetry": 0.08,
        "blink_rate": 12.5,
        "expression_variability": 0.72,
        "additional_metrics": {
            "eye_tracking_stability": 0.89,
            "micro_expression_count": 7
        }
    }

@app.post("/api/v1/audio/analyze", response_model=AudioAnalysisResult)
async def analyze_audio(current_user: User = Depends(get_current_user)):
    # In a real implementation, this would process an uploaded audio file
    # For this example, we'll return mock data
    return {
        "jitter": 0.018,
        "shimmer": 0.045,
        "pitch_variability": 0.32,
        "articulation_rate": 4.5,
        "additional_metrics": {
            "pause_count": 12,
            "speech_rate_consistency": 0.78
        }
    }

@app.post("/api/v1/fusion/evaluate", response_model=FusionResponse)
async def evaluate_fusion(
    fusion_request: FusionRequest,
    current_user: User = Depends(get_current_user)
):
    # In a real implementation, this would integrate results from vision and audio
    # and apply a fusion model to produce a comprehensive assessment
    return {
        "risk_score": 0.27,
        "confidence": 0.85,
        "risk_factors": {
            "tremor": 0.15,
            "speech_impairment": 0.18,
            "facial_asymmetry": 0.08,
            "cognitive_delay": 0.12
        },
        "recommendations": [
            "Consider follow-up with neurologist",
            "Schedule reassessment in 30 days",
            "Monitor tremor progression"
        ]
    }

# Assessment Routes
@app.post("/api/v1/assessments", response_model=Assessment)
async def create_assessment(
    assessment: AssessmentCreate,
    current_user: User = Depends(get_current_user)
):
    assessment_id = str(uuid.uuid4())
    assessment_data = {
        "id": assessment_id,
        "user_id": current_user.id,
        "created_at": datetime.utcnow(),
        "patient_notes": assessment.patient_notes,
        "symptoms": assessment.symptoms,
        "status": "pending",
    }
    
    await db["assessments"].insert_one(assessment_data)
    return Assessment(**assessment_data)

@app.get("/api/v1/assessments", response_model=List[Assessment])
async def get_assessments(current_user: User = Depends(get_current_user)):
    assessments = []
    cursor = db["assessments"].find({"user_id": current_user.id}).sort("created_at", -1)
    async for doc in cursor:
        assessments.append(Assessment(**doc))
    return assessments

# This runs the FastAPI application with Uvicorn when running this file directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
