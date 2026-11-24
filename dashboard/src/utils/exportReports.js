
function downloadFile(content, filename, mimeType) {

  const blob = new Blob(
    [content],
    { type: mimeType }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

}


function escapeCSV(value) {

  let text = String(value ?? "");

  // Prevent spreadsheet formula injection.
  if (
    typeof value === "string" &&
    /^[\s]*[=+\-@]/.test(text)
  ) {

    text = "'" + text;

  }

  return `"${text.replace(/"/g, '""')}"`;

}


function getDateStamp() {

  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


export function exportCSV(rows, filename) {

  if (!Array.isArray(rows) || rows.length === 0) {

    throw new Error("No report data available.");

  }

  const headers = [
    ...new Set(
      rows.flatMap((row) => Object.keys(row))
    )
  ];

  const csv = [

    headers.map(escapeCSV).join(","),

    ...rows.map((row) =>

      headers
        .map((header) => escapeCSV(row[header]))
        .join(",")

    )

  ].join("\r\n");

  downloadFile(

    "\uFEFF" + csv,

    `${filename}_${getDateStamp()}.csv`,

    "text/csv;charset=utf-8;"

  );

}


export function exportJSON(data, filename) {

  downloadFile(

    JSON.stringify(data, null, 2),

    `${filename}_${getDateStamp()}.json`,

    "application/json;charset=utf-8;"

  );

}


export function printReport() {

  window.print();

}
