from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from app.utils.ai_integration import chatbot_response
from app.models.schemas import ChatQuery

router = APIRouter()
security = HTTPBearer()

@router.post("/ask")
async def ask_chatbot(query: ChatQuery):
    try:
        response = chatbot_response(query.text)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))