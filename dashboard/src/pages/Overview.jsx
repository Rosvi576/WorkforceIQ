import ReportActions from "../components/ReportActions";

import { useEffect, useState } from "react";

import {
  Users,
  TrendingUp,
  UserCheck,
  UserMinus,
  CalendarDays,
  Wallet,
  BriefcaseBusiness,
  Info
} from "lucide-react";

import {
  PieChart,
  Pie,
  Label,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import {
  getWorkforceOverview,
  getDepartmentAnalytics
} from "../services/api";

import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const COLORS = ["#795440", "#B65C45"];

export default function Overview() {

  const [overview, setOverview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {

    setLoading(true);
    setError("");

    try {

      const [overviewData, departmentData] =
        await Promise.all([
          getWorkforceOverview(),
          getDepartmentAnalytics()
        ]);

      setOverview(overviewData);
      setDepartments(departmentData);

    } catch {

      setError(
        "Unable to connect to the analytics API. Please check whether the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !overview) {
    return (
      <ErrorMessage
        message={error || "No workforce data available."}
        onRetry={fetchData}
      />
    );
  }

  const distribution = [
    {
      name: "Retained",
      value: overview.employees_retained
    },
    {
      name: "Left",
      value: overview.employees_left
    }
  ];

  const departmentChart = departments.map((item) => ({
    ...item,
    shortName:
      item.department === "Research & Development"
        ? "R&D"
        : item.department === "Human Resources"
        ? "HR"
        : item.department
  }));

  return (
    <div className="overview-page">

      <h1 className="page-title">
        Workforce Overview
      </h1>

      <p className="page-description">
        Explore employee retention, attrition patterns
        and workforce statistics.
      </p>

      <ReportActions
        csvReports={[
          {
            label: "Workforce Summary",
            filename: "workforce_summary",
            rows: [overview]
          },
          {
            label: "Department Statistics",
            filename: "department_statistics",
            rows: departments
          }
        ]}
        jsonData={{ overview, departments }}
        filename="workforce_overview"
      />


      {/* Primary KPI cards */}

      <div className="stats-grid">

        <StatCard
          title="Total Employees"
          value={overview.total_employees.toLocaleString()}
          icon={Users}
          description="Dataset population"
        />

        <StatCard
          title="Attrition Rate"
          value={`${overview.attrition_rate}%`}
          icon={TrendingUp}
          description="Observed employee attrition"
          accent
        />

        <StatCard
          title="Employees Retained"
          value={overview.employees_retained.toLocaleString()}
          icon={UserCheck}
          description={`${overview.retention_rate}% retention`}
        />

        <StatCard
          title="Employees Left"
          value={overview.employees_left.toLocaleString()}
          icon={UserMinus}
          description="Recorded employee departures"
        />

      </div>

      {/* Analytics charts */}

      <div className="overview-charts">

        <div className="card chart-card">

          <h3>Employee Distribution</h3>

          <p className="chart-description">
            Retained employees versus departures
          </p>

          <ResponsiveContainer width="100%" height={290}>

            <PieChart>

              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}
              >

                {distribution.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}

              
                <Label
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox || {};

                    if (cx == null || cy == null) {
                      return null;
                    }

                    return (
                      <g className="donut-center-label">
                        <text
                          x={cx}
                          y={cy - 5}
                          textAnchor="middle"
                          fill="#493327"
                          fontSize={28}
                          fontWeight={700}
                        >
                          {overview.total_employees.toLocaleString()}
                        </text>

                        <text
                          x={cx}
                          y={cy + 17}
                          textAnchor="middle"
                          fill="#856B59"
                          fontSize={11}
                        >
                          Total Employees
                        </text>
                      </g>
                    );
                  }}
                />

              </Pie>

              <Tooltip />

              <Legend verticalAlign="bottom" />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="card chart-card">

          <h3>Department Attrition</h3>

          <p className="chart-description">
            Observed attrition percentage by department
          </p>

          <ResponsiveContainer width="100%" height={290}>

            <BarChart data={departmentChart}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#EADFD2"
              />

              <XAxis
                dataKey="shortName"
                tick={{ fill: "#856B59", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 25]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "#856B59", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Attrition Rate"
                ]}
                labelFormatter={(label) =>
                  departmentChart.find(
                    (item) => item.shortName === label
                  )?.department || label
                }
              />

              <Bar
                dataKey="attrition_rate"
                fill="#B65C45"
                radius={[8, 8, 0, 0]}
                maxBarSize={65}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Secondary workforce metrics */}

      <h2 className="section-title">
        Workforce Demographics
      </h2>

      <div className="secondary-stats-grid">

        <StatCard
          title="Average Age"
          value={overview.average_age}
          icon={CalendarDays}
          description="Years"
        />

        <StatCard
          title="Average Monthly Income"
          value={overview.average_monthly_income.toLocaleString()}
          icon={Wallet}
          description="Dataset income units"
        />

        <StatCard
          title="Average Tenure"
          value={`${overview.average_years_at_company} yrs`}
          icon={BriefcaseBusiness}
          description="Average years at company"
        />

      </div>

      {/* Responsible analytics disclaimer */}

      <div className="analytics-note">

        <Info size={20} />

        <div>
          <strong>About this data</strong>

          <p>
            Analytics are based on the IBM HR Employee
            Attrition dataset, covering{" "}
            {overview.total_employees.toLocaleString()} employees
            across {overview.total_departments} departments
            and {overview.total_job_roles} job roles.
            These statistics represent observed dataset
            proportions, not annual attrition forecasts.
            This educational prototype is not intended
            for employment decisions.
          </p>
        </div>

      </div>

    </div>
  );
}
