
import pytest

from fastapi.testclient import TestClient
from backend.main import app


client = TestClient(app)


# ==========================================
# SAMPLE EMPLOYEE PROFILES
# ==========================================

SAMPLE_A = {
    "Age": 41,
    "BusinessTravel": "Travel_Rarely",
    "DailyRate": 1102,
    "Department": "Sales",
    "DistanceFromHome": 1,
    "Education": 2,
    "EducationField": "Life Sciences",
    "EnvironmentSatisfaction": 2,
    "Gender": "Female",
    "HourlyRate": 94,
    "JobInvolvement": 3,
    "JobLevel": 2,
    "JobRole": "Sales Executive",
    "JobSatisfaction": 4,
    "MaritalStatus": "Single",
    "MonthlyIncome": 5993,
    "MonthlyRate": 19479,
    "NumCompaniesWorked": 8,
    "OverTime": "Yes",
    "PercentSalaryHike": 11,
    "PerformanceRating": 3,
    "RelationshipSatisfaction": 1,
    "StockOptionLevel": 0,
    "TotalWorkingYears": 8,
    "TrainingTimesLastYear": 0,
    "WorkLifeBalance": 1,
    "YearsAtCompany": 6,
    "YearsInCurrentRole": 4,
    "YearsSinceLastPromotion": 0,
    "YearsWithCurrManager": 5
}


SAMPLE_B = {
    **SAMPLE_A,
    "BusinessTravel": "Non-Travel",
    "EnvironmentSatisfaction": 4,
    "OverTime": "No",
    "RelationshipSatisfaction": 4,
    "WorkLifeBalance": 4
}


# ==========================================
# 1. API AVAILABILITY
# ==========================================

def test_home_endpoint():

    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_health_endpoint():

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_swagger_documentation():

    response = client.get("/docs")

    assert response.status_code == 200


def test_unknown_endpoint():

    response = client.get("/unknown-endpoint")

    assert response.status_code == 404


# ==========================================
# 2. WORKFORCE ANALYTICS
# ==========================================

def test_workforce_overview():

    response = client.get("/analytics/overview")

    assert response.status_code == 200

    data = response.json()["data"]

    assert data["total_employees"] == 1470
    assert data["employees_left"] == 237
    assert data["employees_retained"] == 1233
    assert data["attrition_rate"] == 16.12
    assert data["retention_rate"] == 83.88
    assert data["total_departments"] == 3
    assert data["total_job_roles"] == 9


def test_workforce_count_consistency():

    data = client.get(
        "/analytics/overview"
    ).json()["data"]

    assert (
        data["employees_left"]
        + data["employees_retained"]
        == data["total_employees"]
    )


def test_workforce_rate_consistency():

    data = client.get(
        "/analytics/overview"
    ).json()["data"]

    expected_rate = (
        data["employees_left"]
        / data["total_employees"]
        * 100
    )

    assert data["attrition_rate"] == pytest.approx(
        expected_rate, abs=0.01
    )

    assert (
        data["attrition_rate"]
        + data["retention_rate"]
    ) == pytest.approx(100, abs=0.01)


# ==========================================
# 3. DEPARTMENT ANALYTICS
# ==========================================

def test_department_endpoint():

    response = client.get(
        "/analytics/departments"
    )

    assert response.status_code == 200
    assert len(response.json()["data"]) == 3


def test_department_employee_totals():

    data = client.get(
        "/analytics/departments"
    ).json()["data"]

    assert sum(
        row["total_employees"] for row in data
    ) == 1470

    assert sum(
        row["employees_left"] for row in data
    ) == 237

    assert sum(
        row["employees_retained"] for row in data
    ) == 1233


def test_department_attrition_rates():

    data = client.get(
        "/analytics/departments"
    ).json()["data"]

    for row in data:

        expected = (
            row["employees_left"]
            / row["total_employees"]
            * 100
        )

        assert row["attrition_rate"] == pytest.approx(
            expected, abs=0.01
        )


