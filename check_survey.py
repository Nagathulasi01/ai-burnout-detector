import pandas as pd

# Load your survey data
survey = pd.read_csv("data/survey_responses.csv")

# Show basic info
print("SURVEY SHAPE:", survey.shape)

print("\nSURVEY COLUMNS:")
print(survey.columns.tolist())

print("\nFIRST 5 ROWS:")
print(survey.head())