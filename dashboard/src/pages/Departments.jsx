import ReportActions from "../components/ReportActions";

import { useEffect, useState } from "react";

import {
  Building2,
  TrendingUp,
  Users,
  Info
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";

import { getDepartmentAnalytics } from "../services/api";

import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Departments() {

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {

    setLoading(true);
    setError("");

    try {
      const data = await getDepartmentAnalytics();
      setDepartments(data);
    } catch {
      setError("Unable to load department analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading message="Loading department analytics..." />;
  }

  if (error || departments.length === 0) {
    return (
      <ErrorMessage
        message={error || "No department data available."}
        onRetry={fetchData}
      />
    );
  }

  const highestAttrition = departments.reduce(
    (a, b) => a.attrition_rate > b.attrition_rate ? a : b
  );

  const largestDepartment = departments.reduce(
    (a, b) => a.total_employees > b.total_employees ? a : b
  );

  const mostDepartures = departments.reduce(
    (a, b) => a.employees_left > b.employees_left ? a : b
  );

  const chartData = departments.map((item) => ({
    ...item,
    shortName:
      item.department === "Research & Development"
        ? "R&D"
        : item.department === "Human Resources"
        ? "HR"
        : item.department
  }));

  return (
    <div className="departments-page">

      <h1 className="page-title">
        Department Analytics
      </h1>

      <p className="page-description">
        Compare workforce distribution, employee
        retention and attrition across departments.
      </p>

      <ReportActions
        csvReports={[
          {
            label: "Department Analytics",
            filename: "department_analytics",
            rows: departments
          }
        ]}
        jsonData={departments}
        filename="department_analytics"
      />


      {/* Department summary */}

      <div className="secondary-stats-grid">

        <StatCard
          title="Total Departments"
          value={departments.length}
          icon={Building2}
          description="Organizational departments"
        />

        <StatCard
          title="Highest Attrition"
          value={`${highestAttrition.attrition_rate}%`}
          icon={TrendingUp}
          description={highestAttrition.department}
          accent
        />

        <StatCard
          title="Largest Department"
          value={largestDepartment.total_employees.toLocaleString()}
          icon={Users}
          description={largestDepartment.department}
        />

      </div>

      {/* Department charts */}

      <div className="overview-charts">

        <div className="card chart-card">

          <h3>Workforce Distribution</h3>

          <p className="chart-description">
            Retained employees and recorded departures
          </p>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#EADFD2"
              />

              <XAxis
                dataKey="shortName"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="employees_retained"
                name="Retained"
                stackId="workforce"
                fill="#795440"
                maxBarSize={75}
              />

              <Bar
                dataKey="employees_left"
                name="Left"
                stackId="workforce"
                fill="#B65C45"
                radius={[6, 6, 0, 0]}
                maxBarSize={75}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="card chart-card">

          <h3>Attrition Rate Comparison</h3>

          <p className="chart-description">
            Percentage of employees who left each department
          </p>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart
              data={chartData}
              margin={{ top: 25, right: 10, bottom: 5, left: 0 }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#EADFD2"
              />

              <XAxis
                dataKey="shortName"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, "auto"]}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Attrition Rate"
                ]}
              />

              <Bar
                dataKey="attrition_rate"
                fill="#B65C45"
                radius={[8, 8, 0, 0]}
                maxBarSize={75}
              >

                <LabelList
                  dataKey="attrition_rate"
                  position="top"
                  formatter={(value) => `${value}%`}
                  fill="#795440"
                  fontSize={12}
                />

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Detailed department table */}

      <div className="card department-table-card">

        <h3>Detailed Department Comparison</h3>

        <p className="chart-description">
          Workforce statistics across all departments
        </p>

        <div className="table-wrapper">

          <table className="analytics-table">

            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
                <th>Retained</th>
                <th>Left</th>
                <th>Attrition</th>
                <th>Retention</th>
                <th>Avg. Income</th>
                <th>Job Satisfaction</th>
              </tr>
            </thead>

            <tbody>

              {departments.map((item) => (

                <tr key={item.department}>

                  <td className="department-name">
                    {item.department}
                  </td>

                  <td>{item.total_employees}</td>

                  <td>{item.employees_retained}</td>

                  <td>{item.employees_left}</td>

                  <td className="attrition-value">
                    {item.attrition_rate}%
                  </td>

                  <td>{item.retention_rate}%</td>

                  <td>
                    {item.average_monthly_income.toLocaleString()}
                  </td>

                  <td>
                    {item.average_job_satisfaction.toFixed(2)}/4
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Dynamic workforce insights */}

      <h2 className="section-title">
        Key Department Insights
      </h2>

      <div className="department-insights">

        <div className="card insight-card">

          <TrendingUp size={24} />

          <h3>Highest Attrition Rate</h3>

          <p>
            {highestAttrition.department} has the
            highest observed attrition rate at{" "}
            <strong>
              {highestAttrition.attrition_rate}%
            </strong>.
          </p>

        </div>

        <div className="card insight-card">

          <Users size={24} />

          <h3>Highest Departure Count</h3>

          <p>
            {mostDepartures.department} recorded{" "}
            <strong>
              {mostDepartures.employees_left} departures
            </strong>, the highest absolute count.
          </p>

        </div>

      </div>

      <div className="analytics-note">

        <Info size={20} />

        <div>

          <strong>Interpretation note</strong>

          <p>
            Department sizes differ considerably.
            Compare departure counts alongside attrition
            percentages. These descriptive statistics
            do not establish the causes of employee
            attrition and should not be used for
            individual employment decisions.
          </p>

        </div>

      </div>

    </div>
  );
}
