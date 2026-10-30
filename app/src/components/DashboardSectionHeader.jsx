function DashboardSectionHeader({
  title,
  actionLabel,
  onAction,
}) {
  return (
    <div className="dashboard-section-header">
      <h2>{title}</h2>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default DashboardSectionHeader;