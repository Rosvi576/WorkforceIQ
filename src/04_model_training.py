
import os
import numpy as np
import pandas as pd
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score
)

# Load training data
X_train = np.load("dataset/processed/X_train.npy")
y_train = np.load("dataset/processed/y_train.npy")

print("Training samples:", X_train.shape)
print("Target distribution:", np.bincount(y_train))

# Handle class imbalance
negative = np.sum(y_train == 0)
positive = np.sum(y_train == 1)
weight = negative / positive

# Define models
models = {
    "Logistic Regression": LogisticRegression(
        class_weight="balanced",
        max_iter=2000,
        random_state=42
    ),

    "Decision Tree": DecisionTreeClassifier(
        class_weight="balanced",
        max_depth=5,
        random_state=42
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=42
    ),

    "XGBoost": XGBClassifier(
        n_estimators=200,
        max_depth=3,
        learning_rate=0.05,
        scale_pos_weight=weight,
        eval_metric="logloss",
        random_state=42,
        n_jobs=2
    )
}

# Cross-validation on training data only
cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scoring = {
    "accuracy": "accuracy",
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "roc_auc": "roc_auc",
    "pr_auc": "average_precision"
}

results = []

for name, model in models.items():
    print("\nTraining:", name)

    scores = cross_validate(
        model,
        X_train,
        y_train,
        cv=cv,
        scoring=scoring,
        n_jobs=1
    )

    row = {"Model": name}

    for metric in scoring:
        row[metric] = scores["test_" + metric].mean()

    results.append(row)

    print("Recall:", round(row["recall"], 4))
    print("F1 Score:", round(row["f1"], 4))
    print("PR-AUC:", round(row["pr_auc"], 4))

# Save comparison
results_df = pd.DataFrame(results)
results_df = results_df.sort_values(
    by="pr_auc",
    ascending=False
)

os.makedirs("reports", exist_ok=True)
results_df.to_csv(
    "reports/model_comparison.csv",
    index=False
)

print("\n--- MODEL COMPARISON ---")
print(results_df.to_string(index=False))

# Select best model using cross-validation PR-AUC
best_name = results_df.iloc[0]["Model"]
best_model = models[best_name]

# Train selected model on all training samples
best_model.fit(X_train, y_train)

os.makedirs("models", exist_ok=True)
joblib.dump(best_model, "models/best_model.pkl")

print("\nBest model:", best_name)
print("Saved to models/best_model.pkl")
print("Test data remains untouched.")
