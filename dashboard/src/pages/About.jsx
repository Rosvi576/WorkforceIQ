
import {
  UsersRound,
  Target,
  Lightbulb,
  Database,
  BrainCircuit,
  ChartNoAxesCombined,
  Layers,
  Code2,
  Server,
  FileSpreadsheet,
  ShieldAlert,
  CheckCircle2,
  ArrowDown,
  Monitor,
  Workflow,
  GraduationCap,
  UserRound,
  
  
  ExternalLink
} from "lucide-react";


const objectives = [
  "Analyze employee attrition patterns using historical workforce data.",
  "Identify important workforce characteristics associated with attrition.",
  "Compare multiple machine learning classification algorithms.",
  "Develop a reproducible preprocessing and prediction pipeline.",
  "Evaluate model performance using class-sensitive metrics.",
  "Explore classification threshold trade-offs.",
  "Provide model explainability through coefficients and permutation importance.",
  "Present workforce analytics through an interactive web dashboard."
];


const technologies = [

  {
    category: "Frontend",
    icon: Monitor,
    tools: [
      "React",
      "Vite",
      "JavaScript",
      "CSS",
      "Recharts",
      "Lucide React",
      "React Router",
      "Axios"
    ]
  },

  {
    category: "Backend",
    icon: Server,
    tools: [
      "Python",
      "FastAPI",
      "Uvicorn",
      "Pydantic",
      "REST API"
    ]
  },

  {
    category: "Machine Learning",
    icon: BrainCircuit,
    tools: [
      "Scikit-learn",
      "XGBoost",
      "Pandas",
      "NumPy",
      "Joblib"
    ]
  },

  {
    category: "Data Visualization",
    icon: ChartNoAxesCombined,
    tools: [
      "Matplotlib",
      "Seaborn",
      "Recharts"
    ]
  }

];


const methodology = [

  {
    title: "Data Understanding",
    description:
      "Explore the IBM HR Analytics dataset, inspect data quality, identify feature types and examine class imbalance."
  },

  {
    title: "Exploratory Data Analysis",
    description:
      "Analyze attrition distribution, departments, overtime, job satisfaction, work-life balance and other workforce characteristics."
  },

  {
    title: "Data Preprocessing",
    description:
      "Remove non-informative columns, encode categorical variables, scale numerical features and create a stratified 80:20 train-test split."
  },

  {
    title: "Model Training",
    description:
      "Compare Logistic Regression, Decision Tree, Random Forest and XGBoost during initial experimentation."
  },

  {
    title: "Model Refinement",
    description:
      "Use fold-specific preprocessing and stratified cross-validation to compare refined candidate models using average precision."
  },

  {
    title: "Threshold Selection",
    description:
      "Evaluate training out-of-fold predictions and select a decision threshold of 0.75 based on F1-score among tested candidates."
  },

  {
    title: "Model Evaluation",
    description:
      "Evaluate accuracy, precision, recall, F1-score, ROC-AUC, average precision and confusion matrices."
  },

  {
    title: "Model Explainability",
    description:
      "Analyze Logistic Regression coefficients and validation-fold permutation importance to understand model behavior."
  },

  {
    title: "Application Integration",
    description:
      "Integrate the saved machine learning pipeline with FastAPI and build an interactive React workforce analytics dashboard."
  }

];


const modules = [

  {
    title: "Workforce Overview",
    icon: UsersRound,
    description:
      "Dataset-level workforce statistics, attrition distribution and department comparisons."
  },

  {
    title: "Department Analytics",
    icon: Layers,
    description:
      "Department-level attrition rates, employee counts, income and satisfaction summaries."
  },

  {
    title: "Risk Factor Analytics",
    icon: ChartNoAxesCombined,
    description:
      "Observed attrition associations across overtime, job roles, travel and satisfaction indicators."
  },

  {
    title: "Employee Prediction",
    icon: BrainCircuit,
    description:
      "Interactive 30-feature demonstration form connected to the trained classification pipeline."
  },

  {
    title: "Model Insights",
    icon: Workflow,
    description:
      "Algorithm comparison, evaluation metrics, threshold analysis and model explainability."
  },

  {
    title: "About Project",
    icon: GraduationCap,
    description:
      "Technical documentation, project methodology, architecture and responsible-use limitations."
  }

];


