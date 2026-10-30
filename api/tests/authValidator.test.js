const {
  validateRegister,
  validateLogin,
} = require(
  "../src/validators/authValidator"
);

describe("Authentication validation", () => {
  test("accepts valid registration data", () => {
    const result = validateRegister({
      first_name: "Dalia",
      last_name: "Samad",
      email: "dalia@example.com",
      password: "WearHouse1!",
    });

    expect(result).toBeNull();
  });

  test("rejects missing registration fields", () => {
    const result = validateRegister({
      first_name: "Dalia",
      email: "dalia@example.com",
      password: "WearHouse1!",
    });

    expect(result).not.toBeNull();
  });

  test("rejects invalid email addresses", () => {
    const result = validateRegister({
      first_name: "Dalia",
      last_name: "Samad",
      email: "not-an-email",
      password: "WearHouse1!",
    });

    expect(result).toMatch(
      /valid email/i
    );
  });

  test("rejects passwords shorter than 8 characters", () => {
    const result = validateRegister({
      first_name: "Dalia",
      last_name: "Samad",
      email: "dalia@example.com",
      password: "Ab1!",
    });

    expect(result).toMatch(
      /8 characters/i
    );
  });

  test("rejects password without uppercase letter", () => {
    const result = validateRegister({
      first_name: "Dalia",
      last_name: "Samad",
      email: "dalia@example.com",
      password: "wearhouse1!",
    });

    expect(result).toMatch(
      /uppercase/i
    );
  });

  test("rejects password without a number", () => {
    const result = validateRegister({
      first_name: "Dalia",
      last_name: "Samad",
      email: "dalia@example.com",
      password: "WearHouse!",
    });

    expect(result).toMatch(
      /number/i
    );
  });

  test("rejects password without special character", () => {
    const result = validateRegister({
      first_name: "Dalia",
      last_name: "Samad",
      email: "dalia@example.com",
      password: "WearHouse1",
    });

    expect(result).toMatch(
      /special character/i
    );
  });

  test("rejects login when credentials are missing", () => {
    const result = validateLogin({
      email: "",
      password: "",
    });

    expect(result).not.toBeNull();
  });

  test("accepts supplied login credentials", () => {
    const result = validateLogin({
      email: "dalia@example.com",
      password: "WearHouse1!",
    });

    expect(result).toBeNull();
  });
});