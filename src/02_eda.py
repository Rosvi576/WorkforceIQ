
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Load dataset
df = pd.read_csv("dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv")

# Create output folder
os.makedirs("reports/figures", exist_ok=True)

# Design settings
sns.set_theme(style="whitegrid")

# Convert Attrition into numerical values
df["AttritionFlag"] = (df["Attrition"] == "Yes").astype(int)

# 1. Attrition by overtime
print("\n--- ATTRITION BY OVERTIME ---")
overtime = df.groupby("OverTime")["AttritionFlag"].mean() * 100
print(overtime)

# 2. Attrition by department
print("\n--- ATTRITION BY DEPARTMENT ---")
department = df.groupby("Department")["AttritionFlag"].mean() * 100
print(department.sort_values(ascending=False))

# 3. Attrition by job role
print("\n--- ATTRITION BY JOB ROLE ---")
job_role = df.groupby("JobRole")["AttritionFlag"].mean() * 100
print(job_role.sort_values(ascending=False))

# 4. Attrition by job satisfaction
print("\n--- ATTRITION BY JOB SATISFACTION ---")
satisfaction = df.groupby("JobSatisfaction")["AttritionFlag"].mean() * 100
print(satisfaction)

# 5. Attrition by work-life balance
print("\n--- ATTRITION BY WORK-LIFE BALANCE ---")
balance = df.groupby("WorkLifeBalance")["AttritionFlag"].mean() * 100
print(balance)

# Plot 1: Attrition distribution
plt.figure(figsize=(7, 5))
sns.countplot(data=df, x="Attrition", color="#984A2E")
plt.title("Employee Attrition Distribution")
plt.xlabel("Attrition")
plt.ylabel("Number of Employees")
plt.tight_layout()
plt.savefig("reports/figures/01_attrition_distribution.png")
plt.show()

# Plot 2: Overtime
plt.figure(figsize=(7, 5))
sns.barplot(x=overtime.index, y=overtime.values, color="#984A2E")
plt.title("Attrition Rate by Overtime")
plt.xlabel("Overtime")
plt.ylabel("Attrition Rate (%)")
plt.tight_layout()
plt.savefig("reports/figures/02_overtime_attrition.png")
plt.show()

# Plot 3: Department
plt.figure(figsize=(8, 5))
sns.barplot(
    x=department.values,
    y=department.index,
    color="#984A2E"
)
plt.title("Attrition Rate by Department")
plt.xlabel("Attrition Rate (%)")
plt.ylabel("Department")
plt.tight_layout()
plt.savefig("reports/figures/03_department_attrition.png")
plt.show()

# Plot 4: Job satisfaction
plt.figure(figsize=(7, 5))
sns.barplot(
    x=satisfaction.index,
    y=satisfaction.values,
    color="#984A2E"
)
plt.title("Attrition Rate by Job Satisfaction")
plt.xlabel("Job Satisfaction Level")
plt.ylabel("Attrition Rate (%)")
plt.tight_layout()
plt.savefig("reports/figures/04_satisfaction_attrition.png")
plt.show()

# Plot 5: Age comparison
plt.figure(figsize=(7, 5))
sns.boxplot(
    data=df,
    x="Attrition",
    y="Age",
    color="#C07A4C"
)
plt.title("Age Distribution by Attrition")
plt.tight_layout()
plt.savefig("reports/figures/05_age_attrition.png")
plt.close()

print("\nEDA COMPLETED SUCCESSFULLY!")

