process.env.JWT_SECRET =
  process.env.JWT_SECRET ||
  "wearhouse-test-secret";

const request =
  require("supertest");

const jwt =
  require("jsonwebtoken");

jest.mock(
  "../src/services/scheduleService",
  () => ({
    getAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })
);

const scheduleService =
  require("../src/services/scheduleService");

const app =
  require("../src/app");

function createToken(userId) {
  return jwt.sign(
    {
      user_id: userId,
    },
    process.env.JWT_SECRET
  );
}

describe("Schedule API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("authenticated user can schedule an outfit", async () => {
    const token =
      createToken(1);

    const requestBody = {
      outfit_id: 7,
      scheduled_date:
        "2026-11-02",
    };

    scheduleService.save.mockResolvedValue({
      schedule_id: 9,
      user_id: 1,
      ...requestBody,
    });

    const response =
      await request(app)
        .post("/schedules")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send(requestBody);

    expect(
      response.status
    ).toBe(201);

    expect(
      scheduleService.save
    ).toHaveBeenCalledWith(
      1,
      requestBody
    );
  });

  test("authenticated user can remove a scheduled outfit", async () => {
    const token =
      createToken(1);

    scheduleService.remove.mockResolvedValue(
      true
    );

    const response =
      await request(app)
        .delete(
          "/schedules/9"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      response.status
    ).toBe(200);

    expect(
      scheduleService.remove
    ).toHaveBeenCalledWith(
      "9",
      1
    );
  });
});