// Displays the outfit planning calendar and lets the user
// assign, update, and remove saved outfits for specific dates.

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import CustomDropdown from "../components/CustomDropdown";
import CalendarDay from "../components/CalendarDay";

import {
  getOutfits,
} from "../services/outfitService";

import {
  getSchedules,
  saveSchedule,
  deleteSchedule,
} from "../services/scheduleService";

// Converts a date value to YYYY-MM-DD.
// This keeps comparisons consistent when PostgreSQL returns timestamps.
function normalizeDate(date) {
  if (!date) {
    return "";
  }

  return String(date).slice(
    0,
    10
  );
}

// Returns the month that should initially be displayed.
// If Dashboard supplied a date, the calendar opens on that month.
// Otherwise it opens on the current month.
function getInitialMonth(
  requestedDate
) {
  if (!requestedDate) {
    return new Date();
  }

  const [
    requestedYear,
    requestedMonth,
  ] = requestedDate
    .split("-")
    .map(Number);

  if (
    !requestedYear ||
    !requestedMonth
  ) {
    return new Date();
  }

  return new Date(
    requestedYear,
    requestedMonth - 1,
    1
  );
}

// Renders the Outfit Calendar page and manages
// calendar selection, scheduling, updates, and removal.
function OutfitCalendar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard can send a specific scheduled date and outfit.
  const requestedDate =
    normalizeDate(
      location.state?.selectedDate
    ) || null;

  const requestedOutfitId =
    location.state
      ?.selectedOutfitId ||
    null;

  // Initialize directly from navigation state instead of
  // changing state synchronously inside an effect.
  const [
    currentMonth,
    setCurrentMonth,
  ] = useState(() =>
    getInitialMonth(
      requestedDate
    )
  );

  const [
    outfits,
    setOutfits,
  ] = useState([]);

  const [
    schedules,
    setSchedules,
  ] = useState([]);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    requestedDate
  );

  const [
    selectedOutfit,
    setSelectedOutfit,
  ] = useState(
    requestedOutfitId
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    removingScheduleId,
    setRemovingScheduleId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  // Loads the user's saved outfits and calendar schedules.
  useEffect(() => {
    async function loadCalendarData() {
      try {
        setLoading(true);
        setError("");

        const [
          outfitData,
          scheduleData,
        ] =
          await Promise.all([
            getOutfits(),
            getSchedules(),
          ]);

        setOutfits(
          outfitData
        );

        setSchedules(
          scheduleData
        );
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadCalendarData();
  }, []);

  // Reloads schedules after a create, update, or delete.
  async function refreshSchedules() {
    const data =
      await getSchedules();

    setSchedules(data);

    return data;
  }

  // Displays a temporary success message.
  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2200);
  }

  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const firstDayOffset =
    new Date(
      year,
      month,
      1
    ).getDay();

  const monthName =
    currentMonth.toLocaleString(
      "en-US",
      {
        month: "long",
      }
    );

  // Creates a YYYY-MM-DD date for a calendar day.
  function createDateString(day) {
    const monthNumber =
      String(
        month + 1
      ).padStart(
        2,
        "0"
      );

    const dayNumber =
      String(day).padStart(
        2,
        "0"
      );

    return `${year}-${monthNumber}-${dayNumber}`;
  }

  // Builds the blank leading cells and numbered days
  // used by the monthly calendar grid.
  const calendarCells = [];

  for (
    let i = 0;
    i < firstDayOffset;
    i++
  ) {
    calendarCells.push(
      null
    );
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarCells.push(
      day
    );
  }

  // Moves to the previous month and clears the selection.
  function goToPreviousMonth() {
    setCurrentMonth(
      new Date(
        year,
        month - 1,
        1
      )
    );

    setSelectedDate(null);
    setSelectedOutfit(null);
    setError("");
    setMessage("");
  }

  // Moves to the next month and clears the selection.
  function goToNextMonth() {
    setCurrentMonth(
      new Date(
        year,
        month + 1,
        1
      )
    );

    setSelectedDate(null);
    setSelectedOutfit(null);
    setError("");
    setMessage("");
  }

  // Finds the outfit already scheduled for a calendar day.
  function getScheduledOutfit(day) {
    const dateString =
      createDateString(day);

    return schedules.find(
      (schedule) =>
        normalizeDate(
          schedule.scheduled_date
        ) === dateString
    );
  }

  // Selects a calendar date and automatically selects
  // its existing outfit when one is already scheduled.
  function handleSelectDate(
    dateString,
    scheduled
  ) {
    setSelectedDate(
      dateString
    );

    setSelectedOutfit(
      scheduled
        ? scheduled.outfit_id
        : null
    );

    setError("");
    setMessage("");
  }

  // Saves a new schedule or replaces the outfit
  // already assigned to the selected date.
  async function handleScheduleOutfit() {
    if (
      !selectedDate ||
      !selectedOutfit
    ) {
      setError(
        "Select a date and an outfit first."
      );

      return;
    }

    const existingSchedule =
      schedules.find(
        (schedule) =>
          normalizeDate(
            schedule.scheduled_date
          ) ===
          selectedDate
      );

    try {
      setSaving(true);
      setError("");

      await saveSchedule({
        outfit_id:
          selectedOutfit,

        scheduled_date:
          selectedDate,
      });

      await refreshSchedules();

      showMessage(
        existingSchedule
          ? "Calendar updated."
          : "Outfit added to calendar."
      );
    } catch (error) {
      setError(
        error.message
      );
    } finally {
      setSaving(false);
    }
  }

  // Removes an outfit from a scheduled date.
  async function handleRemoveSchedule(
    schedule
  ) {
    try {
      setError("");

      setRemovingScheduleId(
        schedule.schedule_id
      );

      await deleteSchedule(
        schedule.schedule_id
      );

      await refreshSchedules();

      if (
        selectedDate ===
        normalizeDate(
          schedule.scheduled_date
        )
      ) {
        setSelectedOutfit(
          null
        );
      }

      showMessage(
        "Outfit removed from calendar."
      );
    } catch (error) {
      setError(
        error.message
      );
    } finally {
      setRemovingScheduleId(
        null
      );
    }
  }

  // Converts YYYY-MM-DD into a readable date
  // for the planning sidebar.
  function formatSelectedDate(
    dateString
  ) {
    if (!dateString) {
      return "";
    }

    const [
      selectedYear,
      selectedMonth,
      selectedDay,
    ] =
      dateString.split("-");

    const date =
      new Date(
        Number(
          selectedYear
        ),
        Number(
          selectedMonth
        ) - 1,
        Number(
          selectedDay
        )
      );

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  const selectedOutfitObject =
    outfits.find(
      (outfit) =>
        outfit.outfit_id ===
        selectedOutfit
    );

  const selectedSchedule =
    selectedDate
      ? schedules.find(
          (schedule) =>
            normalizeDate(
              schedule.scheduled_date
            ) ===
            selectedDate
        )
      : null;

  return (
    <div className="outfit-calendar-page">
      <div className="page-header">
        <div>
          <h1>
            Outfit Calendar
          </h1>

          <p>
            Plan your looks and
            assign saved outfits
            to dates.
          </p>
        </div>
      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}

      {message && (
        <div className="outfit-success-message">
          ✓ {message}
        </div>
      )}

      {loading ? (
        <div className="calendar-instructions">
          <p>
            Loading calendar...
          </p>
        </div>
      ) : (
        <div className="calendar-layout">
          <section className="calendar-card">
            <div className="calendar-header">
              <button
                type="button"
                className="calendar-arrow"
                onClick={
                  goToPreviousMonth
                }
              >
                ←
              </button>

              <h2>
                {monthName}{" "}
                {year}
              </h2>

              <button
                type="button"
                className="calendar-arrow"
                onClick={
                  goToNextMonth
                }
              >
                →
              </button>
            </div>

            <div className="calendar-weekdays">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="calendar-grid">
              {calendarCells.map(
                (
                  day,
                  index
                ) => {
                  if (!day) {
                    return (
                      <div
                        className="calendar-day empty"
                        key={`empty-${index}`}
                      />
                    );
                  }

                  const dateString =
                    createDateString(
                      day
                    );

                  const scheduled =
                    getScheduledOutfit(
                      day
                    );

                  return (
                    <CalendarDay
                      key={
                        dateString
                      }
                      day={day}
                      dateString={
                        dateString
                      }
                      selected={
                        selectedDate ===
                        dateString
                      }
                      scheduled={
                        scheduled
                      }
                      removing={
                        removingScheduleId ===
                        scheduled
                          ?.schedule_id
                      }
                      onSelect={
                        handleSelectDate
                      }
                      onRemoveSchedule={
                        handleRemoveSchedule
                      }
                    />
                  );
                }
              )}
            </div>
          </section>

          <aside className="calendar-sidebar">
            <h2>
              Plan an Outfit
            </h2>

            {selectedDate ? (
              <>
                <p className="selected-date">
                  {formatSelectedDate(
                    selectedDate
                  )}
                </p>

                {outfits.length >
                0 ? (
                  <>
                    <div className="form-group">
                      <label>
                        Select Outfit
                      </label>

                      <CustomDropdown
                        value={
                          selectedOutfitObject
                            ?.name ||
                          ""
                        }
                        placeholder="Choose an outfit"
                        options={outfits.map(
                          (
                            outfit
                          ) =>
                            outfit.name
                        )}
                        onChange={(
                          name
                        ) => {
                          const outfit =
                            outfits.find(
                              (
                                item
                              ) =>
                                item.name ===
                                name
                            );

                          setSelectedOutfit(
                            outfit
                              ? outfit.outfit_id
                              : null
                          );
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      className="primary-button"
                      onClick={
                        handleScheduleOutfit
                      }
                      disabled={
                        saving ||
                        !selectedOutfit
                      }
                    >
                      {saving
                        ? "Saving..."
                        : selectedSchedule
                          ? "Update Calendar"
                          : "Save to Calendar"}
                    </button>
                  </>
                ) : (
                  <div className="calendar-instructions">
                    <p>
                      You haven't
                      created any
                      outfits yet.
                    </p>

                    <button
                      type="button"
                      className="primary-button"
                      onClick={() =>
                        navigate(
                          "/outfits/create"
                        )
                      }
                    >
                      Create Outfit
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="calendar-instructions">
                <p>
                  Select a date to
                  plan an outfit.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default OutfitCalendar;