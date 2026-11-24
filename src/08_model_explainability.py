
import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt

# Load trained model
saved = joblib.load("models/refined_model.pkl")
pipeline = saved["pipeline"]

preprocessor = pipeline.named_steps["preprocessor"]
model = pipeline.named_steps["classifier"]

# Extract feature names and coefficients
feature_names = preprocessor.get_feature_names_out()
coefficients = model.coef_[0]

importance = pd.DataFrame({
    "Feature": feature_names,
    "Coefficient": coefficients
})

importance["Absolute_Importance"] = (
    importance["Coefficient"].abs()
)

importance = importance.sort_values(
    "Absolute_Importance",
    ascending=False
)

# Save all feature coefficients
os.makedirs("reports/figures", exist_ok=True)

importance.to_csv(
    "reports/feature_importance.csv",
    index=False
)

print("\n--- TOP 15 INFLUENTIAL FEATURES ---")
print(importance.head(15).to_string(index=False))

# Plot strongest coefficients
top_features = importance.head(15).sort_values(
    "Coefficient"
)

colors = [
    "#B65C45" if value > 0 else "#769184"
    for value in top_features["Coefficient"]
]

plt.figure(figsize=(11, 8))

plt.barh(
    top_features["Feature"],
    top_features["Coefficient"],
    color=colors
)

plt.axvline(0, color="black", linewidth=0.8)

plt.xlabel("Logistic Regression Coefficient")
plt.ylabel("Employee Characteristic")
plt.title("Top 15 Model Feature Coefficients")

plt.tight_layout()
plt.savefig(
    "reports/figures/feature_importance.png",
    dpi=300
)
plt.close()

print("\nFeature importance chart saved!")
print("Feature importance CSV saved!")