def test_highest_department_attrition():

    data = client.get(
        "/analytics/departments"
    ).json()["data"]

    highest = max(
        data,
        key=lambda row: row["attrition_rate"]
    )

    assert highest["department"] == "Sales"
    assert highest["attrition_rate"] == 20.63


# ==========================================
# 4. RISK FACTOR ANALYTICS
# ==========================================

def test_risk_factor_endpoint():

    response = client.get(
        "/analytics/risk-factors"
    )

    assert response.status_code == 200

    data = response.json()["data"]

    expected_groups = {
        "overtime",
        "job_role",
        "job_satisfaction",
        "business_travel",
        "work_life_balance",
        "environment_satisfaction"
    }

    assert set(data.keys()) == expected_groups


@pytest.mark.parametrize(
    "group",
    [
        "overtime",
        "job_role",
        "job_satisfaction",
        "business_travel",
        "work_life_balance",
        "environment_satisfaction"
    ]
)
def test_risk_factor_population(group):

    data = client.get(
        "/analytics/risk-factors"
    ).json()["data"][group]

    assert sum(
        row["total_employees"] for row in data
    ) == 1470

    assert sum(
        row["employees_left"] for row in data
    ) == 237

    for row in data:

        assert (
            row["employees_left"]
            + row["employees_retained"]
            == row["total_employees"]
        )

        expected_rate = (
            row["employees_left"]
            / row["total_employees"]
            * 100
        )

        assert row["attrition_rate"] == pytest.approx(
            expected_rate, abs=0.01
        )


def test_overtime_statistics():

    data = client.get(
        "/analytics/risk-factors"
    ).json()["data"]["overtime"]

    rates = {
        row["category"]: row["attrition_rate"]
        for row in data
    }

    assert rates["Yes"] == 30.53
    assert rates["No"] == 10.44


# ==========================================
# 5. MODEL PREDICTION
# ==========================================

def test_sample_a_prediction():

    response = client.post(
        "/predict",
        json=SAMPLE_A
    )

    assert response.status_code == 200

    result = response.json()["result"]

    assert result["model"] == "Logistic Regression"
    assert result["prediction"] == 1
    assert result["classification"] == "Flagged for Review"

    assert result["attrition_score"] == pytest.approx(
        0.9014, abs=0.0001
    )


def test_sample_b_prediction():

    response = client.post(
        "/predict",
        json=SAMPLE_B
    )

    assert response.status_code == 200

    result = response.json()["result"]

    assert result["prediction"] == 0
    assert result["classification"] == "Not Flagged"

    assert result["attrition_score"] == pytest.approx(
        0.0516, abs=0.0001
    )


@pytest.mark.parametrize(
    "employee",
    [SAMPLE_A, SAMPLE_B]
)
def test_prediction_threshold_consistency(employee):

    result = client.post(
        "/predict",
        json=employee
    ).json()["result"]

    score = result["attrition_score"]
    threshold = result["threshold"]

    assert 0 <= score <= 1
    assert threshold == 0.75

    assert result["prediction"] == int(
        score >= threshold
    )


def test_prediction_reproducibility():

    first = client.post(
        "/predict", json=SAMPLE_A
    ).json()["result"]

    second = client.post(
        "/predict", json=SAMPLE_A
    ).json()["result"]

    assert first == second


def test_prediction_disclaimer():

    response = client.post(
        "/predict", json=SAMPLE_A
    ).json()

    assert "disclaimer" in response

    assert "not a calibrated probability" in (
        response["disclaimer"].lower()
    )


# ==========================================
# 6. INVALID INPUT VALIDATION
# ==========================================

@pytest.mark.parametrize(
    "field,value",
    [
        ("Age", 10),
        ("Age", 100),
        ("MonthlyIncome", -500),
        ("JobSatisfaction", 10),
        ("WorkLifeBalance", 0),
        ("OverTime", "Maybe"),
        ("Department", "Unknown"),
        ("YearsAtCompany", -1),
        ("Gender", "Invalid"),
        ("Age", "invalid")
    ]
)
def test_invalid_employee_fields(field, value):

    employee = {
        **SAMPLE_A,
        field: value
    }

    response = client.post(
        "/predict",
        json=employee
    )

    assert response.status_code == 422


