
export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  accent = false
}) {
  return (
    <div className={`stat-card ${accent ? "accent" : ""}`}>

      <div className="stat-card-top">

        <span className="stat-label">
          {title}
        </span>

        <div className="stat-icon">
          {Icon && <Icon size={22} />}
        </div>

      </div>

      <h2 className="stat-value">
        {value}
      </h2>

      <p className="stat-description">
        {description}
      </p>

    </div>
  );
}
