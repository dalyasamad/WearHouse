// Displays one date inside the outfit calendar.

function CalendarDay({
  day,
  dateString,
  selected,
  scheduled,
  removing,
  onSelect,
  onRemoveSchedule,
}) {
  return (
    <div
      className={`calendar-day ${
        selected ? "selected" : ""
      }`}
      onClick={() =>
        onSelect(
          dateString,
          scheduled
        )
      }
    >
      <span className="day-number">
        {day}
      </span>

      {scheduled && (
        <div className="scheduled-outfit">
          <span>
            {scheduled.outfit_name}
          </span>

          <button
            type="button"
            disabled={removing}
            onClick={(event) => {
              event.stopPropagation();

              onRemoveSchedule(
                scheduled
              );
            }}
          >
            {removing ? "…" : "×"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CalendarDay;