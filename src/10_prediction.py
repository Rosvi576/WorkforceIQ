
import joblib
import pandas as pd
from pathlib import Path

# Project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load trained model
saved = joblib.load(
    BASE_DIR / "models" / "refined_model.pkl"
)

pipeline = saved["pipeline"]
threshold = saved["threshold"]

required_features = list(pipeline.feature_names_in_)


def predict_attrition(employee_data):

    # Check required input features
    missing = [
        feature
        for feature in required_features
        if feature not in employee_data
    ]

    if missing:
        raise ValueError(
            f"Missing employee features: {missing}"
        )

    # Convert input into a DataFrame
    employee_df = pd.DataFrame(
        [employee_data]
    )[required_features]

    # Generate model score
    score = float(
        pipeline.predict_proba(employee_df)[0, 1]
    )

    # Apply selected threshold
    prediction = int(score >= threshold)

    return {
        "model": saved["model_name"],
        "attrition_score": round(score, 4),
        "threshold": threshold,
        "prediction": prediction,
        "classification": (
            "Flagged for Review"
            if prediction == 1
            else "Not Flagged"
        )
    }


# Test prediction function
if __name__ == "__main__":

    df = pd.read_csv(
        BASE_DIR / "dataset" /
        "WA_Fn-UseC_-HR-Employee-Attrition.csv"
    )

    employee = df.iloc[0][required_features].to_dict()

    print("\n--- EMPLOYEE INPUT ---")

    for key, value in employee.items():
        print(f"{key}: {value}")

    result = predict_attrition(employee)

    print("\n--- PREDICTION RESULT ---")

    for key, value in result.items():
        print(f"{key}: {value}")

    print("\nPrediction function completed!")
