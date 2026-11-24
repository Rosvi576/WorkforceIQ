
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Header />

        <main className="dashboard-content">
          <Outlet />
        </main>

        <footer className="dashboard-footer">
          WorkforceIQ © 2026 | ML-Based Workforce Analytics
        </footer>

      </div>

    </div>
  );
}
