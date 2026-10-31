process.env.JWT_SECRET =
  process.env.JWT_SECRET ||
  "wearhouse-test-secret";

const request =
  require("supertest");

const jwt =
  require("jsonwebtoken");

jest.mock(
  "../src/services/outfitService",
  () => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleFavorite:
      jest.fn(),
    markAsWorn:
      jest.fn(),
  })
);

const outfitService =
  require("../src/services/outfitService");

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

describe("Outfit API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("authenticated user can create an outfit", async () => {
    const token =
      createToken(1);

    const requestBody = {
      name: "Test Outfit",
      notes:
        "Created during API testing.",
      item_ids: [1, 2],
    };

    outfitService.create.mockResolvedValue({
      outfit_id: 7,
      user_id: 1,
      ...requestBody,
    });

    const response =
      await request(app)
        .post("/outfits")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send(requestBody);

    expect(
      response.status
    ).toBe(201);

    expect(
      outfitService.create
    ).toHaveBeenCalledWith(
      1,
      requestBody
    );
  });

  test("authenticated user can mark an outfit as worn", async () => {
    const token =
      createToken(1);

    outfitService.markAsWorn.mockResolvedValue({
      history_id: 3,
      outfit_id: 7,
      user_id: 1,
    });

    const response =
      await request(app)
        .post(
          "/outfits/7/wear"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      response.status
    ).toBe(201);

    expect(
      outfitService.markAsWorn
    ).toHaveBeenCalledWith(
      "7",
      1
    );
  });
});