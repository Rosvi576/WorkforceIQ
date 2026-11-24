
const options = (values) =>
  values.map((value) => ({
    value,
    label: String(value)
  }));

const numberField = (
  name,
  label,
  min,
  max = undefined
) => ({
  name,
  label,
  type: "number",
  min,
  max
});

const selectField = (
  name,
  label,
  values,
  numeric = false
) => ({
  name,
  label,
  type: "select",
  options: values,
  numeric
});

const satisfactionOptions = [
  { value: 1, label: "1 - Low" },
  { value: 2, label: "2 - Medium" },
  { value: 3, label: "3 - High" },
  { value: 4, label: "4 - Very High" }
];

export const employeeSections = [

  {
    title: "Personal Information",
    description: "Employee demographic and educational details",
    icon: "personal",

    fields: [

      numberField("Age", "Age", 18, 60),

      selectField(
        "Gender",
        "Gender",
        options(["Female", "Male"])
      ),

      selectField(
        "MaritalStatus",
        "Marital Status",
        options(["Single", "Married", "Divorced"])
      ),

      selectField(
        "Education",
        "Education Level",
        [
          { value: 1, label: "1 - Below College" },
          { value: 2, label: "2 - College" },
          { value: 3, label: "3 - Bachelor" },
          { value: 4, label: "4 - Master" },
          { value: 5, label: "5 - Doctor" }
        ],
        true
      ),

      selectField(
        "EducationField",
        "Education Field",
        options([
          "Human Resources",
          "Life Sciences",
          "Marketing",
          "Medical",
          "Other",
          "Technical Degree"
        ])
      ),

      numberField(
        "DistanceFromHome",
        "Distance From Home",
        1
      )

    ]
  },

  {
    title: "Employment Information",
    description: "Current role and working conditions",
    icon: "employment",

    fields: [

      selectField(
        "Department",
        "Department",
        options([
          "Human Resources",
          "Research & Development",
          "Sales"
        ])
      ),

      selectField(
        "JobRole",
        "Job Role",
        options([
          "Healthcare Representative",
          "Human Resources",
          "Laboratory Technician",
          "Manager",
          "Manufacturing Director",
          "Research Director",
          "Research Scientist",
          "Sales Executive",
          "Sales Representative"
        ])
      ),

      selectField(
        "JobLevel",
        "Job Level",
        options([1, 2, 3, 4, 5]),
        true
      ),

      selectField(
        "BusinessTravel",
        "Business Travel",
        [
          {
            value: "Non-Travel",
            label: "No Travel"
          },
          {
            value: "Travel_Rarely",
            label: "Travel Rarely"
          },
          {
            value: "Travel_Frequently",
            label: "Travel Frequently"
          }
        ]
      ),

      selectField(
        "OverTime",
        "Overtime",
        options(["Yes", "No"])
      ),

      numberField(
        "TrainingTimesLastYear",
        "Training Sessions Last Year",
        0
      )

    ]
  },

  {
    title: "Compensation and Benefits",
    description: "Income and compensation features in dataset units",
    icon: "compensation",

    fields: [

      numberField(
        "MonthlyIncome",
        "Monthly Income",
        1
      ),

      numberField(
        "MonthlyRate",
        "Monthly Rate",
        1
      ),

      numberField(
        "DailyRate",
        "Daily Rate",
        1
      ),

      numberField(
        "HourlyRate",
        "Hourly Rate",
        1
      ),

      numberField(
        "PercentSalaryHike",
        "Salary Hike (%)",
        0,
        100
      ),

      selectField(
        "StockOptionLevel",
        "Stock Option Level",
        options([0, 1, 2, 3]),
        true
      )

    ]
  },

  {
    title: "Experience and Tenure",
    description: "Employee career history and organizational experience",
    icon: "experience",

    fields: [

      numberField(
        "TotalWorkingYears",
        "Total Working Years",
        0
      ),

      numberField(
        "NumCompaniesWorked",
        "Number of Companies Worked",
        0
      ),

      numberField(
        "YearsAtCompany",
        "Years at Company",
        0
      ),

      numberField(
        "YearsInCurrentRole",
        "Years in Current Role",
        0
      ),

      numberField(
        "YearsSinceLastPromotion",
        "Years Since Last Promotion",
        0
      ),

      numberField(
        "YearsWithCurrManager",
        "Years With Current Manager",
        0
      )

    ]
  },

  {
    title: "Satisfaction and Performance",
    description: "Workplace experience and performance ratings",
    icon: "satisfaction",

    fields: [

      selectField(
        "JobSatisfaction",
        "Job Satisfaction",
        satisfactionOptions,
        true
      ),

      selectField(
        "EnvironmentSatisfaction",
        "Environment Satisfaction",
        satisfactionOptions,
        true
      ),

      selectField(
        "RelationshipSatisfaction",
        "Relationship Satisfaction",
        satisfactionOptions,
        true
      ),

      selectField(
        "JobInvolvement",
        "Job Involvement",
        satisfactionOptions,
        true
      ),

      selectField(
        "WorkLifeBalance",
        "Work-Life Balance",
        [
          { value: 1, label: "1 - Bad" },
          { value: 2, label: "2 - Good" },
          { value: 3, label: "3 - Better" },
          { value: 4, label: "4 - Best" }
        ],
        true
      ),

      selectField(
        "PerformanceRating",
        "Performance Rating",
        [
          { value: 3, label: "3 - Excellent" },
          { value: 4, label: "4 - Outstanding" }
        ],
        true
      )

    ]
  }

];

export const allFields = employeeSections.flatMap(
  (section) => section.fields
);

export const emptyEmployee = Object.fromEntries(
  allFields.map((field) => [field.name, ""])
);

// Previously verified sample employee

export const sampleEmployeeA = {

  Age: 41,
  BusinessTravel: "Travel_Rarely",
  DailyRate: 1102,
  Department: "Sales",
  DistanceFromHome: 1,
  Education: 2,
  EducationField: "Life Sciences",
  EnvironmentSatisfaction: 2,
  Gender: "Female",
  HourlyRate: 94,
  JobInvolvement: 3,
  JobLevel: 2,
  JobRole: "Sales Executive",
  JobSatisfaction: 4,
  MaritalStatus: "Single",
  MonthlyIncome: 5993,
  MonthlyRate: 19479,
  NumCompaniesWorked: 8,
  OverTime: "Yes",
  PercentSalaryHike: 11,
  PerformanceRating: 3,
  RelationshipSatisfaction: 1,
  StockOptionLevel: 0,
  TotalWorkingYears: 8,
  TrainingTimesLastYear: 0,
  WorkLifeBalance: 1,
  YearsAtCompany: 6,
  YearsInCurrentRole: 4,
  YearsSinceLastPromotion: 0,
  YearsWithCurrManager: 5

};

// Alternative demonstration profile

export const sampleEmployeeB = {

  ...sampleEmployeeA,

  BusinessTravel: "Non-Travel",
  EnvironmentSatisfaction: 4,
  OverTime: "No",
  RelationshipSatisfaction: 4,
  WorkLifeBalance: 4

};
