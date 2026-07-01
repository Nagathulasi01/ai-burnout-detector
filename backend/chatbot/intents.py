import re
import os
from typing import Literal, Optional
from joblib import load

IntentType = Literal[
    "greeting",
    "casual_chat",
    "burnout_question",
    "emotional_support",
    "gratitude",
    "farewell",
]


class IntentClassifier:
    """Detects intent using ordered rules, with optional ML fallback.

    - Rules are expressive regex/keyword checks and are reliable for simple phrases.
    - If a trained model pickle exists at `intent_model.pkl`, the classifier will use
      it as a fallback when rules are ambiguous.
    """

    MODEL_PATH = os.path.join(os.path.dirname(__file__), "intent_model.pkl")

    def __init__(self):
        self.model = None
        if os.path.exists(self.MODEL_PATH):
            try:
                self.model = load(self.MODEL_PATH)
            except Exception:
                self.model = None

    def _rule_based(self, t: str) -> Optional[IntentType]:
        # greeting
        if re.search(r"\b(hi|hello|hey|good morning|good afternoon|good evening)\b", t):
            return "greeting"

        # gratitude
        if re.search(r"\b(thanks|thank you|thx|cheers)\b", t):
            return "gratitude"

        # farewell
        if re.search(r"\b(bye|goodbye|see you|later|take care)\b", t):
            return "farewell"

        # explicit burnout questions
        if "burnout" in t or re.search(r"\bwhy (am i|do i feel|is my)\b", t) and re.search(r"\b(burnout|score|level|worse|tired)\b", t):
            return "burnout_question"

        # emotional support (feeling words)
        if re.search(r"\b(sad|anxious|anxiety|depressed|overwhelmed|stressed|stressful|tired|exhausted|alone|hopeless)\b", t):
            return "emotional_support"

        # short casual conversational patterns that are not support requests
        if re.search(r"\b(how are you|what's up|how's it going|sup)\b", t):
            return "casual_chat"

        # fallback to None (let ML handle if available)
        return None

    def detect_intent(self, text: str) -> IntentType:
        t = text.lower().strip()

        # 1) Rule-based fast path
        r = self._rule_based(t)
        if r is not None:
            return r

        # 2) ML fallback if model available
        if self.model is not None:
            try:
                pred = self.model.predict([text])[0]
                # safe-cast: model should output one of the IntentType labels
                if pred in ("greeting", "casual_chat", "burnout_question", "emotional_support", "gratitude", "farewell"):
                    return pred
            except Exception:
                pass

        # 3) Default
        return "casual_chat"


# Convenience instance for importers
_classifier = IntentClassifier()


def detect_intent(text: str) -> IntentType:
    return _classifier.detect_intent(text)
