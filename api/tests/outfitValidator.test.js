const {
  validateOutfit,
} = require(
  "../src/validators/outfitValidator"
);

describe("Outfit validation", () => {
  test("accepts a valid outfit", () => {
    const result = validateOutfit({
      name: "University Outfit",
      item_ids: [1, 2, 3],
    });

    expect(result).toBeNull();
  });

  test("rejects an empty outfit name", () => {
    const result = validateOutfit({
      name: "",
      item_ids: [1, 2],
    });

    expect(result).not.toBeNull();
  });

  test("requires at least one clothing item", () => {
    const result = validateOutfit({
      name: "Test Outfit",
      item_ids: [],
    });

    expect(result).toMatch(
      /at least one/i
    );
  });

  test("rejects duplicate clothing items", () => {
    const result = validateOutfit({
      name: "Test Outfit",
      item_ids: [1, 2, 2],
    });

    expect(result).toMatch(
      /more than once/i
    );
  });

  test("rejects invalid clothing item IDs", () => {
    const result = validateOutfit({
      name: "Test Outfit",
      item_ids: [1, -2, 3],
    });

    expect(result).toMatch(
      /invalid/i
    );
  });
});