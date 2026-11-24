
from pathlib import Path

import pandas as pd
import joblib

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix
)


BASE_DIR = Path(__file__).resolve().parent.parent

REPORTS_DIR = BASE_DIR / "reports"

DATASET_PATH = (
    BASE_DIR
    / "dataset"
    / "WA_Fn-UseC_-HR-Employee-Attrition.csv"
)

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "refined_model.pkl"
)


def read_report(filename):

    path = REPORTS_DIR / filename

    if not path.exists():
        raise FileNotFoundError(
            f"Report not found: {filename}"
        )

    return pd.read_csv(path)


def get_initial_model_comparison():

    df = read_report("model_comparison.csv")

    df = df.rename(columns={
        "Model": "model",
        "pr_auc": "average_precision"
    })

    df = df.sort_values(
        "average_precision",
        ascending=False
    )

    return df.to_dict(orient="records")


def get_refined_model_comparison():

    df = read_report(
        "refined_model_comparison.csv"
    )

    df = df.rename(columns={
        "Model": "model",
        "PR-AUC": "average_precision",
        "ROC-AUC": "roc_auc",
        "F1": "f1",
        "Recall": "recall",
        "Precision": "precision"
    })

    df = df.sort_values(
        "average_precision",
        ascending=False
    )

    return df.to_dict(orient="records")


def get_threshold_comparison():

    df = read_report(
        "threshold_comparison.csv"
    )

    df = df.rename(columns={
        "Threshold": "threshold",
        "Precision": "precision",
        "Recall": "recall",
        "F1": "f1"
    })

    df = df.sort_values("threshold")

    return df.to_dict(orient="records")


def get_feature_importance():

    df = read_report(
        "feature_importance.csv"
    )

    df = df.rename(columns={
        "Feature": "feature",
        "Coefficient": "coefficient",
        "Absolute_Importance": "absolute_importance"
    })

    df["feature"] = (
        df["feature"]
        .str.replace(
            r"^(categorical__|numerical__|numeric__|cat__|num__)",
            "",
            regex=True
        )
        .str.replace("_", " ", regex=False)
    )

    df = df.sort_values(
        "absolute_importance",
        ascending=False
    )

    return df.to_dict(orient="records")


def get_permutation_importance():

    df = read_report(
        "permutation_importance.csv"
    )

    df = df.rename(columns={
        "Feature": "feature",
        "Importance": "importance",
        "Std": "std"
    })

    df = df.sort_values(
        "importance",
        ascending=False
    )

    return df.to_dict(orient="records")


def calculate_metrics(y_true, scores, threshold):

    predictions = (
        scores >= threshold
    ).astype(int)

    tn, fp, fn, tp = confusion_matrix(
        y_true,
        predictions,
        labels=[0, 1]
    ).ravel()

    return {

        "threshold": float(threshold),

        "accuracy": round(
            float(
                accuracy_score(y_true, predictions)
            ), 6
        ),

        "precision": round(
            float(
                precision_score(
                    y_true,
                    predictions,
                    zero_division=0
                )
            ), 6
        ),

        "recall": round(
            float(
                recall_score(
                    y_true,
                    predictions,
                    zero_division=0
                )
            ), 6
        ),

        "f1": round(
            float(
                f1_score(
                    y_true,
                    predictions,
                    zero_division=0
                )
            ), 6
        ),

        "roc_auc": round(
            float(
                roc_auc_score(y_true, scores)
            ), 6
        ),

        "average_precision": round(
            float(
                average_precision_score(
                    y_true,
                    scores
                )
            ), 6
        ),

        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp)
        }

    }


def get_model_evaluation():

    saved = joblib.load(MODEL_PATH)

    pipeline = saved["pipeline"]

    selected_threshold = float(
        saved["threshold"]
    )

    df = pd.read_csv(DATASET_PATH)

    required_features = list(
        pipeline.feature_names_in_
    )

    X = df[required_features]

    y = df["Attrition"].map({
        "Yes": 1,
        "No": 0
    })

    X_train, X_test, y_train, y_test = (
        train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=y
        )
    )

    scores = pipeline.predict_proba(
        X_test
    )[:, 1]

    default_metrics = calculate_metrics(
        y_test,
        scores,
        0.50
    )

    selected_metrics = calculate_metrics(
        y_test,
        scores,
        selected_threshold
    )

    return {

        "model": saved["model_name"],

        "selected_threshold": selected_threshold,

        "dataset_size": int(len(df)),

        "training_samples": int(len(X_train)),

        "testing_samples": int(len(X_test)),

        "input_features": int(
            len(required_features)
        ),

        "encoded_features": int(
            pipeline.steps[-1][1].n_features_in_
        ),

        "positive_test_samples": int(
            y_test.sum()
        ),

        "negative_test_samples": int(
            len(y_test) - y_test.sum()
        ),

        "baseline_accuracy": round(
            float((y_test == 0).mean()),
            6
        ),

        "default_metrics": default_metrics,

        "selected_metrics": selected_metrics

    }


def get_model_insights():

    return {

        "evaluation": get_model_evaluation(),

        "initial_comparison":
            get_initial_model_comparison(),

        "refined_comparison":
            get_refined_model_comparison(),

        "threshold_comparison":
            get_threshold_comparison(),

        "feature_importance":
            get_feature_importance(),

        "permutation_importance":
            get_permutation_importance()

    }
