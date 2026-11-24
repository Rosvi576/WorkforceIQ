import ReportActions from "../components/ReportActions";

import { useEffect, useState } from "react";

import {
  Clock,
  Briefcase,
  TrendingUp,
  Lightbulb,
  Info,
  Plane,
  Scale,
  Heart
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";

import { getRiskFactorAnalytics } from "../services/api";

import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const satisfactionLabels = {
  "1": "Low",
  "2": "Medium",
  "3": "High",
  "4": "Very High"
};

const balanceLabels = {
  "1": "Bad",
  "2": "Good",
  "3": "Better",
  "4": "Best"
};

const travelLabels = {
  "Travel_Frequently": "Frequently",
  "Travel_Rarely": "Rarely",
  "Non-Travel": "No Travel"
};

const roleLabels = {
  "Sales Representative": "Sales Rep.",
  "Laboratory Technician": "Lab Technician",
  "Human Resources": "HR",
  "Sales Executive": "Sales Executive",
  "Research Scientist": "Research Scientist",
  "Manufacturing Director": "Mfg. Director",
  "Healthcare Representative": "Healthcare Rep.",
  "Manager": "Manager",
  "Research Director": "Research Director"
};

function formatChartData(data, labels = {}, ordinal = false) {

  const items = [...data];

  if (ordinal) {
    items.sort(
      (a, b) => Number(a.category) - Number(b.category)
    );
  }

  return items.map((item) => ({
    ...item,
    label: labels[item.category] || item.category
  }));
}

function RiskTooltip({ active, payload }) {

  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="risk-tooltip">

      <strong>{item.label}</strong>

      <p>
        Total employees: {item.total_employees}
      </p>

      <p>
        Employees retained: {item.employees_retained}
      </p>

      <p>
        Employees left: {item.employees_left}
      </p>

      <p className="risk-tooltip-rate">
        Attrition rate: {item.attrition_rate.toFixed(2)}%
      </p>

    </div>
  );
}

