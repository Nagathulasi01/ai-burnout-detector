from typing import List
from .memory import MemoryManager


def _join_concerns(concerns: List[str]) -> str:
    if not concerns:
        return ""
    mapping = {
        "poor sleep": "sleep issues",
        "stress": "high stress",
        "deadline_pressure": "deadline pressure",
        "exhaustion": "exhaustion",
        "anxiety": "anxiety",
    }
    human = [mapping.get(c, c) for c in concerns]
    if len(human) == 1:
        return human[0]
    return ", ".join(human[:-1]) + " and " + human[-1]


def generate_response(session_id: str, user_text: str, intent: str, memory: MemoryManager) -> str:
    """Create context-aware, supportive, human-like responses.

    - Uses recent concerns from memory but avoids over-diagnosing casual chat.
    - Keeps language short and empathic.
    """
    recent = memory.get_recent_messages(session_id)
    concerns = memory.get_concerns(session_id)

    # Friendly helper fragments
    if intent == "greeting":
        return "Hey — nice to hear from you. How can I support you today?"

    if intent == "gratitude":
        return "You're welcome — I'm here whenever you need to talk."

    if intent == "farewell":
        return "Take care — remember small breaks can help. I'm here when you need me."

    if intent == "casual_chat":
        # Keep it light and avoid burnout analysis
        return "I hear you — tell me more if you'd like, or I can help with coping tips."

    # Emotional support: validate feelings, offer brief guidance
    if intent == "emotional_support":
        if concerns:
            c = _join_concerns(concerns)
            return f"I'm sorry you're feeling this way. Your recent {c} might be playing a role — would you like a few quick grounding tips or some steps to help manage it?"
        # no detected concerns yet
        return "That sounds really tough. I'm here for you — want some quick calming exercises or to talk through what's happening?"

    # Burnout question: provide contextual, careful reply
    if intent == "burnout_question":
        if concerns:
            c = _join_concerns(concerns)
            return (
                f"It looks like you've mentioned {c} recently. Those factors commonly contribute to feeling burned out. "
                "If you'd like, I can suggest small steps to address them or explain how they influence burnout scores."
            )
        # fallback when no concerns recorded
        if recent:
            return (
                "From what you've said recently, there are a few patterns that can affect burnout — sleep, stress, and workload. "
                "If you share a bit more about your recent routine, I can give more tailored suggestions."
            )
        return "Burnout can come from several sources like sleep, stress, and workload. Tell me about your recent days and I can help explain further."

    # Default fallback
    return "I hear you — tell me a bit more and I'll do my best to help."
