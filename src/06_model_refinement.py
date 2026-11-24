
import os
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_predict,
    cross_validate
)
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    average_precision_score
)
from xgboost import XGBClassifier

# 1. Load original dataset
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

# Recreate original train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# 2. Identify feature types
categorical_cols = X_train.select_dtypes(
    include=["object", "str"]
).columns.tolist()

numerical_cols = X_train.select_dtypes(
    include=["number"]
).columns.tolist()

def make_preprocessor():
    return ColumnTransformer([
        ("numeric", StandardScaler(), numerical_cols),
        ("categorical",
         OneHotEncoder(handle_unknown="ignore"),
         categorical_cols)
    ], sparse_threshold=0)

# 3. Define models
negative = (y_train == 0).sum()
positive = (y_train == 1).sum()

models = {
    "Logistic Regression": LogisticRegression(
        class_weight="balanced",
        max_iter=2000,
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
        scale_pos_weight=negative / positive,
        eval_metric="logloss",
        random_state=42,
        n_jobs=2
    )
}

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

results = []
pipelines = {}

# 4. Leakage-safe cross-validation
for name, model in models.items():
    print(f"\nEvaluating {name}...")

    pipeline = Pipeline([
        ("preprocessor", make_preprocessor()),
        ("classifier", model)
    ])

    scores = cross_validate(
        pipeline,
        X_train,
        y_train,
        cv=cv,
        scoring={
            "pr_auc": "average_precision",
            "roc_auc": "roc_auc",
            "f1": "f1",
            "recall": "recall",
            "precision": "precision"
        },
        n_jobs=1
    )

    results.append({
        "Model": name,
        "PR-AUC": scores["test_pr_auc"].mean(),
        "ROC-AUC": scores["test_roc_auc"].mean(),
        "F1": scores["test_f1"].mean(),
        "Recall": scores["test_recall"].mean(),
        "Precision": scores["test_precision"].mean()
    })

    pipelines[name] = pipeline

results_df = pd.DataFrame(results).sort_values(
    "PR-AUC",
    ascending=False
)

os.makedirs("reports", exist_ok=True)
results_df.to_csv(
    "reports/refined_model_comparison.csv",
    index=False
)

print("\n--- REFINED MODEL COMPARISON ---")
print(results_df.to_string(index=False))

# 5. Select model using training CV results
best_name = results_df.iloc[0]["Model"]
best_pipeline = pipelines[best_name]

print("\nSelected model:", best_name)

# Obtain out-of-fold probabilities
oof_probs = cross_val_predict(
    best_pipeline,
    X_train,
    y_train,
    cv=cv,
    method="predict_proba",
    n_jobs=1
)[:, 1]

# 6. Explore thresholds
threshold_results = []

for threshold in np.arange(0.20, 0.81, 0.05):
    predictions = (
        oof_probs >= threshold
    ).astype(int)

    threshold_results.append({
        "Threshold": round(float(threshold), 2),
        "Precision": precision_score(
            y_train, predictions, zero_division=0
        ),
        "Recall": recall_score(
            y_train, predictions, zero_division=0
        ),
        "F1": f1_score(
            y_train, predictions, zero_division=0
        )
    })

threshold_df = pd.DataFrame(threshold_results)

threshold_df.to_csv(
    "reports/threshold_comparison.csv",
    index=False
)

print("\n--- THRESHOLD COMPARISON ---")
print(threshold_df.to_string(index=False))

# Choose threshold with highest OOF F1
best_row = threshold_df.loc[
    threshold_df["F1"].idxmax()
]

best_threshold = float(best_row["Threshold"])

print("\nSelected threshold:", best_threshold)
print("OOF F1:", round(float(best_row["F1"]), 4))

# 7. Train final refined pipeline on training data
best_pipeline.fit(X_train, y_train)

os.makedirs("models", exist_ok=True)

joblib.dump(
    {
        "pipeline": best_pipeline,
        "threshold": best_threshold,
        "model_name": best_name
    },
    "models/refined_model.pkl"
)

print("\nRefined model saved successfully!")
print("Test set was not used during refinement.")

