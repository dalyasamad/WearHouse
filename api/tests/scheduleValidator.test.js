const {
  isValidDateString,
  validateSchedule,
} = require(
  "../src/validators/scheduleValidator"
);

describe("Schedule validation", () => {
  test("accepts a valid date", () => {
    expect(
      isValidDateString("2026-11-15")
    ).toBe(true);
  });

  test("rejects incorrect date format", () => {
    expect(
      isValidDateString("15/11/2026")
    ).toBe(false);
  });

  test("rejects an impossible day", () => {
    expect(
      isValidDateString("2026-11-40")
    ).toBe(false);
  });

  test("rejects February 31", () => {
    expect(
      isValidDateString("2026-02-31")
    ).toBe(false);
  });

  test("accepts a real leap-year date", () => {
    expect(
      isValidDateString("2028-02-29")
    ).toBe(true);
  });

  test("rejects February 29 in a non-leap year", () => {
    expect(
      isValidDateString("2026-02-29")
    ).toBe(false);
  });

  test("accepts a valid schedule", () => {
    const result = validateSchedule({
      outfit_id: 5,
      scheduled_date: "2026-11-15",
    });

    expect(result).toBeNull();
  });

  test("rejects an invalid outfit ID", () => {
    const result = validateSchedule({
      outfit_id: -1,
      scheduled_date: "2026-11-15",
    });

    expect(result).toMatch(
      /valid outfit/i
    );
  });

  test("rejects an invalid scheduled date", () => {
    const result = validateSchedule({
      outfit_id: 5,
      scheduled_date: "2026-99-99",
    });

    expect(result).toMatch(
      /valid date/i
    );
  });
});
