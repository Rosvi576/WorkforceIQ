import ReportActions from "../components/ReportActions";

import { useEffect, useState } from "react";

import {
  BrainCircuit,
  Target,
  Crosshair,
  Search,
  Activity,
  ChartLine,
  Award,
  Database,
  Info,
  ShieldAlert,
  SlidersHorizontal,
  GitCompare,
  Layers
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
  ErrorBar
} from "recharts";

import { getModelInsights } from "../services/api";

import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ConfusionMatrix from "../components/ConfusionMatrix";


const COLORS = {
  brown: "#795440",
  terracotta: "#B65C45",
  clay: "#C58C6D",
  green: "#52765B",
  grid: "#EADFD2",
  text: "#856B59"
};


const percent = (value) =>
  `${(value * 100).toFixed(2)}%`;


const decimal = (value) =>
  Number(value).toFixed(4);


const readableFeature = (name) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ");


const tooltipStyle = {

  backgroundColor: "#FFFCF7",

  border: "1px solid #EADFD2",

  borderRadius: "10px",

  fontSize: "12px",

  color: "#493327"

};


const metrics = [

  {
    key: "accuracy",
    title: "Accuracy",
    icon: Target,
    description: "Overall correct classifications"
  },

  {
    key: "precision",
    title: "Precision",
    icon: Crosshair,
    description: "Correct positive predictions"
  },

  {
    key: "recall",
    title: "Recall",
    icon: Search,
    description: "Actual attrition cases detected"
  },

  {
    key: "f1",
    title: "F1-Score",
    icon: Activity,
    description: "Precision-recall harmonic mean"
  },

  {
    key: "roc_auc",
    title: "ROC-AUC",
    icon: ChartLine,
    description: "Ranking discrimination"
  },

  {
    key: "average_precision",
    title: "Average Precision",
    icon: Award,
    description: "Precision-recall performance"
  }

];


function MetricValue({ metric, value }) {

  if (
    metric === "roc_auc" ||
    metric === "average_precision"
  ) {
    return decimal(value);
  }

  return percent(value);

}


