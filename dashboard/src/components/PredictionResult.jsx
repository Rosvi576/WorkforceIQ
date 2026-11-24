import {
  BrainCircuit,
  Info,
  ShieldCheck,
  AlertTriangle,
  Activity
} from "lucide-react";

function formatPercent(value, decimals = 2) {
  return `${(value * 100).toFixed(decimals)}%`;
}

function ScoreGauge({ score, threshold, flagged }) {

  const radius = 95;

  const thresholdAngle =
    Math.PI * (1 - threshold);

  const markerX =
    130 + radius * Math.cos(thresholdAngle);

  const markerY =
    125 - radius * Math.sin(thresholdAngle);

  const markerOuterX =
    130 + (radius + 14) * Math.cos(thresholdAngle);

  const markerOuterY =
    125 - (radius + 14) * Math.sin(thresholdAngle);

  const scoreColor = flagged
    ? "#B65C45"
    : "#52765B";

  return (

    <div className="prediction-gauge">

      <svg
        viewBox="0 0 260 165"
        role="img"
        aria-label={`Attrition risk score ${formatPercent(score)}, decision threshold ${formatPercent(threshold, 0)}`}
      >

        <path
          d="M 35 125 A 95 95 0 0 1 225 125"
          fill="none"
          stroke="#EADFD2"
          strokeWidth="18"
          strokeLinecap="round"
        />

        <path
          d="M 35 125 A 95 95 0 0 1 225 125"
          fill="none"
          stroke={scoreColor}
          strokeWidth="18"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${score * 100} 100`}
        />

        <line
          x1={markerX}
          y1={markerY}
          x2={markerOuterX}
          y2={markerOuterY}
          stroke="#493327"
          strokeWidth="3"
        />

        <text
          x="130"
          y="105"
          textAnchor="middle"
          fontSize="32"
          fontWeight="700"
          fill={scoreColor}
        >
          {formatPercent(score)}
        </text>

        <text
          x="130"
          y="125"
          textAnchor="middle"
          fontSize="12"
          fill="#856B59"
        >
          Attrition risk score
        </text>

        <text
          x="35"
          y="150"
          textAnchor="middle"
          fontSize="11"
          fill="#856B59"
        >
          0%
        </text>

        <text
          x="225"
          y="150"
          textAnchor="middle"
          fontSize="11"
          fill="#856B59"
        >
          100%
        </text>

      </svg>

      <p className="gauge-caption">
        Decision threshold: {formatPercent(threshold, 0)}
      </p>

    </div>
  );
}

export default function PredictionResult({ response }) {

  if (!response) {

    return (

      <div className="card prediction-result-card">

        <div className="prediction-empty">

          <div className="prediction-empty-icon">
            <BrainCircuit size={42} />
          </div>

          <h3>Awaiting Prediction</h3>

          <p>
            Complete the employee information form
            and generate a prediction to view
            the attrition risk score.
          </p>

        </div>

        <div className="prediction-model-note">

          <Activity size={18} />

          <div>
            <strong>Model ready</strong>
            <p>
              Logistic Regression with a trained
              preprocessing pipeline.
            </p>
          </div>

        </div>

      </div>
    );
  }

  const result = response.result;

  const score = Number(result.attrition_score);

  const threshold = Number(result.threshold);

  const flagged = result.prediction === 1;

  const ResultIcon = flagged
    ? AlertTriangle
    : ShieldCheck;

  return (

    <div className="card prediction-result-card">

      <div className="prediction-result-heading">

        <BrainCircuit size={22} />

        <h3>Prediction Result</h3>

      </div>

      <ScoreGauge
        score={score}
        threshold={threshold}
        flagged={flagged}
      />

      <div
        className={`prediction-classification ${
          flagged ? "prediction-flagged" : "prediction-clear"
        }`}
      >

        <ResultIcon size={22} />

        <strong>
          {flagged
            ? "High Risk — Flagged for Review"
            : "Below Risk Threshold"}
        </strong>

      </div>

      <div className="prediction-result-details">

        <div>
          <span>Machine learning model</span>
          <strong>{result.model}</strong>
        </div>

        <div>
          <span>Attrition risk score</span>
          <strong>{formatPercent(score)}</strong>
        </div>

        <div>
          <span>Decision threshold</span>
          <strong>{formatPercent(threshold, 0)}</strong>
        </div>

        <div>
          <span>Risk assessment</span>
          <strong>
            {flagged ? "Above Threshold" : "Below Threshold"}
          </strong>
        </div>

      </div>

      <div className="prediction-interpretation">

        <h4>What Does This Mean?</h4>

        <p>
          {flagged

            ? `This employee profile has an attrition risk score of ${formatPercent(score)}, meeting or exceeding the model's ${formatPercent(threshold, 0)} risk threshold. The profile is flagged for further review.`

            : `This employee profile has an attrition risk score of ${formatPercent(score)}, which is below the model's ${formatPercent(threshold, 0)} risk threshold. The profile is not flagged for review.`

          }
        </p>

        <p>
          A higher score indicates stronger patterns
          associated with attrition in the training data.
          It does not guarantee that an employee will resign.
        </p>

      </div>

      <div className="prediction-disclaimer">

        <Info size={20} />

        <div>

          <strong>Important limitation</strong>

          <p>
            The displayed percentage represents a model
            risk score, not the actual probability that
            an employee will leave the organisation.
          </p>

          <p>
            This educational prototype must not be used
            for hiring, termination, promotion,
            compensation or other employment decisions.
          </p>

        </div>

      </div>

    </div>
  );
}
