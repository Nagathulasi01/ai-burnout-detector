import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.utils import resample

# Load data
df = pd.read_csv("data/ml_ready_burnout_dataset.csv")

# Separate classes
low = df[df["burnout_level"] == "Low"]
medium = df[df["burnout_level"] == "Medium"]
high = df[df["burnout_level"] == "High"]

# Upsample minority classes
medium_upsampled = resample(medium, replace=True, n_samples=len(low), random_state=42)
high_upsampled = resample(high, replace=True, n_samples=len(low), random_state=42)

# Combine
df_balanced = pd.concat([low, medium_upsampled, high_upsampled])

# Features & labels
X = df_balanced.drop(["burnout_level", "burnout_score"], axis=1)
y = df_balanced["burnout_level"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

print("Model trained successfully\n")
print(classification_report(y_test, y_pred))

# Save model
import joblib
joblib.dump(model, "models/burnout_model.pkl")

print("\nModel saved in models/burnout_model.pkl")
