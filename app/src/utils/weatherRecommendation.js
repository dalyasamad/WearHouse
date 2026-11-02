function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getTemperatureBand(
  temperature
) {
  if (temperature < 10) {
    return "cold";
  }

  if (temperature < 16) {
    return "cool";
  }

  if (temperature < 22) {
    return "mild";
  }

  if (temperature < 28) {
    return "warm";
  }

  return "hot";
}

function seasonMatches(
  item,
  allowedSeasons
) {
  const season =
    normalize(item.season);

  if (!season) {
    return true;
  }

  if (
    season.includes("all")
  ) {
    return true;
  }

  return allowedSeasons.some(
    (allowed) =>
      season.includes(allowed)
  );
}

function categoryMatches(
  item,
  categories
) {
  const category =
    normalize(item.category);

  return categories.some(
    (allowed) =>
      category ===
      normalize(allowed)
  );
}

function randomItem(items) {
  if (items.length === 0) {
    return null;
  }

  const index = Math.floor(
    Math.random() *
      items.length
  );

  return items[index];
}

function pickFromSlot(
  wardrobe,
  categories,
  allowedSeasons
) {
  const candidates =
    wardrobe.filter(
      (item) =>
        categoryMatches(
          item,
          categories
        ) &&
        seasonMatches(
          item,
          allowedSeasons
        )
    );

  return randomItem(
    candidates
  );
}

export function createWeatherRecommendation(
  wardrobe,
  weather
) {
  if (
    !Array.isArray(wardrobe) ||
    wardrobe.length === 0
  ) {
    return {
      items: [],
      message:
        "Add clothing to your wardrobe to receive weather-based suggestions.",
      temperatureBand: null,
    };
  }

  const temperature =
    weather.apparentTemperature ??
    weather.temperature;

  const band =
    getTemperatureBand(
      temperature
    );

  let topCategories = [];
  let bottomCategories = [];
  let seasons = [];
  let needsJacket = false;

  if (band === "hot") {
    topCategories = [
      "Tops",
    ];

    bottomCategories = [
      "Jeans",
      "Shorts",
      "Skirts",
    ];

    seasons = [
      "summer",
    ];
  }

  if (band === "warm") {
    topCategories = [
      "Tops",
      "Shirts",
    ];

    bottomCategories = [
      "Jeans",
      "Shorts",
      "Skirts",
      "Trousers",
    ];

    seasons = [
      "summer",
      "spring",
    ];
  }

  if (band === "mild") {
    topCategories = [
      "Tops",
      "Shirts",
    ];

    bottomCategories = [
      "Jeans",
      "Trousers",
      "Skirts",
    ];

    seasons = [
      "spring",
      "autumn",
      "fall",
      "summer",
    ];
  }

  if (band === "cool") {
    topCategories = [
      "Tops",
      "Shirts",
    ];

    bottomCategories = [
      "Jeans",
      "Trousers",
    ];

    seasons = [
      "autumn",
      "fall",
      "spring",
      "winter",
    ];

    needsJacket = true;
  }

  if (band === "cold") {
    topCategories = [
      "Tops",
      "Shirts",
    ];

    bottomCategories = [
      "Jeans",
      "Trousers",
    ];

    seasons = [
      "winter",
      "autumn",
      "fall",
    ];

    needsJacket = true;
  }

  const selected = [];

  const top =
    pickFromSlot(
      wardrobe,
      topCategories,
      seasons
    );

  const bottom =
    pickFromSlot(
      wardrobe,
      bottomCategories,
      seasons
    );

  const shoes =
    pickFromSlot(
      wardrobe,
      ["Shoes"],
      seasons
    );

  if (top) {
    selected.push(top);
  }

  if (bottom) {
    selected.push(bottom);
  }

  if (shoes) {
    selected.push(shoes);
  }

  const isRaining =
    Number(
      weather.precipitation
    ) > 0;

  if (
    needsJacket ||
    isRaining
  ) {
    const jacket =
      pickFromSlot(
        wardrobe,
        ["Jackets"],
        seasons
      );

    if (jacket) {
      selected.push(
        jacket
      );
    }
  }

  let message = "";

  if (band === "hot") {
    message =
      "It is very warm outside, so lightweight summer clothing is recommended.";
  }

  if (band === "warm") {
    message =
      "It is warm outside, so light clothing should be comfortable.";
  }

  if (band === "mild") {
    message =
      "The temperature is mild, so a comfortable everyday outfit should work well.";
  }

  if (band === "cool") {
    message =
      "It is cool outside, so warmer clothing and a light jacket are recommended.";
  }

  if (band === "cold") {
    message =
      "It is cold outside, so warmer clothing and an outer layer are recommended.";
  }

  if (isRaining) {
    message +=
      " Rain is also being reported, so a jacket may be useful.";
  }

  if (
    selected.length < 3
  ) {
    message +=
      " Some outfit categories are missing from your wardrobe, so only suitable available items are shown.";
  }

  return {
    items: selected,
    message,
    temperatureBand: band,
  };
}