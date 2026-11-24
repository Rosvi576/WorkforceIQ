
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  ChartBar,
  BrainCircuit,
  ChartLine,
  Info,
  UsersRound
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    path: "/",
    icon: LayoutDashboard
  },
  {
    name: "Departments",
    path: "/departments",
    icon: Building2
  },
  {
    name: "Risk Factors",
    path: "/risk-factors",
    icon: ChartBar
  },
  {
    name: "Prediction",
    path: "/prediction",
    icon: BrainCircuit
  },
  {
    name: "Model Insights",
    path: "/model-insights",
    icon: ChartLine
  },
  {
    name: "About Project",
    path: "/about",
    icon: Info
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">
          <UsersRound size={26} />
        </div>

        <div>
          <h2>WorkforceIQ</h2>
          <p>People Analytics</p>
        </div>
      </div>

      <div className="navigation-label">
        WORKSPACE
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">
          <BrainCircuit size={20} />

          <div>
            <strong>ML Analytics</strong>
            <p>Version 1.0.0</p>
          </div>
        </div>

        <p className="prototype-label">
          Educational Prototype
        </p>
      </div>

    </aside>
  );
}
