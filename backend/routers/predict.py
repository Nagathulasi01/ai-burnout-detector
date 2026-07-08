from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os

from services.reason_engine import get_insights

router = APIRouter()

MODEL_PATH = "backend/models/burnout_model.pkl"

# Load model safely
model = None
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    else:
        # Check relative to current working dir when running uvicorn
        alt_path = "models/burnout_model.pkl"
        if os.path.exists(alt_path):
            model = joblib.load(alt_path)
        else:
            print(f"Warning: Model file not found at {MODEL_PATH} or {alt_path}")
except Exception as e:
    print(f"Error loading model: {e}")


class BurnoutInput(BaseModel):
    age: float = Field(..., gt=0, le=120)
    sleep_hours: float = Field(..., ge=0, le=24)
    work_hours: float = Field(..., ge=0, le=24)
    screen_time: float = Field(..., ge=0, le=24)
    physical_activity: float = Field(..., ge=0, le=24)
    deadline_pressure: float = Field(..., ge=0, le=10)
    stress_level: float = Field(..., ge=0, le=10)


def _normalize_burnout_level(prediction):
    if prediction is None:
        return "Unknown"

    label = str(prediction).strip().lower()
    if "low" in label:
        return "Low"
    if "moderate" in label or "medium" in label:
        return "Moderate"
    if "high" in label or "critical" in label:
        return "High"
    return str(prediction)


def _calculate_burnout_score(prediction, probabilities):
    if probabilities is not None and len(probabilities) > 0:
        score_lookup = {
            "low": 25,
            "medium": 55,
            "moderate": 55,
            "high": 85,
            "critical": 95,
        }
        total_score = 0.0
        for label, probability in zip(getattr(model, "classes_", []), probabilities):
            label_key = str(label).strip().lower()
            if label_key in score_lookup:
                total_score += score_lookup[label_key] * float(probability)
            else:
                total_score += 50 * float(probability)
        if total_score > 0:
            return round(min(100, max(0, total_score)))

    label = str(prediction).strip().lower()
    if "low" in label:
        return 25
    if "medium" in label or "moderate" in label:
        return 55
    if "high" in label or "critical" in label:
        return 85
    return 50


@router.post("/predict")
def predict_burnout(data: BurnoutInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Burnout prediction model is currently unavailable on the server.")

    try:
        input_data = np.array([[
            data.age,
            data.sleep_hours,
            data.work_hours,
            data.screen_time,
            data.physical_activity,
            data.deadline_pressure,
            data.stress_level,
        ]], dtype=float)

        prediction = model.predict(input_data)[0]

        confidence_score = None
        confidence_percentage = None
        probabilities = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_data)[0]
            confidence_score = float(np.max(probabilities))
            confidence_percentage = f"{int(round(confidence_score * 100))}%"

        insights = get_insights(data.dict())
        burnout_score = _calculate_burnout_score(prediction, probabilities)
        burnout_level = _normalize_burnout_level(prediction)

        return {
            "burnout_score": burnout_score,
            "burnout_level": burnout_level,
            "confidence_score": confidence_score,
            "confidence_percentage": confidence_percentage,
            "reasons": insights["reasons"],
            "solutions": insights["solutions"],
            "top_factors": insights["top_factors"],
            "risk_summary": insights["risk_summary"],
            "categorized_insights": insights["categorized_insights"],
            "recommendation_plan": insights["recommendation_plan"],
        }
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}")
