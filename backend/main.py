import os

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import EmployeeInput

from backend.prediction import predict_attrition

from backend.analytics import (
    get_workforce_overview,
    get_department_analytics,
    get_risk_factor_analytics
)

from backend.model_insights import (
    get_model_insights
)


app = FastAPI(
    title="Employee Attrition Prediction API",
    description="ML-Based Workforce Analytics Prototype",
    version="1.0.0"
)



allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

production_origins = os.getenv("FRONTEND_ORIGINS", "")

allowed_origins.extend(
    origin.strip().rstrip("/")
    for origin in production_origins.split(",")
    if origin.strip()
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)


@app.get("/")
def home():

    return {
        "message": "Employee Attrition Prediction API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(employee: EmployeeInput):

    result = predict_attrition(
        employee.model_dump()
    )

    return {

        "status": "success",

        "result": result,

        "disclaimer": (
            "Educational prototype. "
            "The attrition score is not a calibrated "
            "probability of resignation. "
            "Not for employment decisions."
        )

    }


@app.get("/analytics/overview")
def workforce_overview():

    return {
        "status": "success",
        "data": get_workforce_overview()
    }


@app.get("/analytics/departments")
def department_analytics():

    return {
        "status": "success",
        "data": get_department_analytics()
    }


@app.get("/analytics/risk-factors")
def risk_factor_analytics():

    return {
        "status": "success",
        "data": get_risk_factor_analytics()
    }


@app.get("/model/insights")
def model_insights():

    return {
        "status": "success",
        "data": get_model_insights()
    }
