from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.security import HTTPBearer
from app.firebase.config import auth, db
from app.utils.ai_integration import analyze_video, analyze_audio
import os
import uuid

router = APIRouter()
security = HTTPBearer()

@router.post("/video")
async def upload_video(file: UploadFile = File(...)):
    # Save video temporarily
    video_id = str(uuid.uuid4())
    video_path = f"temp/{video_id}.mp4"
    with open(video_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Analyze with AI
    result = analyze_video(video_path)
    
    # Cleanup (or move to cloud storage)
    os.remove(video_path)
    
    return result

@router.post("/audio")
async def upload_audio(file: UploadFile = File(...)):
    audio_id = str(uuid.uuid4())
    audio_path = f"temp/{audio_id}.wav"
    with open(audio_path, "wb") as buffer:
        buffer.write(await file.read())
    
    result = analyze_audio(audio_path)
    os.remove(audio_path)
    return result