export default function About() {

  return (

    <div className="about-page">

      <h1 className="page-title">
        About Project
      </h1>

      <p className="page-description">
        Project documentation, technical architecture
        and machine learning methodology.
      </p>


      {/* Hero section */}

      <section className="about-hero">

        <div className="about-hero-brand">

          <UsersRound size={30} />

          <span>WorkforceIQ</span>

        </div>

        <h2>
          Intelligent Workforce Analytics
        </h2>

        <p>
          Machine Learning-Based Employee Attrition
          Prediction and Workforce Analytics System
        </p>

        <div className="about-hero-tags">

          <span>Machine Learning</span>

          <span>People Analytics</span>

          <span>Explainable AI</span>

          <span>Full-Stack Application</span>

        </div>

        <div className="about-hero-footer">

          Educational Project · Version 1.0.0

        </div>

      </section>


      {/* Project statistics */}

      <div className="about-stats-grid">

        {[
          ["1,470", "Dataset Records"],
          ["30", "Input Features"],
          ["4", "Initially Evaluated Algorithms"],
          ["6", "Dashboard Modules"]
        ].map(([value, label]) => (

          <div
            className="card about-stat"
            key={label}
          >

            <strong>{value}</strong>

            <span>{label}</span>

          </div>

        ))}

      </div>


      {/* Problem and solution */}

      <div className="about-two-column">

        <div className="card about-info-card">

          <div className="about-card-icon">
            <Target size={25} />
          </div>

          <h3>Problem Statement</h3>

          <p>
            Employee attrition can affect workforce
            continuity, organizational productivity
            and recruitment costs.
          </p>

          <p>
            Understanding attrition patterns requires
            examining multiple employee and workplace
            characteristics rather than relying on
            isolated indicators.
          </p>

        </div>

        <div className="card about-info-card">

          <div className="about-card-icon">
            <Lightbulb size={25} />
          </div>

          <h3>Proposed Solution</h3>

          <p>
            WorkforceIQ combines exploratory data
            analysis, machine learning classification
            and interactive visualizations into a
            unified educational application.
          </p>

          <p>
            The system demonstrates how workforce
            data can be analyzed and how predictive
            models can be evaluated and interpreted.
          </p>

        </div>

      </div>


      {/* Objectives */}

      <section className="card about-section">

        <div className="about-section-heading">

          <Target size={24} />

          <h2>Project Objectives</h2>

        </div>

        <div className="about-objectives-grid">

          {objectives.map((objective) => (

            <div
              className="about-objective"
              key={objective}
            >

              <CheckCircle2 size={19} />

              <p>{objective}</p>

            </div>

          ))}

        </div>

      </section>


      {/* Dataset */}

      <section className="card about-section">

        <div className="about-section-heading">

          <Database size={24} />

          <h2>Dataset Information</h2>

        </div>

        <p className="about-section-description">
          The project uses the publicly available
          IBM HR Analytics Employee Attrition and
          Performance dataset, an educational
          workforce dataset.
        </p>

        <div className="about-dataset-details">

          {[
            ["Original Records", "1,470"],
            ["Original Columns", "35"],
            ["Model Input Features", "30"],
            ["Encoded Features", "51"],
            ["Target Variable", "Attrition"],
            ["Attrition Cases", "237"],
            ["Retained Employees", "1,233"],
            ["Observed Attrition Rate", "16.12%"],
            ["Training Records", "1,176"],
            ["Testing Records", "294"],
            ["Missing Values", "0"],
            ["Duplicate Records", "0"]
          ].map(([label, value]) => (

            <div
              className="about-dataset-item"
              key={label}
            >

              <span>{label}</span>

              <strong>{value}</strong>

            </div>

          ))}

        </div>

        <a
          className="about-external-link"
          href="https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset"
          target="_blank"
          rel="noopener noreferrer"
        >

          View Dataset on Kaggle

          <ExternalLink size={15} />

        </a>

      </section>


      {/* Architecture */}

      <section className="card about-section">

        <div className="about-section-heading">

          <Layers size={24} />

          <h2>System Architecture</h2>

        </div>

        <p className="about-section-description">
          A modular architecture separating the user
          interface, API services, analytics logic
          and machine learning pipeline.
        </p>

        <div className="about-architecture">

          <div className="architecture-node architecture-frontend">

            <Monitor size={28} />

            <h3>Frontend Application</h3>

            <p>React · Vite · Recharts</p>

            <small>
              Dashboard, visualizations and input forms
            </small>

          </div>

          <div className="architecture-connector">

            <ArrowDown size={22} />

            <span>HTTP Requests / JSON Responses</span>

          </div>

          <div className="architecture-node architecture-api">

            <Server size={28} />

            <h3>FastAPI REST API</h3>

            <p>Python · Pydantic · Uvicorn</p>

            <small>
              Input validation and endpoint routing
            </small>

          </div>

          <div className="architecture-connector">

            <ArrowDown size={22} />

            <span>Backend Services</span>

          </div>

          <div className="architecture-services">

            <div className="architecture-node">

              <BrainCircuit size={27} />

              <h3>Prediction Engine</h3>

              <p>Scikit-learn Pipeline</p>

              <small>
                Preprocessing and classification
              </small>

            </div>

            <div className="architecture-node">

              <ChartNoAxesCombined size={27} />

              <h3>Analytics Engine</h3>

              <p>Pandas · Evaluation Reports</p>

              <small>
                Aggregations and model insights
              </small>

            </div>

          </div>

          <div className="architecture-connector">

            <ArrowDown size={22} />

            <span>Data and Saved Artifacts</span>

          </div>

          <div className="architecture-storage">

            <div className="architecture-node">

              <Database size={25} />

              <h3>Dataset</h3>

              <p>HR Analytics CSV</p>

            </div>

            <div className="architecture-node">

              <FileSpreadsheet size={25} />

              <h3>Reports</h3>

              <p>Evaluation CSV Files</p>

            </div>

            <div className="architecture-node">

              <BrainCircuit size={25} />

              <h3>Model Artifact</h3>

              <p>refined_model.pkl</p>

            </div>

          </div>

        </div>

      </section>


      {/* Technology stack */}

      <section className="card about-section">

        <div className="about-section-heading">

          <Code2 size={24} />

          <h2>Technology Stack</h2>

        </div>

        <div className="about-tech-grid">

          {technologies.map((technology) => {

            const Icon = technology.icon;

            return (

              <div
                className="about-tech-card"
                key={technology.category}
              >

                <div className="about-tech-heading">

                  <Icon size={22} />

                  <h3>{technology.category}</h3>

                </div>

                <div className="about-tech-tags">

                  {technology.tools.map((tool) => (

                    <span key={tool}>{tool}</span>

                  ))}

                </div>

              </div>

            );

          })}

        </div>

      </section>


      {/* Methodology */}

      <section className="card about-section">

        <div className="about-section-heading">

          <Workflow size={24} />

          <h2>Machine Learning Methodology</h2>

        </div>

        <div className="about-timeline">

          {methodology.map((step, index) => (

            <div
              className="about-timeline-item"
              key={step.title}
            >

              <div className="about-timeline-number">

                {String(index + 1).padStart(2, "0")}

              </div>

              <div className="about-timeline-content">

                <h3>{step.title}</h3>

                <p>{step.description}</p>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Dashboard modules */}

      <section className="card about-section">

        <div className="about-section-heading">

          <Monitor size={24} />

          <h2>Application Modules</h2>

        </div>

        <div className="about-modules-grid">

          {modules.map((module) => {

            const Icon = module.icon;

            return (

              <div
                className="about-module-card"
                key={module.title}
              >

                <Icon size={25} />

                <h3>{module.title}</h3>

                <p>{module.description}</p>

              </div>

            );

          })}

        </div>

      </section>


      {/* API documentation */}

      <section className="card about-section">

        <div className="about-section-heading">

          <Server size={24} />

          <h2>API Endpoints</h2>

        </div>

        <div className="table-wrapper">

          <table className="analytics-table">

            <thead>

              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>

            </thead>

            <tbody>

              {[
                ["GET", "/", "API information"],
                ["GET", "/health", "Backend health status"],
                ["GET", "/analytics/overview", "Workforce summary"],
                ["GET", "/analytics/departments", "Department analytics"],
                ["GET", "/analytics/risk-factors", "Grouped attrition statistics"],
                ["POST", "/predict", "Employee classification"],
                ["GET", "/model/insights", "Model evaluation and explainability"]
              ].map(([method, endpoint, description]) => (

                <tr key={endpoint}>

                  <td>

                    <span className={
                      `api-method api-method-${method.toLowerCase()}`
                    }>

                      {method}

                    </span>

                  </td>

                  <td>
                    <code>{endpoint}</code>
                  </td>

                  <td>{description}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <a
          className="about-external-link"
          href={
            `${(
              import.meta.env.VITE_API_URL ||
              "http://127.0.0.1:8000"
            ).replace(/\/$/, "")}/docs`
          }
          target="_blank"
          rel="noopener noreferrer"
        >

          Open Interactive API Documentation

          <ExternalLink size={15} />

        </a>

      </section>


      {/* Responsible use */}

      <section className="card about-section about-responsible-use">

        <div className="about-section-heading">

          <ShieldAlert size={24} />

          <h2>Responsible AI and Limitations</h2>

        </div>

        <p>
          WorkforceIQ is an educational machine
          learning prototype, not a production-ready
          employee assessment system.
        </p>

        <div className="about-limitations-list">

          {[
            "The dataset does not establish real-world organizational generalizability.",
            "Attrition scores are not calibrated probabilities of employee resignation.",
            "Feature associations and importance scores do not establish causation.",
            "Demographic features may introduce fairness concerns that have not been independently validated.",
            "The test set was previously examined during development.",
            "Independent external validation is required before considering operational use.",
            "Predictions must not be used for hiring, termination, promotion, compensation or employee monitoring."
          ].map((limitation) => (

            <div
              className="about-limitation-item"
              key={limitation}
            >

              <ShieldAlert size={17} />

              <p>{limitation}</p>

            </div>

          ))}

        </div>

      </section>


      {/* Developer information */}

      <section className="card about-developer">

        <div className="about-developer-avatar">

          <UserRound size={38} />

        </div>

        <div className="about-developer-info">

          <span>Project Developer</span>

          <h2>Rosvi S</h2>

          <p>
            B.Tech — Artificial Intelligence
            and Machine Learning
          </p>

          <p>
            SNS College of Technology, Coimbatore
          </p>

          <div className="about-developer-links">

            <a
              href="https://github.com/Rosvi576"
              target="_blank"
              rel="noopener noreferrer"
            >

              <Code2 size={17} />

              GitHub

            </a>

            <a
              href="https://www.linkedin.com/in/rosvi/"
              target="_blank"
              rel="noopener noreferrer"
            >

              <UserRound size={17} />

              LinkedIn

            </a>

          </div>

        </div>

      </section>


      <div className="about-footer-note">

        WorkforceIQ · Educational ML Project · 2026

      </div>

    </div>

  );

}
