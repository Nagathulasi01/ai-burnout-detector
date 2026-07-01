import pandas as pd

survey = pd.read_csv("data/survey_responses.csv")

# Clean column names
survey.columns = survey.columns.str.strip()

# Rename columns
survey = survey.rename(columns={
    "Do you consent to participate in this anonymous survey?": "consent",
    "What is your Age": "age_group",
    "What is your Current Role": "role",
    "What is your Average sleep hours per day": "sleep_hours",
    "What is yourDaily study/work hours": "work_hours",
    "What is your  avg Screen time (non-study)": "screen_time",
    "What is your  Physical activity per week": "physical_activity",
    "Break frequency during work/study": "break_frequency",
    "I feel emotionally drained by my studies/work": "exhaustion_1",
    "I feel tired even after resting": "exhaustion_2",
    "I feel overwhelmed by my daily tasks": "exhaustion_3",
    "I feel less interested in my work/studies": "cynicism_1",
    "I feel detached or disconnected from my work": "cynicism_2",
    "I feel more negative about my responsibilities": "cynicism_3",
    "I feel confident in completing my tasks": "accomplishment_1",
    "I feel productive in my daily work": "accomplishment_2",
    "I feel I am achieving my goals": "accomplishment_3",
    "Social interaction level": "social_interaction",
    "Deadline pressure": "deadline_pressure",
    "Mood in the last 7 days": "mood",
    "What do you think is your biggest stress factor?": "stress_factor"
})

# Keep only consent = Yes
survey = survey[survey["consent"].astype(str).str.lower().str.strip() == "yes"]

# Encoding maps
sleep_map = {
    "Less than 5 hours": 1,
    "5–6 hours": 2,
    "5-6 hours": 2,
    "6–7 hours": 3,
    "6-7 hours": 3,
    "7–8 hours": 4,
    "7-8 hours": 4,
    "More than 8 hours": 5
}

work_map = {
    "Less than 2 hours": 1,
    "2–4 hours": 2,
    "2-4 hours": 2,
    "4–6 hours": 3,
    "4-6 hours": 3,
    "6–8 hours": 4,
    "6-8 hours": 4,
    "More than 8 hours": 5
}

screen_map = {
    "Less than 1 hour": 1,
    "1–3 hours": 2,
    "1-3 hours": 2,
    "3–5 hours": 3,
    "3-5 hours": 3,
    "More than 5 hours": 4
}

activity_map = {
    "None": 1,
    "1–2 days": 2,
    "1-2 days": 2,
    "3–5 days": 3,
    "3-5 days": 3,
    "Daily": 4
}

break_map = {
    "Rarely": 1,
    "Sometimes": 2,
    "Often": 3,
    "Regularly": 4
}

social_map = {
    "Very low": 1,
    "Low": 2,
    "Moderate": 3,
    "High": 4
}

pressure_map = {
    "Low": 1,
    "Moderate": 2,
    "High": 3
}

mood_map = {
    "Very low": 1,
    "Low": 2,
    "Neutral": 3,
    "Good": 4
}

# Apply encodings
survey["sleep_hours"] = survey["sleep_hours"].map(sleep_map)
survey["work_hours"] = survey["work_hours"].map(work_map)
survey["screen_time"] = survey["screen_time"].map(screen_map)
survey["physical_activity"] = survey["physical_activity"].map(activity_map)
survey["break_frequency"] = survey["break_frequency"].map(break_map)
survey["social_interaction"] = survey["social_interaction"].map(social_map)
survey["deadline_pressure"] = survey["deadline_pressure"].map(pressure_map)
survey["mood"] = survey["mood"].map(mood_map)

# Convert scale questions to numbers
scale_cols = [
    "exhaustion_1", "exhaustion_2", "exhaustion_3",
    "cynicism_1", "cynicism_2", "cynicism_3",
    "accomplishment_1", "accomplishment_2", "accomplishment_3"
]

for col in scale_cols:
    survey[col] = pd.to_numeric(survey[col], errors="coerce")

# Create burnout dimension scores
survey["exhaustion_score"] = survey[["exhaustion_1", "exhaustion_2", "exhaustion_3"]].sum(axis=1)
survey["cynicism_score"] = survey[["cynicism_1", "cynicism_2", "cynicism_3"]].sum(axis=1)
survey["accomplishment_score"] = survey[["accomplishment_1", "accomplishment_2", "accomplishment_3"]].sum(axis=1)

# Reverse accomplishment: lower accomplishment means higher burnout risk
survey["low_accomplishment_score"] = 15 - survey["accomplishment_score"]

# Overall burnout score
survey["burnout_score"] = (
    survey["exhaustion_score"] +
    survey["cynicism_score"] +
    survey["low_accomplishment_score"]
)

# Burnout level
def label_burnout(score):
    if score >= 27:
        return "High"
    elif score >= 18:
        return "Medium"
    else:
        return "Low"

survey["burnout_level"] = survey["burnout_score"].apply(label_burnout)

final_cols = [
    "age_group", "role",
    "sleep_hours", "work_hours", "screen_time",
    "physical_activity", "break_frequency",
    "social_interaction", "deadline_pressure", "mood",
    "exhaustion_score", "cynicism_score",
    "accomplishment_score", "burnout_score", "burnout_level",
    "stress_factor"
]

processed = survey[final_cols]

processed.to_csv("data/processed_survey.csv", index=False)

print("Processed survey saved successfully!")
print("Shape:", processed.shape)
print(processed.head())