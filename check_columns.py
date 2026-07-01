import pandas as pd

# Load datasets
df1 = pd.read_csv("data/dataset1.csv")
df2 = pd.read_csv("data/dataset2.csv")

# Print shape (rows, columns)
print("DATASET 1 SHAPE:", df1.shape)
print("DATASET 1 COLUMNS:")
print(df1.columns.tolist())

print("\nDATASET 2 SHAPE:", df2.shape)
print("DATASET 2 COLUMNS:")
print(df2.columns.tolist())
