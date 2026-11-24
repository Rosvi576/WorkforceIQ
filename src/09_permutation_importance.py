
import os
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.base import clone
from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold
)
from sklearn.inspection import permutation_importance

# Load original dataset
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

# Recreate original training split
X_train, _, y_train, _ = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# Load refined pipeline
saved = joblib.load("models/refined_model.pkl")
pipeline = saved["pipeline"]

# Training-only cross-validation
cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

all_importances = []

for fold, (train_idx, val_idx) in enumerate(
    cv.split(X_train, y_train), start=1
):
    print(f"Processing fold {fold}/5...")

    X_fold_train = X_train.iloc[train_idx]
    y_fold_train = y_train.iloc[train_idx]

    X_fold_val = X_train.iloc[val_idx]
    y_fold_val = y_train.iloc[val_idx]

    # Train a fresh pipeline for each fold
    fold_model = clone(pipeline)

    fold_model.fit(
        X_fold_train,
        y_fold_train
    )

    # Measure importance on validation data
    result = permutation_importance(
        fold_model,
        X_fold_val,
        y_fold_val,
        scoring="average_precision",
        n_repeats=10,
        random_state=42 + fold,
        n_jobs=1
    )

    all_importances.append(result.importances)

# Combine results from all folds
combined = np.concatenate(
    all_importances,
    axis=1
)

importance = pd.DataFrame({
    "Feature": X_train.columns,
    "Importance": combined.mean(axis=1),
    "Std": combined.std(axis=1)
})

importance = importance.sort_values(
    "Importance",
    ascending=False
)

# Save results
os.makedirs("reports/figures", exist_ok=True)

importance.to_csv(
    "reports/permutation_importance.csv",
    index=False
)

print("\n--- TOP 15 FEATURES ---")
print(importance.head(15).to_string(index=False))

# Visualization
top = importance.head(15).sort_values(
    "Importance"
)

fig, ax = plt.subplots(figsize=(11, 8))

fig.patch.set_facecolor("#F8F1E7")
ax.set_facecolor("#F8F1E7")

ax.barh(
    top["Feature"],
    top["Importance"],
    xerr=top["Std"],
    color="#B65C45",
    edgecolor="#754C36",
    capsize=3
)

ax.axvline(0, color="#754C36", linewidth=0.8)

ax.set_xlabel("Decrease in Average Precision")
ax.set_title("Employee Attrition - Permutation Importance")

plt.tight_layout()

plt.savefig(
    "reports/figures/permutation_importance.png",
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("\nPermutation importance completed!")
print("CSV and visualization saved successfully!")
