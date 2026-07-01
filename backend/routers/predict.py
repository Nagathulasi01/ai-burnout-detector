from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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
    age: float
    sleep_hours: float
    work_hours: float
    screen_time: float
    physical_activity: float
    deadline_pressure: float
    stress_level: float

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
            data.stress_level
        ]])

        prediction = model.predict(input_data)[0]

        # Handle predict_proba if available
        confidence_score = None
        confidence_percentage = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(input_data)
            confidence_score = float(np.max(proba[0]))
            confidence_percentage = f"{int(confidence_score * 100)}%"
        
        # Get enriched insights
        insights = get_insights(data.dict())

        return {
            # Legacy fields for backwards compatibility
            "burnout_level": str(prediction),
            "reasons": insights["reasons"],
            "solutions": insights["solutions"],
            
            # New structured fields
            "confidence_score": confidence_score,
            "confidence_percentage": confidence_percentage,
            "top_factors": insights["top_factors"],
            "risk_summary": insights["risk_summary"],
            "categorized_insights": insights["categorized_insights"],
            "recommendation_plan": insights["recommendation_plan"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
