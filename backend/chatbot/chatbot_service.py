from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

from .memory import MemoryManager
from .intents import detect_intent
from .responses import generate_response

router = APIRouter()

# Single shared in-memory manager (simple short-term sessions)
memory = MemoryManager(max_history=30)


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    intent: str
    reply: str
    recent_messages: Optional[List[str]] = None
    detected_concerns: Optional[List[str]] = None


@router.post("/message", response_model=ChatResponse)
def handle_message(req: ChatRequest):
    if not req.session_id or not req.message:
        raise HTTPException(status_code=400, detail="session_id and message are required")

    # 1. detect intent
    intent = detect_intent(req.message)

    # 2. store message in memory (affects subsequent responses)
    memory.add_user_message(req.session_id, req.message)

    # 3. generate response (uses updated memory)
    reply = generate_response(req.session_id, req.message, intent, memory)

    return ChatResponse(
        session_id=req.session_id,
        intent=intent,
        reply=reply,
        recent_messages=memory.get_recent_messages(req.session_id),
        detected_concerns=memory.get_concerns(req.session_id),
    )


@router.get("/memory/{session_id}")
def get_memory(session_id: str):
    return {
        "recent_messages": memory.get_recent_messages(session_id),
        "detected_concerns": memory.get_concerns(session_id),
    }
