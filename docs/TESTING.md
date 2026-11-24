# WorkforceIQ — Testing Documentation

## Automated Testing Framework

- Pytest
- FastAPI TestClient
- HTTPX

## Recorded Test Results

Date: November 24, 2026

| Category | Passed |
|---|---:|
| API availability | 4/4 |
| Workforce analytics | 3/3 |
| Department analytics | 4/4 |
| Risk factor analytics | 8/8 |
| Model prediction | 6/6 |
| Input validation | 14/14 |
| Model insights | 8/8 |
| CORS configuration | 1/1 |
| Total | 48/48 |

- Failed: 0
- Pass rate: 100%
- Execution time: 2.59 seconds
- Warnings: 1 dependency deprecation warning

## Running Tests

From the project root:

```bash
source .venv/bin/activate
python -m pytest tests/test_api.py -v
```

## Generating XML Report

```bash
python -m pytest tests/test_api.py -v \
--junitxml=reports/test_results.xml
```

## Prediction Verification

| Profile | Score | Classification |
|---|---:|---|
| Sample A | 0.9014 | Flagged for Review |
| Sample B | 0.0516 | Not Flagged |

## Verified Manual Checks

- Backend health endpoint
- Backend unavailable error handling
- Backend connection recovery
- Sample A and B frontend predictions
- Workforce CSV export
- Department CSV export
- Overview JSON export
- Production build
- Production preview startup

## Remaining Manual Verification

- Responsive layouts across screen sizes
- Complete frontend input validation
- All remaining report exports
- Print and PDF layout
- Model Insights interactive controls
- Navigation across all production pages

## Production Build

The latest recorded production build:

- Build status: Successful
- Build time: 524 milliseconds
- Modules transformed: 2818
- Bundle size warnings: None

## Testing Limitations

The automated tests validate application functionality,
API contracts, input validation, numerical consistency,
and prediction reproducibility.

Passing these tests does not establish real-world
predictive validity, fairness, or production security.
