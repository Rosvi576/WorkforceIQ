
import { useEffect, useState } from "react";
import { Activity, CalendarDays } from "lucide-react";
import { checkHealth } from "../services/api";

export default function Header() {
  const [status, setStatus] = useState("Checking");

  useEffect(() => {
    const verifyBackend = async () => {
      try {
        const response = await checkHealth();

        setStatus(
          response.status === "healthy"
            ? "Connected"
            : "Offline"
        );
      } catch {
        setStatus("Offline");
      }
    };

    verifyBackend();

    const interval = setInterval(verifyBackend, 30000);

    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <header className="dashboard-header">

      <div className="header-title">
        <h3>Workforce Analytics</h3>
        <p>Intelligent workforce insights</p>
      </div>

      <div className="header-actions">

        <div className="header-date">
          <CalendarDays size={18} />
          <span>{today}</span>
        </div>

        <div className={`api-status ${status.toLowerCase()}`}>
          <Activity size={16} />
          <span>{status}</span>
        </div>

        <div className="profile-avatar">
          HR
        </div>

      </div>

    </header>
  );
}
