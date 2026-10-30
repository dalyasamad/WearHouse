function DashboardStatCard({
  label,
  value,
}) {
  return (
    <div className="dashboard-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default DashboardStatCard;