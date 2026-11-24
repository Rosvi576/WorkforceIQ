
import { LoaderCircle } from "lucide-react";

export default function Loading({
  message = "Loading workforce analytics..."
}) {
  return (
    <div className="loading-container">

      <LoaderCircle
        size={36}
        className="loading-spinner"
      />

      <p>{message}</p>

    </div>
  );
}
