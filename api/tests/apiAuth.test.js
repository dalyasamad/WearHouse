const request = require("supertest");
const app = require("../src/app");

describe("WearHouse API authentication", () => {
  test("GET / returns API status", async () => {
    const response =
      await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "WearHouse API Running",
    });
  });

  test("GET /clothing requires authentication", async () => {
    const response =
      await request(app).get(
        "/clothing"
      );

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authentication required."
    );
  });

  test("GET /outfits requires authentication", async () => {
    const response =
      await request(app).get(
        "/outfits"
      );

    expect(response.status).toBe(401);
  });

  test("GET /schedules requires authentication", async () => {
    const response =
      await request(app).get(
        "/schedules"
      );

    expect(response.status).toBe(401);
  });

  test("GET /users/me requires authentication", async () => {
    const response =
      await request(app).get(
        "/users/me"
      );

    expect(response.status).toBe(401);
  });

  test("invalid JWT is rejected", async () => {
    const response =
      await request(app)
        .get("/clothing")
        .set(
          "Authorization",
          "Bearer invalid-token"
        );

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Invalid or expired token."
    );
  });
});