function ComparisonTable({
  data,
  refined,
  selectedModel
}) {

  return (

    <div className="table-wrapper">

      <table className="analytics-table model-table">

        <thead>

          <tr>

            <th>Model</th>

            {!refined && <th>Accuracy</th>}

            <th>Precision</th>

            <th>Recall</th>

            <th>F1</th>

            <th>ROC-AUC</th>

            <th>Average Precision</th>

          </tr>

        </thead>

        <tbody>

          {data.map((model) => (

            <tr
              key={model.model}
              className={
                model.model === selectedModel
                  ? "selected-model-row"
                  : ""
              }
            >

              <td>

                <strong>{model.model}</strong>

                {model.model === selectedModel && (

                  <span className="selected-model-label">
                    Selected
                  </span>

                )}

              </td>

              {!refined && (

                <td>{percent(model.accuracy)}</td>

              )}

              <td>{percent(model.precision)}</td>

              <td>{percent(model.recall)}</td>

              <td>{percent(model.f1)}</td>

              <td>{decimal(model.roc_auc)}</td>

              <td>
                {decimal(model.average_precision)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


function ImportanceChart({
  data,
  coefficient = false
}) {

  const key = coefficient
    ? "coefficient"
    : "importance";

  const chartData = data.map((item) => ({

    ...item,

    label: readableFeature(item.feature)

  }));

  return (

    <ResponsiveContainer
      width="100%"
      height={chartData.length * 36 + 65}
    >

      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          top: 15,
          right: 35,
          bottom: 10,
          left: 5
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke={COLORS.grid}
        />

        <XAxis
          type="number"
          tick={{
            fontSize: 11,
            fill: COLORS.text
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          type="category"
          dataKey="label"
          width={190}
          tick={{
            fontSize: 11,
            fill: COLORS.text
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name) => [
            decimal(value),
            name
          ]}
        />

        <ReferenceLine
          x={0}
          stroke={COLORS.brown}
        />

        <Bar
          dataKey={key}
          name={
            coefficient
              ? "Coefficient"
              : "Mean AP decrease"
          }
          maxBarSize={23}
          radius={4}
        >

          {chartData.map((item) => (

            <Cell
              key={item.feature}
              fill={
                coefficient
                  ? item.coefficient >= 0
                    ? COLORS.terracotta
                    : COLORS.brown
                  : COLORS.clay
              }
            />

          ))}

          {!coefficient && (

            <ErrorBar
              dataKey="std"
              width={4}
              stroke={COLORS.brown}
              strokeWidth={1.5}
            />

          )}

        </Bar>

      </BarChart>

    </ResponsiveContainer>
  );
}


export default function ModelInsights() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [comparisonMode, setComparisonMode] =
    useState("refined");

  const [evaluationMode, setEvaluationMode] =
    useState("selected");

  const [featureCount, setFeatureCount] =
    useState(10);


  const fetchData = async () => {

    setLoading(true);

    setError("");

    try {

      const result = await getModelInsights();

      if (!result?.evaluation) {

        throw new Error(
          "Invalid model insights response."
        );

      }

      setData(result);

    } catch {

      setError(
        "Unable to load model insights. Check the backend connection."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchData();

  }, []);


  if (loading) {

    return (
      <Loading message="Loading machine learning reports..." />
    );

  }


  if (error || !data) {

    return (

      <ErrorMessage
        message={error || "No model data available."}
        onRetry={fetchData}
      />

    );

  }


  const evaluation = data.evaluation;

  const selectedMetrics =
    evaluation.selected_metrics;

  const defaultMetrics =
    evaluation.default_metrics;

  const currentMetrics =
    evaluationMode === "selected"
      ? selectedMetrics
      : defaultMetrics;

  const comparison =
    comparisonMode === "refined"
      ? data.refined_comparison
      : data.initial_comparison;

  const falseAlarmsReduced =
    defaultMetrics.confusion_matrix.fp -
    selectedMetrics.confusion_matrix.fp;

  const additionalMisses =
    selectedMetrics.confusion_matrix.fn -
    defaultMetrics.confusion_matrix.fn;


  return (

    <div className="model-insights-page">

      <h1 className="page-title">
        Model Insights
      </h1>

      <p className="page-description">
        Machine learning evaluation, model selection,
        threshold analysis and explainability.
      </p>

      <ReportActions
        csvReports={[
          {
            label: "Test Evaluation Metrics",
            filename: "model_evaluation",
            rows: [
              data.evaluation.default_metrics,
              data.evaluation.selected_metrics
            ].map(({ confusion_matrix, ...metrics }) => ({
              ...metrics,
              ...confusion_matrix
            }))
          },
          {
            label: "Initial Model Comparison",
            filename: "initial_model_comparison",
            rows: data.initial_comparison
          },
          {
            label: "Refined Model Comparison",
            filename: "refined_model_comparison",
            rows: data.refined_comparison
          },
          {
            label: "Threshold Analysis",
            filename: "threshold_analysis",
            rows: data.threshold_comparison
          },
          {
            label: "Logistic Regression Coefficients",
            filename: "model_coefficients",
            rows: data.feature_importance
          },
          {
            label: "Permutation Importance",
            filename: "permutation_importance",
            rows: data.permutation_importance
          }
        ]}
        jsonData={data}
        filename="model_insights"
      />



      {/* Selected model */}

      <div className="card model-summary-card">

        <div className="model-summary-icon">
          <BrainCircuit size={38} />
        </div>

        <div className="model-summary-info">

          <span>Selected Machine Learning Model</span>

          <h2>{evaluation.model}</h2>

          <p>
            Class-balanced classification with
            fold-specific preprocessing and a
            training-selected decision threshold.
          </p>

        </div>

        <div className="model-threshold-box">

          <span>Decision Threshold</span>

          <strong>
            {evaluation.selected_threshold.toFixed(2)}
          </strong>

        </div>

      </div>


      {/* Dataset information */}

      <div className="model-dataset-grid">

        {[
          ["Dataset Records", evaluation.dataset_size],
          ["Training Samples", evaluation.training_samples],
          ["Testing Samples", evaluation.testing_samples],
          ["Input Features", evaluation.input_features],
          ["Encoded Features", evaluation.encoded_features]
        ].map(([label, value]) => (

          <div
            className="card model-dataset-card"
            key={label}
          >

            <Database size={19} />

            <span>{label}</span>

            <strong>
              {value.toLocaleString()}
            </strong>

          </div>

        ))}

      </div>


      {/* Evaluation controls */}

      <div className="model-section-heading">

        <div>

          <h2>Test Set Evaluation</h2>

          <p>
            Previously examined held-out test split
          </p>

        </div>

        <div className="model-toggle">

          <button
            type="button"
            className={
              evaluationMode === "default"
                ? "model-toggle-active"
                : ""
            }
            onClick={() =>
              setEvaluationMode("default")
            }
          >
            Threshold 0.50
          </button>

          <button
            type="button"
            className={
              evaluationMode === "selected"
                ? "model-toggle-active"
                : ""
            }
            onClick={() =>
              setEvaluationMode("selected")
            }
          >
            Threshold {evaluation.selected_threshold.toFixed(2)}
          </button>

        </div>

      </div>


      {/* Six evaluation metrics */}

      <div className="model-metrics-grid">

        {metrics.map((metric) => (

          <StatCard
            key={metric.key}
            title={metric.title}
            value={
              <MetricValue
                metric={metric.key}
                value={currentMetrics[metric.key]}
              />
            }
            icon={metric.icon}
            description={metric.description}
            accent={
              metric.key === "average_precision"
            }
          />

        ))}

      </div>


      {/* Confusion matrix */}

      <div className="model-evaluation-grid">

        <ConfusionMatrix
          matrix={currentMetrics.confusion_matrix}
          threshold={currentMetrics.threshold}
        />

        <div className="card model-baseline-card">

          <h3>Understanding Model Performance</h3>

          <p className="chart-description">
            Why accuracy alone is insufficient
          </p>

          <div className="baseline-stat">

            <span>Always-retained baseline accuracy</span>

            <strong>
              {percent(evaluation.baseline_accuracy)}
            </strong>

          </div>

          <div className="baseline-stat">

            <span>Current model accuracy</span>

            <strong>
              {percent(currentMetrics.accuracy)}
            </strong>

          </div>

          <div className="baseline-stat">

            <span>Actual attrition cases in test set</span>

            <strong>
              {evaluation.positive_test_samples}
            </strong>

          </div>

          <div className="baseline-stat">

            <span>Detected attrition cases</span>

            <strong>
              {currentMetrics.confusion_matrix.tp}
            </strong>

          </div>

          <div className="model-explanation">

            <Info size={19} />

            <p>
              The dataset is imbalanced. A classifier
              that predicts every employee as retained
              can achieve high accuracy while detecting
              no attrition cases. Precision, recall and
              average precision provide additional
              information about model performance.
            </p>

          </div>

        </div>

      </div>


      {/* Model comparison */}

      <div className="model-section-heading">

        <div>

          <h2>Algorithm Comparison</h2>

          <p>
            Five-fold stratified cross-validation
          </p>

        </div>

        <div className="model-toggle">

          <button
            type="button"
            className={
              comparisonMode === "initial"
                ? "model-toggle-active"
                : ""
            }
            onClick={() =>
              setComparisonMode("initial")
            }
          >
            Initial
          </button>

          <button
            type="button"
            className={
              comparisonMode === "refined"
                ? "model-toggle-active"
                : ""
            }
            onClick={() =>
              setComparisonMode("refined")
            }
          >
            Refined
          </button>

        </div>

      </div>

      <div className="card model-comparison-card">

        <h3>Average Precision by Algorithm</h3>

        <p className="chart-description">

          {comparisonMode === "refined"

            ? "Refined evaluation with preprocessing fitted separately inside each training fold."

            : "Initial exploratory comparison. Preprocessing was fitted before cross-validation."

          }

        </p>

        <ResponsiveContainer
          width="100%"
          height={290}
        >

          <BarChart
            data={comparison}
            margin={{
              top: 15,
              right: 15,
              left: 0,
              bottom: 10
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={COLORS.grid}
            />

            <XAxis
              dataKey="model"
              tick={{
                fontSize: 11,
                fill: COLORS.text
              }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />

            <YAxis
              domain={[0, 1]}
              tick={{
                fontSize: 11,
                fill: COLORS.text
              }}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [
                decimal(value),
                "Average Precision"
              ]}
            />

            <Bar
              dataKey="average_precision"
              maxBarSize={70}
              radius={[6, 6, 0, 0]}
            >

              {comparison.map((item) => (

                <Cell
                  key={item.model}
                  fill={
                    item.model === evaluation.model
                      ? COLORS.terracotta
                      : COLORS.clay
                  }
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

        <ComparisonTable
          data={comparison}
          refined={comparisonMode === "refined"}
          selectedModel={evaluation.model}
        />

        <div className="model-explanation">

          <Award size={20} />

          <p>
            Logistic Regression was selected because
            it achieved the highest mean average
            precision in the refined comparison.
            Other models performed better on certain
            threshold-dependent metrics. The selection
            was not based on accuracy alone.
          </p>

        </div>

      </div>


      {/* Threshold analysis */}

      <div className="model-section-heading">

        <div>

          <h2>Decision Threshold Analysis</h2>

          <p>
            Training out-of-fold precision-recall trade-offs
          </p>

        </div>

        <SlidersHorizontal size={23} />

      </div>

      <div className="card model-threshold-chart">

        <h3>Performance Across Thresholds</h3>

        <p className="chart-description">
          Threshold candidates evaluated using
          out-of-fold training predictions.
        </p>

        <ResponsiveContainer
          width="100%"
          height={340}
        >

          <LineChart
            data={data.threshold_comparison}
            margin={{
              top: 25,
              right: 25,
              left: 0,
              bottom: 10
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.grid}
            />

            <XAxis
              dataKey="threshold"
              type="number"
              domain={[0.2, 0.8]}
              tickFormatter={(value) =>
                value.toFixed(2)
              }
              tick={{
                fontSize: 11,
                fill: COLORS.text
              }}
            />

            <YAxis
              domain={[0, 1]}
              tickFormatter={(value) =>
                `${Math.round(value * 100)}%`
              }
              tick={{
                fontSize: 11,
                fill: COLORS.text
              }}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [
                percent(value),
                name
              ]}
              labelFormatter={(value) =>
                `Threshold: ${Number(value).toFixed(2)}`
              }
            />

            <Legend />

            <ReferenceLine
              x={evaluation.selected_threshold}
              stroke={COLORS.terracotta}
              strokeDasharray="5 5"
              label={{
                value: "Selected",
                position: "top",
                fill: COLORS.terracotta,
                fontSize: 11
              }}
            />

            <Line
              type="linear"
              dataKey="precision"
              name="Precision"
              stroke={COLORS.brown}
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />

            <Line
              type="linear"
              dataKey="recall"
              name="Recall"
              stroke={COLORS.clay}
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />

            <Line
              type="linear"
              dataKey="f1"
              name="F1-Score"
              stroke={COLORS.terracotta}
              strokeWidth={3}
              dot={{ r: 4 }}
            />

          </LineChart>

        </ResponsiveContainer>

        <div className="model-explanation">

          <SlidersHorizontal size={20} />

          <p>
            The selected threshold maximized F1
            among the evaluated training out-of-fold
            thresholds. This does not establish an
            optimal threshold for every application.
            The same out-of-fold scores were used
            for threshold selection, so their best
            F1 is not an independent performance estimate.
          </p>

        </div>

      </div>


      {/* Threshold trade-off table */}

      <div className="card threshold-tradeoff-card">

        <h3>Default vs Selected Threshold</h3>

        <p className="chart-description">
          Comparison on the previously examined test set
        </p>

        <div className="table-wrapper">

          <table className="analytics-table">

            <thead>

              <tr>
                <th>Metric</th>
                <th>Threshold 0.50</th>
                <th>
                  Threshold {evaluation.selected_threshold.toFixed(2)}
                </th>
              </tr>

            </thead>

            <tbody>

              {metrics.map((metric) => (

                <tr key={metric.key}>

                  <td>{metric.title}</td>

                  <td>
                    <MetricValue
                      metric={metric.key}
                      value={defaultMetrics[metric.key]}
                    />
                  </td>

                  <td>
                    <MetricValue
                      metric={metric.key}
                      value={selectedMetrics[metric.key]}
                    />
                  </td>

                </tr>

              ))}

              <tr>

                <td>False Positives</td>

                <td>
                  {defaultMetrics.confusion_matrix.fp}
                </td>

                <td>
                  {selectedMetrics.confusion_matrix.fp}
                </td>

              </tr>

              <tr>

                <td>False Negatives</td>

                <td>
                  {defaultMetrics.confusion_matrix.fn}
                </td>

                <td>
                  {selectedMetrics.confusion_matrix.fn}
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <div className="threshold-tradeoff-grid">

          <div className="tradeoff-stat">

            <span>Fewer false positives</span>

            <strong>{falseAlarmsReduced}</strong>

          </div>

          <div className="tradeoff-stat">

            <span>Additional missed attrition cases</span>

            <strong>{additionalMisses}</strong>

          </div>

        </div>

        <div className="model-explanation">

          <GitCompare size={20} />

          <p>
            Increasing the threshold reduces false
            alarms but misses more actual attrition
            cases. ROC-AUC and average precision
            remain unchanged because the underlying
            model scores have not changed.
          </p>

        </div>

      </div>


      {/* Explainability */}

      <div className="model-section-heading">

        <div>

          <h2>Model Explainability</h2>

          <p>
            Understanding the features used by the model
          </p>

        </div>

        <div className="feature-count-control">

          <label htmlFor="feature-count">
            Display
          </label>

          <select
            id="feature-count"
            value={featureCount}
            onChange={(event) =>
              setFeatureCount(
                Number(event.target.value)
              )
            }
          >

            <option value={5}>Top 5</option>

            <option value={10}>Top 10</option>

            <option value={15}>Top 15</option>

            <option value={30}>Top 30</option>

          </select>

        </div>

      </div>

      <div className="card model-importance-card">

        <h3>Logistic Regression Coefficients</h3>

        <p className="chart-description">
          Encoded features ranked by absolute
          coefficient magnitude.
        </p>

        <ImportanceChart
          data={
            data.feature_importance.slice(
              0,
              featureCount
            )
          }
          coefficient
        />

        <div className="coefficient-legend">

          <span>
            <i style={{
              background: COLORS.terracotta
            }} />
            Positive coefficient
          </span>

          <span>
            <i style={{
              background: COLORS.brown
            }} />
            Negative coefficient
          </span>

        </div>

        <div className="model-explanation">

          <Info size={20} />

          <p>
            Coefficients describe contributions to
            the model's log-odds score. Their magnitude
            depends on feature scaling and encoding.
            Correlated features and full one-hot
            encoding complicate interpretation.
            These coefficients do not establish
            causal relationships.
          </p>

        </div>

      </div>

      <div className="card model-importance-card">

        <h3>Permutation Feature Importance</h3>

        <p className="chart-description">
          Original features ranked by mean decrease
          in validation average precision.
          Error bars show reported standard deviation.
        </p>

        <ImportanceChart
          data={
            data.permutation_importance.slice(
              0,
              featureCount
            )
          }
        />

        <div className="model-explanation">

          <Layers size={20} />

          <p>
            Permutation importance measures how much
            model performance changes when a feature
            is shuffled. Our estimates use validation
            folds rather than the final test set.
            Correlated features can share importance,
            and the error bars are variability estimates,
            not confidence intervals.
          </p>

        </div>

      </div>


      {/* Limitations */}

      <div className="card model-limitations-card">

        <div className="model-limitations-heading">

          <ShieldAlert size={25} />

          <h2>Model Limitations</h2>

        </div>

        <div className="model-limitations-grid">

          {[
            [
              "Class Imbalance",
              "Attrition cases are a minority of the dataset. Accuracy alone can overstate model usefulness."
            ],
            [
              "Threshold Trade-Off",
              "The selected threshold improves precision but detects fewer actual attrition cases."
            ],
            [
              "Score Calibration",
              "Class-balanced Logistic Regression scores have not been calibrated as real-world resignation probabilities."
            ],
            [
              "Fairness Concerns",
              "The model includes demographic features such as gender and marital status. Fairness has not been independently validated."
            ],
            [
              "Dataset Generalizability",
              "Performance on the educational HR dataset does not establish performance on other organizations or future employees."
            ],
            [
              "Evaluation Limitations",
              "The test set was examined during development. A new independent dataset is required for unbiased final validation."
            ]
          ].map(([title, description]) => (

            <div
              className="model-limitation"
              key={title}
            >

              <h4>{title}</h4>

              <p>{description}</p>

            </div>

          ))}

        </div>

      </div>

      <div className="analytics-note">

        <Info size={22} />

        <div>

          <strong>Educational Machine Learning Prototype</strong>

          <p>
            WorkforceIQ demonstrates machine learning
            development and workforce analytics.
            It is not validated for operational HR
            decisions, individual employee monitoring,
            hiring, termination or compensation.
          </p>

        </div>

      </div>

    </div>

  );
}
