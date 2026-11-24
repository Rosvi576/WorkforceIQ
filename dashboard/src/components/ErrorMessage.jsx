
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorMessage({
  message = "Unable to load data.",
  onRetry
}) {
  return (
    <div className="error-container">

      <AlertCircle size={36} />

      <h3>Something went wrong</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          className="retry-button"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}

    </div>
  );
}
