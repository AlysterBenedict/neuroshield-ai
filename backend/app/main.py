from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, analysis, chatbot

app = FastAPI(title="NeuroGuard Backend")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth")
app.include_router(analysis.router, prefix="/api/analysis")
app.include_router(chatbot.router, prefix="/api/chatbot")

@app.get("/")
def home():
    return {"status": "NeuroGuard Backend Running"}