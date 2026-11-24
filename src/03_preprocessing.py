
import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

print("STARTING DATA PREPROCESSING")

# 1. Load dataset
df = pd.read_csv("dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv")

print("\nOriginal Dataset Shape:", df.shape)

# 2. Remove unnecessary columns
df = df.drop(columns=[
    "EmployeeCount",
    "EmployeeNumber",
    "Over18",
    "StandardHours"
])

print("\nRemoved unnecessary columns")

# 3. Separate features and target
X = df.drop("Attrition", axis=1)
y = df["Attrition"].map({"Yes": 1, "No": 0})

# 4. Identify column types
categorical_columns = X.select_dtypes(
    include=["object"]
).columns.tolist()

numerical_columns = X.select_dtypes(
    include=["int64", "float64"]
).columns.tolist()

print("\nCategorical Columns:", len(categorical_columns))
print("Numerical Columns:", len(numerical_columns))

# 5. Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Data:", X_train.shape)
print("Testing Data:", X_test.shape)

# 6. Create preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_columns),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_columns)
    ]
)

# 7. Fit only on training data
X_train_processed = preprocessor.fit_transform(X_train)

# Transform testing data
X_test_processed = preprocessor.transform(X_test)

# 8. Convert to arrays
if hasattr(X_train_processed, "toarray"):
    X_train_processed = X_train_processed.toarray()

if hasattr(X_test_processed, "toarray"):
    X_test_processed = X_test_processed.toarray()
# 9. Save processed data
os.makedirs("dataset/processed", exist_ok=True)
os.makedirs("models", exist_ok=True)

np.save("dataset/processed/X_train.npy", X_train_processed)
np.save("dataset/processed/X_test.npy", X_test_processed)
np.save("dataset/processed/y_train.npy", y_train.to_numpy())
np.save("dataset/processed/y_test.npy", y_test.to_numpy())

# 10. Save preprocessing pipeline
joblib.dump(preprocessor, "models/preprocessor.pkl")

print("\n--- PREPROCESSING COMPLETED ---")
print("Training Features:", X_train_processed.shape)
print("Testing Features:", X_test_processed.shape)
print("Training Target:", y_train.shape)
print("Testing Target:", y_test.shape)

print("\nAll processed files saved successfully!")