function RiskChart({
  title,
  description,
  data,
  labels = {},
  ordinal = false,
  height = 270,
  wide = false
}) {

  const chartData = formatChartData(
    data,
    labels,
    ordinal
  );

  return (
    <div
      className={`card risk-chart-card ${wide ? "risk-chart-wide" : ""}`}
    >

      <h3>{title}</h3>

      <p className="chart-description">
        {description}
      </p>

      <ResponsiveContainer
        width="100%"
        height={height}
      >

        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 10,
            right: 48,
            bottom: 5,
            left: 5
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#EADFD2"
          />

          <XAxis
            type="number"
            domain={[0, 50]}
            tickFormatter={(value) => `${value}%`}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#856B59"
            }}
          />

          <YAxis
            type="category"
            dataKey="label"
            width={wide ? 140 : 90}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#795440"
            }}
          />

          <Tooltip
            content={<RiskTooltip />}
            cursor={{ fill: "#F3E4D8" }}
          />

          <Bar
            dataKey="attrition_rate"
            radius={[0, 6, 6, 0]}
            maxBarSize={28}
          >

            {chartData.map((item) => (

              <Cell
                key={item.category}
                fill={
                  item.attrition_rate >= 25
                    ? "#B65C45"
                    : item.attrition_rate >= 15
                    ? "#C58C6D"
                    : "#795440"
                }
              />

            ))}

            <LabelList
              dataKey="attrition_rate"
              position="right"
              formatter={(value) => `${value.toFixed(2)}%`}
              fill="#795440"
              fontSize={11}
            />

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default function RiskFactors() {

  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {

    setLoading(true);
    setError("");

    try {

      const data = await getRiskFactorAnalytics();

      const requiredGroups = [
        "overtime",
        "job_role",
        "job_satisfaction",
        "business_travel",
        "work_life_balance",
        "environment_satisfaction"
      ];

      const valid = requiredGroups.every(
        (group) =>
          Array.isArray(data?.[group]) &&
          data[group].length > 0
      );

      if (!valid) {
        throw new Error("Incomplete risk factor data.");
      }

      setRiskData(data);

    } catch {

      setError("Unable to load risk factor analytics.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Loading message="Analyzing workforce risk factors..." />
    );
  }

  if (error || !riskData) {
    return (
      <ErrorMessage
        message={error || "No risk factor data available."}
        onRetry={fetchData}
      />
    );
  }

  const overtimeYes = riskData.overtime.find(
    (item) => item.category === "Yes"
  );

  const overtimeNo = riskData.overtime.find(
    (item) => item.category === "No"
  );

  const overtimeRatio =
    overtimeYes && overtimeNo?.attrition_rate > 0
      ? overtimeYes.attrition_rate / overtimeNo.attrition_rate
      : null;

  const highestRole = riskData.job_role.reduce(
    (a, b) => a.attrition_rate > b.attrition_rate ? a : b
  );

  const highestTravel = riskData.business_travel.reduce(
    (a, b) => a.attrition_rate > b.attrition_rate ? a : b
  );

  const highestBalance = riskData.work_life_balance.reduce(
    (a, b) => a.attrition_rate > b.attrition_rate ? a : b
  );

  const highestEnvironment =
    riskData.environment_satisfaction.reduce(
      (a, b) => a.attrition_rate > b.attrition_rate ? a : b
    );

  return (
    <div className="risk-factors-page">

      <h1 className="page-title">
        Risk Factor Analytics
      </h1>

      <p className="page-description">
        Explore workforce characteristics associated
        with employee attrition.
      </p>

      <ReportActions
        csvReports={Object.entries(riskData)
          .filter(([, rows]) => Array.isArray(rows))
          .map(([key, rows]) => ({
            label: key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            filename: `risk_factor_${key}`,
            rows
          }))}
        jsonData={riskData}
        filename="risk_factor_analytics"
      />


      {/* Summary cards */}

      <div className="secondary-stats-grid">

        <StatCard
          title="Overtime Attrition"
          value={
            overtimeYes
              ? `${overtimeYes.attrition_rate.toFixed(2)}%`
              : "N/A"
          }
          icon={Clock}
          description="Employees working overtime"
          accent
        />

        <StatCard
          title="Highest Job Role Attrition"
          value={`${highestRole.attrition_rate.toFixed(2)}%`}
          icon={Briefcase}
          description={highestRole.category}
          accent
        />

        <StatCard
          title="Overtime Rate Ratio"
          value={
            overtimeRatio !== null
              ? `${overtimeRatio.toFixed(2)}x`
              : "N/A"
          }
          icon={TrendingUp}
          description="Compared to non-overtime employees"
        />

      </div>

      {/* Chart color guide */}

      <div className="risk-color-guide">

        <span>Observed attrition rate:</span>

        <div>
          <span className="risk-dot risk-dot-low" />
          Below 15%
        </div>

        <div>
          <span className="risk-dot risk-dot-medium" />
          15% to below 25%
        </div>

        <div>
          <span className="risk-dot risk-dot-high" />
          25% and above
        </div>

      </div>

      {/* Six analytics charts */}

      <div className="risk-charts-grid">

        <RiskChart
          title="Overtime"
          description="Attrition among overtime and non-overtime employees"
          data={riskData.overtime}
          height={230}
        />

        <RiskChart
          title="Business Travel"
          description="Attrition across business travel frequencies"
          data={riskData.business_travel}
          labels={travelLabels}
          height={230}
        />

        <RiskChart
          title="Job Role"
          description="Observed attrition rates across nine job roles"
          data={riskData.job_role}
          labels={roleLabels}
          height={380}
          wide
        />

        <RiskChart
          title="Job Satisfaction"
          description="Attrition across employee satisfaction levels"
          data={riskData.job_satisfaction}
          labels={satisfactionLabels}
          ordinal
        />

        <RiskChart
          title="Work-Life Balance"
          description="Attrition across work-life balance ratings"
          data={riskData.work_life_balance}
          labels={balanceLabels}
          ordinal
        />

        <RiskChart
          title="Environment Satisfaction"
          description="Attrition across workplace environment ratings"
          data={riskData.environment_satisfaction}
          labels={satisfactionLabels}
          ordinal
        />

      </div>

      {/* Dynamic insights */}

      <h2 className="section-title">
        Key Workforce Insights
      </h2>

      <div className="risk-insights-grid">

        <div className="card insight-card">

          <Clock size={24} />

          <h3>Overtime Association</h3>

          <p>
            {overtimeRatio !== null
              ? `Employees working overtime have ${overtimeRatio.toFixed(2)} times the observed attrition rate of employees who do not work overtime.`
              : "Overtime comparison is currently unavailable."}
          </p>

        </div>

        <div className="card insight-card">

          <Briefcase size={24} />

          <h3>Job Role Differences</h3>

          <p>
            <strong>{highestRole.category}</strong> has
            the highest observed job role attrition rate
            at{" "}
            <strong>
              {highestRole.attrition_rate.toFixed(2)}%
            </strong>
            , based on {highestRole.total_employees} employees.
          </p>

        </div>

        <div className="card insight-card">

          <Plane size={24} />

          <h3>Business Travel</h3>

          <p>
            The{" "}
            <strong>
              {travelLabels[highestTravel.category] ||
                highestTravel.category}
            </strong>
            {" "}travel category has the highest observed
            travel-related attrition rate at{" "}
            <strong>
              {highestTravel.attrition_rate.toFixed(2)}%
            </strong>.
          </p>

        </div>

        <div className="card insight-card">

          <Scale size={24} />

          <h3>Work-Life Balance</h3>

          <p>
            Employees with a{" "}
            <strong>
              {balanceLabels[highestBalance.category]}
            </strong>
            {" "}work-life balance rating recorded an
            attrition rate of{" "}
            <strong>
              {highestBalance.attrition_rate.toFixed(2)}%
            </strong>.
          </p>

        </div>

        <div className="card insight-card">

          <Heart size={24} />

          <h3>Workplace Environment</h3>

          <p>
            The{" "}
            <strong>
              {satisfactionLabels[highestEnvironment.category]}
            </strong>
            {" "}environment satisfaction group recorded
            the highest rate in this category at{" "}
            <strong>
              {highestEnvironment.attrition_rate.toFixed(2)}%
            </strong>.
          </p>

        </div>

        <div className="card insight-card">

          <Lightbulb size={24} />

          <h3>Areas for Further Investigation</h3>

          <p>
            Review workload distribution, travel
            requirements, workplace conditions and
            employee support programs through aggregate
            workforce surveys and further analysis.
          </p>

        </div>

      </div>

      {/* Responsible analytics disclaimer */}

      <div className="analytics-note">

        <Info size={22} />

        <div>

          <strong>Responsible interpretation</strong>

          <p>
            These charts show descriptive associations
            in a historical educational dataset.
            They do not establish causation or predict
            individual resignation probabilities.
            Group sizes may differ substantially.
            Chart colors are visual rate bands, not
            validated risk classifications.
            This prototype must not be used for
            individual employment decisions.
          </p>

        </div>

      </div>

    </div>
  );
}