def test_missing_required_field():

    employee = SAMPLE_A.copy()

    del employee["Age"]

    response = client.post(
        "/predict",
        json=employee
    )

    assert response.status_code == 422


def test_empty_employee_input():

    response = client.post(
        "/predict",
        json={}
    )

    assert response.status_code == 422


def test_unexpected_employee_field():

    employee = {
        **SAMPLE_A,
        "UnknownField": "Unexpected"
    }

    response = client.post(
        "/predict",
        json=employee
    )

    assert response.status_code == 422


def test_malformed_json():

    response = client.post(
        "/predict",
        content='{"Age":',
        headers={
            "Content-Type": "application/json"
        }
    )

    assert response.status_code == 422


# ==========================================
# 7. MODEL INSIGHTS
# ==========================================

@pytest.fixture(scope="module")
def model_insights():

    response = client.get("/model/insights")

    assert response.status_code == 200

    return response.json()["data"]


def test_model_insights_structure(model_insights):

    expected_keys = {
        "evaluation",
        "initial_comparison",
        "refined_comparison",
        "threshold_comparison",
        "feature_importance",
        "permutation_importance"
    }

    assert expected_keys.issubset(
        model_insights.keys()
    )


def test_model_dataset_information(model_insights):

    evaluation = model_insights["evaluation"]

    assert evaluation["dataset_size"] == 1470
    assert evaluation["training_samples"] == 1176
    assert evaluation["testing_samples"] == 294
    assert evaluation["input_features"] == 30
    assert evaluation["encoded_features"] == 51


def test_selected_model_metrics(model_insights):

    evaluation = model_insights["evaluation"]

    metrics = evaluation["selected_metrics"]

    assert evaluation["selected_threshold"] == 0.75

    assert metrics["accuracy"] == pytest.approx(
        0.8503, abs=0.0001
    )

    assert metrics["roc_auc"] == pytest.approx(
        0.8032, abs=0.0001
    )

    assert metrics["average_precision"] == pytest.approx(
        0.5612, abs=0.0001
    )


def test_confusion_matrix(model_insights):

    matrix = model_insights[
        "evaluation"
    ]["selected_metrics"]["confusion_matrix"]

    assert matrix["tn"] == 231
    assert matrix["fp"] == 16
    assert matrix["fn"] == 28
    assert matrix["tp"] == 19

    assert sum(matrix.values()) == 294


def test_model_comparison_counts(model_insights):

    assert len(
        model_insights["initial_comparison"]
    ) == 4

    assert len(
        model_insights["refined_comparison"]
    ) == 3


def test_threshold_comparison(model_insights):

    rows = model_insights["threshold_comparison"]

    assert len(rows) == 13

    best = max(
        rows,
        key=lambda row: row["f1"]
    )

    assert best["threshold"] == pytest.approx(0.75)


def test_feature_importance_counts(model_insights):

    assert len(
        model_insights["feature_importance"]
    ) == 51

    assert len(
        model_insights["permutation_importance"]
    ) == 30


def test_threshold_tradeoff(model_insights):

    evaluation = model_insights["evaluation"]

    default = evaluation[
        "default_metrics"
    ]["confusion_matrix"]

    selected = evaluation[
        "selected_metrics"
    ]["confusion_matrix"]

    assert default["fp"] - selected["fp"] == 40

    assert selected["fn"] - default["fn"] == 11


# ==========================================
# 8. FRONTEND API ACCESS
# ==========================================

def test_cors_configuration():

    response = client.options(
        "/predict",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
    )

    assert response.status_code == 200

    assert response.headers.get(
        "access-control-allow-origin"
    ) == "http://localhost:5173"
