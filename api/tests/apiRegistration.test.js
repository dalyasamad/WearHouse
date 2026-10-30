const request = require("supertest");

jest.mock(
  "../src/repositories/userRepository",
  () => ({
    findByEmail: jest.fn(),
    findById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  })
);

const userRepository =
  require("../src/repositories/userRepository");

const app =
  require("../src/app");

describe("Registration API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("duplicate email returns 409 Conflict", async () => {
    userRepository.findByEmail.mockResolvedValue({
      user_id: 5,
      email: "existing@example.com",
    });

    const response =
      await request(app)
        .post("/auth/register")
        .send({
          first_name: "Test",
          last_name: "User",
          email:
            "existing@example.com",
          password:
            "Password1!",
        });

    expect(
      response.status
    ).toBe(409);

    expect(
      response.body.message
    ).toBe(
      "An account with this email already exists."
    );

    expect(
      userRepository.findByEmail
    ).toHaveBeenCalledWith(
      "existing@example.com"
    );

    expect(
      userRepository.createUser
    ).not.toHaveBeenCalled();
  });

  test("invalid registration data returns 400 before database access", async () => {
    const response =
      await request(app)
        .post("/auth/register")
        .send({
          first_name: "Test",
          last_name: "User",
          email: "not-an-email",
          password:
            "Password1!",
        });

    expect(
      response.status
    ).toBe(400);

    expect(
      userRepository.findByEmail
    ).not.toHaveBeenCalled();

    expect(
      userRepository.createUser
    ).not.toHaveBeenCalled();
  });
});