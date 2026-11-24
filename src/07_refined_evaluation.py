
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score
)

# Load original data
df = pd.read_csv(
    "dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv"
)

df = df.drop(columns=[
    "EmployeeNumber",
    "EmployeeCount",
    "Over18",
    "StandardHours"
])

X = df.drop(columns=["Attrition"])
y = df["Attrition"].map({"No": 0, "Yes": 1})

# Recreate the same held-out split
_, X_test, _, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# Load refined model
saved = joblib.load("models/refined_model.pkl")

pipeline = saved["pipeline"]
threshold = saved["threshold"]

# Predict attrition scores
probabilities = pipeline.predict_proba(X_test)[:, 1]

print("\nModel:", saved["model_name"])
print("Selected threshold:", threshold)

for t in [0.50, threshold]:
    predictions = (probabilities >= t).astype(int)

    print(f"\n--- THRESHOLD {t:.2f} ---")

    print(classification_report(
        y_test,
        predictions,
        target_names=["Stayed", "Left"],
        zero_division=0
    ))

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, predictions))

    print("Accuracy:", round(
        accuracy_score(y_test, predictions), 4
    ))

    print("Precision:", round(
        precision_score(y_test, predictions), 4
    ))

    print("Recall:", round(
        recall_score(y_test, predictions), 4
    ))

    print("F1:", round(
        f1_score(y_test, predictions), 4
    ))

print("\nROC-AUC:", round(
    roc_auc_score(y_test, probabilities), 4
))

print("PR-AUC:", round(
    average_precision_score(y_test, probabilities), 4
))
