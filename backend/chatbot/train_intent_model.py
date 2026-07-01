"""Helper to train a small intent classification model.

Run this locally to produce `intent_model.pkl` used as an optional fallback in
`intents.py`.

Requirements: scikit-learn, pandas

Usage:
    python train_intent_model.py
"""
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from joblib import dump

DATA = [
    ("hi", "greeting"),
    ("hello there", "greeting"),
    ("hey", "greeting"),
    ("how are you", "casual_chat"),
    ("what's up", "casual_chat"),
    ("i'm just watching tv", "casual_chat"),
    ("why is my burnout high", "burnout_question"),
    ("why do i feel worse", "burnout_question"),
    ("why am i so tired lately", "burnout_question"),
    ("i feel so sad and alone", "emotional_support"),
    ("i'm anxious and overwhelmed", "emotional_support"),
    ("i'm exhausted", "emotional_support"),
    ("thanks so much", "gratitude"),
    ("thank you", "gratitude"),
    ("bye for now", "farewell"),
    ("see you later", "farewell"),
]


def train_and_save(path: str = "intent_model.pkl"):
    texts, labels = zip(*DATA)
    pipe = make_pipeline(TfidfVectorizer(ngram_range=(1, 2), max_features=2000), LogisticRegression(max_iter=400))
    pipe.fit(texts, labels)
    dump(pipe, path)
    print(f"Saved model to {path}")


if __name__ == "__main__":
    train_and_save()
