
import os
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    roc_auc_score,
    average_precision_score,
    ConfusionMatrixDisplay
)

# Load untouched test data
X_test = np.load("dataset/processed/X_test.npy")
y_test = np.load("dataset/processed/y_test.npy")

# Load selected model
model = joblib.load("models/best_model.pkl")

# Generate predictions
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\n--- FINAL TEST EVALUATION ---")

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["Stayed", "Left"],
    zero_division=0
))

print("Accuracy:", round(
    accuracy_score(y_test, y_pred), 4
))

print("ROC-AUC:", round(
    roc_auc_score(y_test, y_prob), 4
))

print("PR-AUC:", round(
    average_precision_score(y_test, y_prob), 4
))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)

print("\nConfusion Matrix:")
print(cm)

os.makedirs("reports/figures", exist_ok=True)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["Stayed", "Left"]
)

disp.plot(cmap="Oranges", values_format="d")
plt.title("Employee Attrition - Confusion Matrix")
plt.tight_layout()

plt.savefig(
    "reports/figures/confusion_matrix.png",
    dpi=300
)
plt.close()

print("\nConfusion matrix saved successfully!")
