process.env.JWT_SECRET =
  process.env.JWT_SECRET ||
  "wearhouse-test-secret";

const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock(
  "../src/repositories/clothingRepository",
  () => ({
    findAllByUser: jest.fn(),
    findById: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
  })
);

const clothingRepository =
  require("../src/repositories/clothingRepository");

const app =
  require("../src/app");

describe("Clothing ownership protection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createToken(userId) {
    return jwt.sign(
      {
        user_id: userId,
      },
      process.env.JWT_SECRET
    );
  }

  test("user can retrieve their own clothing item", async () => {
    clothingRepository.findById.mockResolvedValue({
      item_id: 10,
      user_id: 1,
      name: "Blue Shirt",
      category: "Shirts",
    });

    const token =
      createToken(1);

    const response =
      await request(app)
        .get("/clothing/10")
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      response.status
    ).toBe(200);

    expect(
      response.body.item_id
    ).toBe(10);

    expect(
      clothingRepository.findById
    ).toHaveBeenCalledWith(
      "10",
      1
    );
  });

  test("user cannot retrieve another user's clothing item", async () => {
    /*
      The repository searches using both
      item ID and authenticated user ID.

      If item 99 belongs to somebody else,
      the query returns no record.
    */
    clothingRepository.findById.mockResolvedValue(
      null
    );

    const token =
      createToken(1);

    const response =
      await request(app)
        .get("/clothing/99")
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      response.status
    ).toBe(404);

    expect(
      response.body.message
    ).toBe(
      "Clothing item not found."
    );

    expect(
      clothingRepository.findById
    ).toHaveBeenCalledWith(
      "99",
      1
    );
  });
});