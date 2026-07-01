import pandas as pd

# -----------------------------
# 1. Load datasets
# -----------------------------
survey = pd.read_csv("data/processed_survey.csv")
df1 = pd.read_csv("data/dataset1.csv")
df2 = pd.read_csv("data/dataset2.csv")

# -----------------------------
# 2. Reduce size of large dataset (important)
# -----------------------------
df2 = df2.sample(n=10000, random_state=42)

# -----------------------------
# 3. Clean & rename dataset1
# -----------------------------
df1 = df1.rename(columns={
    "study_hours": "work_hours",
    "screen_time_hours": "screen_time",
    "academic_pressure": "deadline_pressure"
})

# Add missing burnout columns
df1["burnout_score"] = None
df1["burnout_level"] = None

# Select useful columns
df1 = df1[[
    "age", "gender", "sleep_hours", "work_hours", "screen_time",
    "physical_activity", "stress_level", "deadline_pressure",
    "burnout_score", "burnout_level"
]]

# -----------------------------
# 4. Clean & rename dataset2
# -----------------------------
df2 = df2.rename(columns={
    "study_hours_per_day": "work_hours",
    "exam_pressure": "deadline_pressure",
    "screen_time": "screen_time",
    "burnout_score": "burnout_score"
})

# Create burnout level from risk_level
df2["burnout_level"] = df2["risk_level"]

# Select useful columns
df2 = df2[[
    "age", "gender", "sleep_hours", "work_hours", "screen_time",
    "physical_activity", "stress_level", "deadline_pressure",
    "burnout_score", "burnout_level"
]]

# -----------------------------
# 5. Prepare survey data
# -----------------------------
survey = survey.rename(columns={
    "age_group": "age",
    "role": "gender"   # placeholder since gender not collected
})

# Add missing columns
survey["stress_level"] = None

# Select same structure
survey = survey[[
    "age", "gender", "sleep_hours", "work_hours", "screen_time",
    "physical_activity", "deadline_pressure",
    "burnout_score", "burnout_level"
]]

# Add missing column for alignment
survey["stress_level"] = None

# -----------------------------
# 6. Combine all datasets
# -----------------------------
final_df = pd.concat([survey, df1, df2], ignore_index=True)

# -----------------------------
# 7. Save final dataset
# -----------------------------
final_df.to_csv("data/final_burnout_dataset.csv", index=False)

print("FINAL DATASET CREATED ✅")
print("Shape:", final_df.shape)
print(final_df.head())