# Backend - Burnout AI

Quick notes to run the FastAPI backend locally.

Requirements

- Python 3.9+ (3.10 recommended)
- Create a virtual environment and install dependencies listed in `requirements.txt`.

Install and run

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate
pip install -r requirements.txt

# Start the server (development)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Chatbot endpoints

- POST `/chatbot/message` — body: `{ "session_id": "user123", "message": "..." }` returns detected `intent`, `reply`, `recent_messages`, and `detected_concerns`.
- GET `/chatbot/memory/{session_id}` — returns recent messages and concerns for that session.

Intent model (optional)

You can improve detection by training the optional ML fallback model. From `backend/chatbot` run:

```bash
python train_intent_model.py
# This writes intent_model.pkl in the same folder. The classifier will auto-load it.
```

Notes

- The chatbot uses a simple in-memory session `MemoryManager` for short-term context — this is not persistent across server restarts.
- For production use, replace the memory manager with a persistent store (Redis, DB) and secure session identifiers.
