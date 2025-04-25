
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
try:
    # Check if running in production or development
    if os.environ.get('FIREBASE_CREDENTIALS'):
        # In production, use environment variable
        cred = credentials.Certificate(json.loads(os.environ.get('FIREBASE_CREDENTIALS')))
    else:
        # In development, look for service account file
        cred = credentials.Certificate('firebase-credentials.json')
    
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Firebase initialization error: {e}")
    # Create a dummy credential for development if needed
    firebase_admin.initialize_app()

app = FastAPI(title="NeuroShield AI API", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    # Add your production frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database client
db = firestore.client()

# Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

# Auth dependency
async def get_current_user(authorization: Optional[str] = None):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.replace("Bearer ", "")
    
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get('uid')
        user_doc = db.collection('users').document(uid).get()
        
        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        user_data = user_doc.to_dict()
        user_data['uid'] = uid
        return user_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "message": "NeuroShield AI API is running"}

# Auth routes
@app.post("/api/v1/auth/signup")
async def signup(user: UserCreate):
    try:
        # Create user in Firebase Auth
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name
        )
        
        # Store additional user data in Firestore
        db.collection('users').document(user_record.uid).set({
            'name': user.name,
            'email': user.email,
            'role': 'patient',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
        
        # Create custom token
        token = auth.create_custom_token(user_record.uid)
        
        return {
            "message": "User successfully created",
            "uid": user_record.uid,
            "token": token.decode("utf-8")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating user: {str(e)}"
        )

@app.post("/api/v1/auth/login")
async def login(user: UserLogin):
    try:
        # This would typically use Firebase Auth REST API
        # For simplicity, using admin SDK to find user
        user_record = auth.get_user_by_email(user.email)
        
        # Note: In a real app, you'd validate the password through Firebase Auth REST API
        # Here we just return a custom token as a simplified example
        token = auth.create_custom_token(user_record.uid)
        
        return {
            "message": "Login successful",
            "uid": user_record.uid,
            "token": token.decode("utf-8")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid credentials: {str(e)}"
        )

@app.get("/api/v1/auth/me")
async def get_user(user = Depends(get_current_user)):
    return {
        "uid": user.get("uid"),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role")
    }

# Contact route
@app.post("/api/v1/contact")
async def submit_contact(form: ContactForm):
    try:
        # Save contact form to Firestore
        contact_ref = db.collection('contacts').document()
        contact_ref.set({
            'name': form.name,
            'email': form.email,
            'message': form.message,
            'createdAt': firestore.SERVER_TIMESTAMP
        })
        
        # Here you would typically send an email notification
        # Using a service like SendGrid or Firebase Cloud Functions
        
        return {
            "message": "Contact form submitted successfully",
            "id": contact_ref.id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting contact form: {str(e)}"
        )

# Assessment routes - simplified placeholders
@app.get("/api/v1/assessments")
async def get_assessments(user = Depends(get_current_user)):
    try:
        assessments = []
        assessment_refs = db.collection('assessments').where('userId', '==', user.get('uid')).stream()
        
        for doc in assessment_refs:
            assessment = doc.to_dict()
            assessment['id'] = doc.id
            assessments.append(assessment)
            
        return assessments
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching assessments: {str(e)}"
        )

@app.post("/api/v1/assessments")
async def create_assessment(user = Depends(get_current_user)):
    try:
        # Create mock assessment for demonstration
        assessment_ref = db.collection('assessments').document()
        assessment_ref.set({
            'userId': user.get('uid'),
            'status': 'completed',
            'recordedAt': firestore.SERVER_TIMESTAMP,
            'riskScore': 0.15, # Mock score
            'results': {
                'visual': {
                    'tremor': 0.12,
                    'expression': 0.18
                },
                'audio': {
                    'pattern': 0.15,
                    'cadence': 0.14
                }
            }
        })
        
        return {
            "message": "Assessment created successfully",
            "id": assessment_ref.id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating assessment: {str(e)}"
        )

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
