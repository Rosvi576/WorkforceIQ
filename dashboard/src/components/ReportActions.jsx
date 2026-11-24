
import { useState } from "react";

import {
  Download,
  Printer,
  FileJson,
  AlertCircle
} from "lucide-react";

import {
  exportCSV,
  exportJSON,
  printReport
} from "../utils/exportReports";


export default function ReportActions({

  csvReports = [],

  jsonData = null,

  filename = "workforceiq_report"

}) {

  const [error, setError] = useState("");

  const [selectedReport, setSelectedReport] =
    useState(0);


  function handleCSV() {

    setError("");

    try {

      const report = csvReports[selectedReport];

      if (!report) {

        throw new Error(
          "No CSV report available."
        );

      }

      exportCSV(
        report.rows,
        report.filename
      );

    } catch (err) {

      setError(err.message);

    }

  }


  function handleJSON() {

    setError("");

    try {

      exportJSON({

        application: "WorkforceIQ",

        exported_at: new Date().toISOString(),

        disclaimer:
          "Educational prototype. Not for employment decisions.",

        data: jsonData

      }, filename);

    } catch (err) {

      setError(err.message);

    }

  }


  return (

    <div className="report-actions no-print">

      <div className="report-actions-heading">

        <Download size={21} />

        <div>

          <h3>Export Reports</h3>

          <p>
            Download analytics for offline review.
          </p>

        </div>

      </div>

      <div className="report-actions-buttons">

        {csvReports.length > 0 && (

          <>

            <select

              aria-label="Select report to export"

              value={selectedReport}

              onChange={(event) =>

                setSelectedReport(
                  Number(event.target.value)
                )

              }

            >

              {csvReports.map((report, index) => (

                <option
                  key={report.filename}
                  value={index}
                >

                  {report.label}

                </option>

              ))}

            </select>

            <button
              type="button"
              onClick={handleCSV}
            >

              <Download size={16} />

              CSV

            </button>

          </>

        )}

        {jsonData !== null && (

          <button
            type="button"
            onClick={handleJSON}
          >

            <FileJson size={16} />

            JSON

          </button>

        )}

        <button
          type="button"
          onClick={printReport}
        >

          <Printer size={16} />

          Print / PDF

        </button>

      </div>

      {error && (

        <div
          className="report-export-error"
          role="alert"
        >

          <AlertCircle size={16} />

          {error}

        </div>

      )}

    </div>

  );

}
