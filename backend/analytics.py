
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_PATH = (
    BASE_DIR / "dataset" /
    "WA_Fn-UseC_-HR-Employee-Attrition.csv"
)

df = pd.read_csv(DATASET_PATH)


# STEP 14: Workforce Overview

def get_workforce_overview():

    total = len(df)
    left = int((df["Attrition"] == "Yes").sum())
    retained = int((df["Attrition"] == "No").sum())

    return {
        "total_employees": total,
        "employees_left": left,
        "employees_retained": retained,
        "attrition_rate": round(left / total * 100, 2),
        "retention_rate": round(retained / total * 100, 2),
        "average_age": round(float(df["Age"].mean()), 2),
        "average_monthly_income": round(
            float(df["MonthlyIncome"].mean()), 2
        ),
        "average_years_at_company": round(
            float(df["YearsAtCompany"].mean()), 2
        ),
        "total_departments": int(
            df["Department"].nunique()
        ),
        "total_job_roles": int(
            df["JobRole"].nunique()
        )
    }


# STEP 15: Department Analytics

def get_department_analytics():

    departments = []

    for department, group in df.groupby("Department"):

        total = len(group)
        left = int((group["Attrition"] == "Yes").sum())
        retained = total - left

        departments.append({
            "department": department,
            "total_employees": total,
            "employees_left": left,
            "employees_retained": retained,
            "attrition_rate": round(left / total * 100, 2),
            "retention_rate": round(retained / total * 100, 2),
            "average_monthly_income": round(
                float(group["MonthlyIncome"].mean()), 2
            ),
            "average_job_satisfaction": round(
                float(group["JobSatisfaction"].mean()), 2
            )
        })

    departments.sort(
        key=lambda x: x["attrition_rate"],
        reverse=True
    )

    return departments


# STEP 16: Risk-Factor Analytics

def calculate_group_attrition(column):

    results = []

    for category, group in df.groupby(column):

        total = len(group)
        left = int((group["Attrition"] == "Yes").sum())
        retained = total - left

        results.append({
            "category": str(category),
            "total_employees": total,
            "employees_left": left,
            "employees_retained": retained,
            "attrition_rate": round(left / total * 100, 2)
        })

    results.sort(
        key=lambda x: x["attrition_rate"],
        reverse=True
    )

    return results


def get_risk_factor_analytics():

    return {
        "overtime": calculate_group_attrition(
            "OverTime"
        ),
        "job_role": calculate_group_attrition(
            "JobRole"
        ),
        "job_satisfaction": calculate_group_attrition(
            "JobSatisfaction"
        ),
        "business_travel": calculate_group_attrition(
            "BusinessTravel"
        ),
        "work_life_balance": calculate_group_attrition(
            "WorkLifeBalance"
        ),
        "environment_satisfaction": calculate_group_attrition(
            "EnvironmentSatisfaction"
        )
    }
