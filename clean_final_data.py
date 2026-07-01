import pandas as pd

df = pd.read_csv("data/final_burnout_dataset.csv")

# Standardize burnout level
df["burnout_level"] = df["burnout_level"].astype(str).str.strip()

level_map = {
    "Low": "Low",
    "Medium": "Medium",
    "High": "High",
    "0": "Low",
    "1": "Medium",
    "2": "High",
    "low": "Low",
    "medium": "Medium",
    "high": "High"
}

df["burnout_level"] = df["burnout_level"].map(level_map)

# Remove rows without burnout label
df = df.dropna(subset=["burnout_level"])

# Convert age group to approximate number
def clean_age(age):
    age = str(age).strip()
    if "-" in age:
        parts = age.split("-")
        return (int(parts[0]) + int(parts[1])) / 2
    return pd.to_numeric(age, errors="coerce")

df["age"] = df["age"].apply(clean_age)

# Convert numeric columns
numeric_cols = [
    "age", "sleep_hours", "work_hours", "screen_time",
    "physical_activity", "deadline_pressure",
    "burnout_score", "stress_level"
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Fill missing numeric values using median
for col in numeric_cols:
    df[col] = df[col].fillna(df[col].median())

# Keep only useful columns for ML
ml_df = df[
    [
        "age",
        "sleep_hours",
        "work_hours",
        "screen_time",
        "physical_activity",
        "deadline_pressure",
        "stress_level",
        "burnout_score",
        "burnout_level"
    ]
]

ml_df.to_csv("data/ml_ready_burnout_dataset.csv", index=False)

print("ML-ready dataset created ✅")
print("Shape:", ml_df.shape)
print("\nBurnout level counts:")
print(ml_df["burnout_level"].value_counts())
print("\nFirst 5 rows:")
print(ml_df.head())