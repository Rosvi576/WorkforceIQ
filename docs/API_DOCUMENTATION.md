# WorkforceIQ — REST API Documentation

## Base URL

http://127.0.0.1:8000

## API Version

1.0.0

## Interactive Documentation

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc
- OpenAPI: http://127.0.0.1:8000/openapi.json

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API information |
| GET | /health | Backend health |
| GET | /analytics/overview | Workforce summary |
| GET | /analytics/departments | Department statistics |
| GET | /analytics/risk-factors | Risk factor analysis |
| GET | /model/insights | Model performance and explainability |
| POST | /predict | Employee attrition prediction |

## Health Check

GET /health

Response:

```json
{
  "status": "healthy"
}
```

## Workforce Overview

GET /analytics/overview

Returns aggregate workforce statistics, including:

- Total employees
- Employees retained
- Employees left
- Attrition rate
- Retention rate
- Average age
- Average monthly income
- Average tenure
- Department count
- Job role count

## Department Analytics

GET /analytics/departments

Returns department-level employee counts, attrition
rates, retention rates, average monthly income,
and average job satisfaction.

## Risk Factor Analytics

GET /analytics/risk-factors

Returns grouped statistics for:

- Overtime
- Job role
- Job satisfaction
- Business travel
- Work-life balance
- Environment satisfaction

## Model Insights

GET /model/insights

Returns:

- Test set evaluation
- Initial algorithm comparison
- Refined algorithm comparison
- Classification threshold analysis
- Logistic Regression coefficients
- Permutation importance
- Confusion matrices

## Employee Attrition Prediction

POST /predict

Content-Type: application/json

### Example Request

```json
{
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
```

### Example Response

```json
{
  "status": "success",
  "result": {
    "model": "Logistic Regression",
    "attrition_score": 0.9014,
    "threshold": 0.75,
    "prediction": 1,
    "classification": "Flagged for Review"
  },
  "disclaimer": "Educational prototype. The attrition score is not a calibrated probability of resignation. Not for employment decisions."
}
```

## Classification Interpretation

- Class 0: Not Flagged
- Class 1: Flagged for Review
- Selected threshold: 0.75

The model score is not a calibrated probability
of employee resignation.

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Successful request |
| 404 | Endpoint not found |
| 422 | Invalid request data |
| 500 | Internal server error |

## Input Validation

Pydantic validates required fields, data types,
numerical constraints, and categorical values.

Unexpected fields are rejected.

Refer to the OpenAPI schema for complete field
definitions and validation constraints.

## CORS Configuration

Configured local frontend origins:

- http://localhost:5173
- http://127.0.0.1:5173

Production frontend origins must be configured
before public deployment.

## Authentication

Authentication and authorization are not implemented
in the current educational prototype.

## Responsible Use

Use demonstration profiles only.

The application is not intended for employment
decisions or processing confidential employee data.
