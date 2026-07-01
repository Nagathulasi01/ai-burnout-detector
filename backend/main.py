from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import predict
from backend.chatbot.chatbot_service import router as chatbot_router

app = FastAPI(title="Burnout AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include modular routers
app.include_router(predict.router)
app.include_router(chatbot_router, prefix="/chatbot")

@app.get("/")
def home():
    return {"message": "Burnout AI Backend is running"}