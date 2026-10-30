// Checks whether a date is a real calendar date
// written in YYYY-MM-DD format.
function isValidDateString(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const [year, month, day] =
    value.split("-").map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// Validates data used to schedule an outfit.
function validateSchedule(data) {
  const outfitId =
    Number(data.outfit_id);

  if (
    !Number.isInteger(outfitId) ||
    outfitId <= 0
  ) {
    return "A valid outfit is required.";
  }

  if (!data.scheduled_date) {
    return "Date is required.";
  }

  if (
    !isValidDateString(
      data.scheduled_date
    )
  ) {
    return "Date must be a valid date in YYYY-MM-DD format.";
  }

  return null;
}

module.exports = {
  isValidDateString,
  validateSchedule,
};