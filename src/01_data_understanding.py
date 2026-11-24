
import pandas as pd

# Load the employee dataset
file_path = "dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv"

df = pd.read_csv(file_path)

# 1. Dataset dimensions
print("\n--- DATASET SHAPE ---")
print(df.shape)

# 2. First five records
print("\n--- FIRST FIVE RECORDS ---")
print(df.head())

# 3. Column information
print("\n--- DATASET INFORMATION ---")
print(df.info())

# 4. Missing values
print("\n--- MISSING VALUES ---")
print(df.isnull().sum())

# 5. Duplicate records
print("\n--- DUPLICATE RECORDS ---")
print(df.duplicated().sum())

# 6. Attrition distribution
print("\n--- ATTRITION DISTRIBUTION ---")
print(df["Attrition"].value_counts())

# 7. Attrition percentage
print("\n--- ATTRITION PERCENTAGE ---")
print(df["Attrition"].value_counts(normalize=True) * 100)
