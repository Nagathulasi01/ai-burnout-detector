from collections import deque, defaultdict
from typing import Deque, Dict, List

CONCERN_KEYWORDS = {
    "poor sleep": ["sleep", "insomnia", "tired", "didn't sleep", "haven't slept"],
    "stress": ["stress", "stressed", "stressing"],
    "deadline_pressure": ["deadline", "due", "due date", "pressure"],
    "exhaustion": ["exhaust", "exhausted", "drained"],
    "anxiety": ["anxiety", "anxious", "panic"],
}


class MemoryManager:
    """Simple in-memory short-term session memory.

    - Keeps the last N user messages per session.
    - Tracks flagged recent concerns by keyword matching.
    """

    def __init__(self, max_history: int = 20):
        self.max_history = max_history
        self.histories: Dict[str, Deque[str]] = defaultdict(lambda: deque(maxlen=self.max_history))
        self.concerns: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))

    def add_user_message(self, session_id: str, message: str) -> None:
        message_lc = message.lower()
        self.histories[session_id].append(message)

        # detect concerns and increment counts
        for concern, keywords in CONCERN_KEYWORDS.items():
            for kw in keywords:
                if kw in message_lc:
                    self.concerns[session_id][concern] += 1
                    break

    def get_recent_messages(self, session_id: str) -> List[str]:
        return list(self.histories.get(session_id, []))

    def get_concerns(self, session_id: str) -> List[str]:
        counts = self.concerns.get(session_id, {})
        # return concerns sorted by frequency
        return [c for c, _ in sorted(counts.items(), key=lambda kv: -kv[1])]

    def clear_session(self, session_id: str) -> None:
        if session_id in self.histories:
            del self.histories[session_id]
        if session_id in self.concerns:
            del self.concerns[session_id]
