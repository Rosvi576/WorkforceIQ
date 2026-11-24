# WorkforceIQ — Model Card

## Model Information

- Model: Logistic Regression
- Task: Binary classification
- Framework: Scikit-learn
- Artifact: models/refined_model.pkl
- Selected threshold: 0.75
- Input features: 30
- Encoded features: 51

## Intended Use

Educational demonstration of machine learning,
employee attrition analysis, model evaluation,
and explainable AI.

Not intended for real employment decisions.

## Training Data

- Dataset: IBM HR Analytics Employee Attrition
- Total records: 1470
- Training records: 1176
- Testing records: 294
- Positive records: 237
- Negative records: 1233
- Split: Stratified 80:20
- Random state: 42

## Training Methodology

- One-hot encoding
- Numerical standardization
- Class-weighted Logistic Regression
- Five-fold stratified cross-validation
- Fold-specific preprocessing
- Average precision-based model selection
- Out-of-fold threshold comparison

## Refined Cross-Validation Results

| Model | Average Precision | ROC-AUC |
|---|---:|---:|
| Logistic Regression | 0.6058 | 0.8273 |
| XGBoost | 0.5886 | 0.8007 |
| Random Forest | 0.5611 | 0.8076 |

## Test Set Performance

| Metric | Threshold 0.50 | Threshold 0.75 |
|---|---:|---:|
| Accuracy | 75.17% | 85.03% |
| Precision | 34.88% | 54.29% |
| Recall | 63.83% | 40.43% |
| F1 Score | 45.11% | 46.34% |
| ROC-AUC | 0.8032 | 0.8032 |
| Average Precision | 0.5612 | 0.5612 |

## Confusion Matrix

Selected threshold: 0.75

| Actual / Predicted | Negative | Positive |
|---|---:|---:|
| Negative | 231 | 16 |
| Positive | 28 | 19 |

## Baseline Comparison

Majority-class test accuracy: 84.01%.

The selected model achieves 85.03% accuracy but
identifies only 40.43% of positive test cases.

Accuracy alone is not an adequate performance measure.

## Explainability

The project implements:

- Logistic Regression coefficient analysis
- Cross-validation permutation importance

Leading permutation importance features:

| Feature | Mean Importance |
|---|---:|
| OverTime | 0.1479 |
| JobRole | 0.1151 |
| TotalWorkingYears | 0.1040 |
| BusinessTravel | 0.0533 |
| YearsWithCurrManager | 0.0533 |

These results describe predictive contributions,
not causal relationships.

## Known Limitations

- Limited dataset size and representativeness.
- Imbalanced target distribution.
- Low recall at the selected threshold.
- Model scores are not calibrated probabilities.
- Threshold selection and training F1 estimation
  use the same out-of-fold predictions.
- The test set has been examined during earlier evaluation.
- Independent external validation is unavailable.
- Gender and marital status are included as features.
- Formal fairness assessment has not been completed.
- Model drift monitoring is not implemented.

## Responsible Use

The model must not be used for hiring, termination,
promotion, compensation, or employee surveillance.

## Future Improvements

- Independent external validation
- Probability calibration
- Fairness assessment
- Cost-sensitive threshold selection
- Model drift monitoring
