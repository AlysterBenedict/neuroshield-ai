from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from firebase_admin import auth
from app.firebase.config import db
from app.models.schemas import UserCreate, UserLogin

router = APIRouter()
security = HTTPBearer()

@router.post("/register")
async def register(user: UserCreate):
    try:
        # Create user in Firebase Auth
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        # Save additional user data in Firestore
        user_data = {
            "name": user.name,
            "role": "patient"  # or "neurologist"
        }
        db.collection("users").document(user_record.uid).set(user_data)
        return {"uid": user_record.uid, "email": user.email}
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")

@router.post("/login")
async def login(user: UserLogin):
    # Use Firebase SDK on frontend for actual login flow (token generation)
    # This is a simplified version
    try:
        user = auth.get_user_by_email(user.email)
        return {"uid": user.uid, "email": user.email}
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")