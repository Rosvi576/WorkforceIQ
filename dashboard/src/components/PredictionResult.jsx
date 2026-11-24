
import {
  BrainCircuit,
  Info,
  ShieldCheck,
  AlertTriangle,
  Activity
} from "lucide-react";

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
        aria-label={`Model score ${score.toFixed(4)}, threshold ${threshold}`}
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
          fill="#493327"
        >
          {score.toFixed(4)}
        </text>

        <text
          x="130"
          y="125"
          textAnchor="middle"
          fontSize="12"
          fill="#856B59"
        >
          Attrition model score
        </text>

        <text
          x="35"
          y="150"
          textAnchor="middle"
          fontSize="11"
          fill="#856B59"
        >
          0.0
        </text>

        <text
          x="225"
          y="150"
          textAnchor="middle"
          fontSize="11"
          fill="#856B59"
        >
          1.0
        </text>

      </svg>

      <p className="gauge-caption">
        Decision threshold: {threshold.toFixed(2)}
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
            the machine learning result.
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
          {result.classification}
        </strong>

      </div>

      <div className="prediction-result-details">

        <div>
          <span>Machine learning model</span>
          <strong>{result.model}</strong>
        </div>

        <div>
          <span>Model score</span>
          <strong>{score.toFixed(4)}</strong>
        </div>

        <div>
          <span>Decision threshold</span>
          <strong>{threshold.toFixed(2)}</strong>
        </div>

        <div>
          <span>Predicted class</span>
          <strong>{result.prediction}</strong>
        </div>

      </div>

      <div className="prediction-interpretation">

        <h4>Result Interpretation</h4>

        <p>

          {flagged

            ? `The model score meets or exceeds the ${threshold.toFixed(2)} decision threshold. The model assigns this sample to the positive attrition class.`

            : `The model score is below the ${threshold.toFixed(2)} decision threshold. The model assigns this sample to the negative attrition class.`

          }

        </p>

        <p>
          This classification does not establish
          whether an employee will actually resign.
        </p>

      </div>

      <div className="prediction-disclaimer">

        <Info size={20} />

        <div>

          <strong>Important limitation</strong>

          <p>
            {response.disclaimer ||
              "Educational prototype. The model score is not a calibrated probability of resignation."}
          </p>

          <p>
            Do not use this output for hiring,
            termination, promotion, compensation
            or other employment decisions.
          </p>

        </div>

      </div>

    </div>
  );
}
