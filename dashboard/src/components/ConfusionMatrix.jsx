
export default function ConfusionMatrix({
  matrix,
  threshold
}) {

  const cells = [

    {
      label: "True Negative",
      abbreviation: "TN",
      value: matrix.tn,
      description: "Correctly classified retained",
      className: "matrix-correct"
    },

    {
      label: "False Positive",
      abbreviation: "FP",
      value: matrix.fp,
      description: "Incorrectly flagged",
      className: "matrix-incorrect"
    },

    {
      label: "False Negative",
      abbreviation: "FN",
      value: matrix.fn,
      description: "Missed attrition",
      className: "matrix-incorrect"
    },

    {
      label: "True Positive",
      abbreviation: "TP",
      value: matrix.tp,
      description: "Correctly flagged attrition",
      className: "matrix-correct"
    }

  ];

  const total =
    matrix.tn +
    matrix.fp +
    matrix.fn +
    matrix.tp;

  return (

    <div className="card confusion-matrix-card">

      <h3>Confusion Matrix</h3>

      <p className="chart-description">
        Test classifications at threshold{" "}
        {threshold.toFixed(2)}
      </p>

      <div className="matrix-axis-title">
        Predicted Class
      </div>

      <div className="confusion-matrix-grid">

        <div />

        <div className="matrix-column-label">
          Retained (0)
        </div>

        <div className="matrix-column-label">
          Attrition (1)
        </div>

        <div className="matrix-row-label">
          Actual Retained (0)
        </div>

        {cells.slice(0, 2).map((cell) => (

          <div
            key={cell.abbreviation}
            className={`matrix-cell ${cell.className}`}
          >

            <span>{cell.abbreviation}</span>

            <strong>{cell.value}</strong>

            <p>{cell.label}</p>

            <small>{cell.description}</small>

          </div>

        ))}

        <div className="matrix-row-label">
          Actual Attrition (1)
        </div>

        {cells.slice(2).map((cell) => (

          <div
            key={cell.abbreviation}
            className={`matrix-cell ${cell.className}`}
          >

            <span>{cell.abbreviation}</span>

            <strong>{cell.value}</strong>

            <p>{cell.label}</p>

            <small>{cell.description}</small>

          </div>

        ))}

      </div>

      <div className="matrix-summary">

        <div>
          <span>Test samples</span>
          <strong>{total}</strong>
        </div>

        <div>
          <span>Correct classifications</span>
          <strong>{matrix.tn + matrix.tp}</strong>
        </div>

        <div>
          <span>Incorrect classifications</span>
          <strong>{matrix.fp + matrix.fn}</strong>
        </div>

      </div>

    </div>
  );
}
