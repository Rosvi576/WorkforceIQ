
import { useState } from "react";

import {
  UserRound,
  Briefcase,
  Wallet,
  CalendarDays,
  Heart,
  BrainCircuit,
  RotateCcw,
  FlaskConical,
  LoaderCircle,
  AlertCircle,
  Info
} from "lucide-react";

import {
  employeeSections,
  allFields,
  emptyEmployee,
  sampleEmployeeA,
  sampleEmployeeB
} from "../data/employeeFields";

import { predictAttrition } from "../services/api";

import PredictionResult from "../components/PredictionResult";

const sectionIcons = {
  personal: UserRound,
  employment: Briefcase,
  compensation: Wallet,
  experience: CalendarDays,
  satisfaction: Heart
};

function EmployeeField({
  field,
  value,
  onChange,
  error,
  disabled
}) {

  return (

    <div className="employee-field">

      <label htmlFor={field.name}>
        {field.label}
        <span className="required-mark"> *</span>
      </label>

      {field.type === "select" ? (

        <select
          id={field.name}
          name={field.name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={error ? "invalid-field" : ""}
          aria-invalid={Boolean(error)}
          required
        >

          <option value="">
            Select {field.label}
          </option>

          {field.options.map((option) => (

            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>

          ))}

        </select>

      ) : (

        <input
          id={field.name}
          name={field.name}
          type="number"
          min={field.min}
          max={field.max}
          step="1"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className={error ? "invalid-field" : ""}
          aria-invalid={Boolean(error)}
          required
        />

      )}

      {error && (

        <span className="employee-field-error">
          {error}
        </span>

      )}

    </div>
  );
}

export default function Prediction() {

  const [formData, setFormData] = useState({
    ...emptyEmployee
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [response, setResponse] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [activeSample, setActiveSample] = useState("");

  const completedFields = allFields.filter(
    (field) =>
      formData[field.name] !== "" &&
      formData[field.name] !== null &&
      formData[field.name] !== undefined
  ).length;

  const completionPercentage =
    Math.round(
      (completedFields / allFields.length) * 100
    );

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: ""
    }));

    setResponse(null);
    setError("");
    setActiveSample("");

  };

  const loadSample = (sample, sampleName) => {

    setFormData({ ...sample });

    setFieldErrors({});
    setResponse(null);
    setError("");
    setActiveSample(sampleName);

  };

  const resetForm = () => {

    setFormData({ ...emptyEmployee });

    setFieldErrors({});
    setResponse(null);
    setError("");
    setActiveSample("");

  };

  const validateForm = () => {

    const errors = {};

    const payload = {};

    allFields.forEach((field) => {

      const value = formData[field.name];

      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {

        errors[field.name] = "This field is required.";
        return;

      }

      if (field.type === "number" || field.numeric) {

        const numericValue = Number(value);

        if (
          !Number.isFinite(numericValue) ||
          !Number.isInteger(numericValue)
        ) {

          errors[field.name] =
            "Enter a valid whole number.";

          return;

        }

        if (
          field.min !== undefined &&
          numericValue < field.min
        ) {

          errors[field.name] =
            `Minimum value is ${field.min}.`;

          return;

        }

        if (
          field.max !== undefined &&
          numericValue > field.max
        ) {

          errors[field.name] =
            `Maximum value is ${field.max}.`;

          return;

        }

        payload[field.name] = numericValue;

      } else {

        payload[field.name] = value;

      }

      if (field.type === "select") {

        const validOption = field.options.some(
          (option) =>
            String(option.value) === String(value)
        );

        if (!validOption) {

          errors[field.name] =
            "Select a valid option.";

        }

      }

    });

    // Cross-field consistency checks

    if (
      payload.YearsAtCompany >
      payload.TotalWorkingYears
    ) {

      errors.YearsAtCompany =
        "Cannot exceed total working years.";

    }

    if (
      payload.YearsInCurrentRole >
      payload.YearsAtCompany
    ) {

      errors.YearsInCurrentRole =
        "Cannot exceed years at company.";

    }

    if (
      payload.YearsSinceLastPromotion >
      payload.YearsAtCompany
    ) {

      errors.YearsSinceLastPromotion =
        "Cannot exceed years at company.";

    }

    if (
      payload.YearsWithCurrManager >
      payload.YearsAtCompany
    ) {

      errors.YearsWithCurrManager =
        "Cannot exceed years at company.";

    }

    if (
      payload.TotalWorkingYears >
      payload.Age
    ) {

      errors.TotalWorkingYears =
        "Cannot exceed employee age.";

    }

    setFieldErrors(errors);

    return {
      valid: Object.keys(errors).length === 0,
      payload
    };

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setResponse(null);

    const { valid, payload } = validateForm();

    if (!valid) {

      setError(
        "Please correct the highlighted fields before generating a prediction."
      );

      return;

    }

    setLoading(true);

    try {

      const data = await predictAttrition(payload);

      if (
        data.status !== "success" ||
        !data.result ||
        !Number.isFinite(data.result.attrition_score) ||
        data.result.attrition_score < 0 ||
        data.result.attrition_score > 1
      ) {

        throw new Error(
          "Unexpected prediction response."
        );

      }

      setResponse(data);

    } catch (requestError) {

      const detail =
        requestError.response?.data?.detail;

      if (Array.isArray(detail)) {

        const backendErrors = {};

        detail.forEach((item) => {

          const fieldName =
            item.loc?.[item.loc.length - 1];

          if (
            allFields.some(
              (field) => field.name === fieldName
            )
          ) {

            backendErrors[fieldName] = item.msg;

          }

        });

        setFieldErrors(backendErrors);

        setError(
          "The server rejected some employee details. Please check the highlighted fields."
        );

      } else if (typeof detail === "string") {

        setError(detail);

      } else if (!requestError.response) {

        setError(
          "Unable to complete the prediction request. Check that the backend is running and try again."
        );

      } else {

        setError(
          "Prediction failed. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="prediction-page">

      <h1 className="page-title">
        Employee Attrition Prediction
      </h1>

      <p className="page-description">
        Explore machine learning-based attrition
        classification using employee characteristics.
      </p>

      <div className="prediction-demo-toolbar">

        <div className="prediction-demo-heading">

          <FlaskConical size={21} />

          <div>

            <strong>Demonstration Profiles</strong>

            <p>
              Load a sample profile or enter
              employee details manually.
            </p>

          </div>

        </div>

        <div className="prediction-demo-buttons">

          <button
            type="button"
            className={`sample-button ${
              activeSample === "A" ? "sample-active" : ""
            }`}
            disabled={loading}
            onClick={() =>
              loadSample(sampleEmployeeA, "A")
            }
          >
            Load Sample A
          </button>

          <button
            type="button"
            className={`sample-button ${
              activeSample === "B" ? "sample-active" : ""
            }`}
            disabled={loading}
            onClick={() =>
              loadSample(sampleEmployeeB, "B")
            }
          >
            Load Sample B
          </button>

          <button
            type="button"
            className="sample-button"
            disabled={loading}
            onClick={resetForm}
          >

            <RotateCcw size={15} />
            Reset

          </button>

        </div>

      </div>

      <div className="prediction-layout">

        <form
          className="prediction-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="card form-progress-card">

            <div className="form-progress-heading">

              <strong>Form Completion</strong>

              <span>
                {completedFields}/{allFields.length}
                {" "}fields
              </span>

            </div>

            <div
              className="form-progress-track"
              role="progressbar"
              aria-label="Form completion"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >

              <div
                className="form-progress-fill"
                style={{
                  width: `${completionPercentage}%`
                }}
              />

            </div>

            <p>
              {completionPercentage}% filled.
              All fields are required.
            </p>

          </div>

          {employeeSections.map((section) => {

            const SectionIcon =
              sectionIcons[section.icon];

            return (

              <div
                className="card employee-form-section"
                key={section.title}
              >

                <div className="employee-section-heading">

                  <div className="employee-section-icon">
                    <SectionIcon size={22} />
                  </div>

                  <div>

                    <h3>{section.title}</h3>

                    <p>{section.description}</p>

                  </div>

                </div>

                <div className="employee-fields-grid">

                  {section.fields.map((field) => (

                    <EmployeeField
                      key={field.name}
                      field={field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={fieldErrors[field.name]}
                      disabled={loading}
                    />

                  ))}

                </div>

              </div>

            );

          })}

          {error && (

            <div
              className="prediction-error"
              role="alert"
            >

              <AlertCircle size={20} />

              <span>{error}</span>

            </div>

          )}

          <button
            type="submit"
            className="generate-prediction-button"
            disabled={loading}
          >

            {loading ? (

              <>

                <LoaderCircle
                  size={22}
                  className="prediction-spinner"
                />

                Generating Prediction...

              </>

            ) : (

              <>

                <BrainCircuit size={22} />

                Generate Prediction

              </>

            )}

          </button>

          <div className="prediction-form-note">

            <Info size={18} />

            <p>
              Use demonstration or synthetic employee
              information only. This model was trained
              on an educational HR dataset and is not
              validated for real-world employment decisions.
            </p>

          </div>

        </form>

        <aside
          className="prediction-result-column"
          aria-live="polite"
        >

          <PredictionResult response={response} />

        </aside>

      </div>

    </div>
  );
}
