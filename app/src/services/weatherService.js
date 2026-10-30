// Finds a city and returns its coordinates.
export async function searchLocation(
  locationName
) {
  const query =
    encodeURIComponent(
      locationName.trim()
    );

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error(
      "Unable to search for that location."
    );
  }

  const data = await response.json();

  if (
    !data.results ||
    data.results.length === 0
  ) {
    throw new Error(
      "Location not found."
    );
  }

  const location = data.results[0];

  return {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  };
}


// Gets the current weather for coordinates.
export async function getCurrentWeather(
  latitude,
  longitude
) {
  const params =
    new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: [
        "temperature_2m",
        "apparent_temperature",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
      ].join(","),
      timezone: "auto",
    });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load weather data."
    );
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error(
      "Current weather is unavailable."
    );
  }

  return {
    temperature:
      data.current.temperature_2m,

    apparentTemperature:
      data.current
        .apparent_temperature,

    precipitation:
      data.current.precipitation,

    weatherCode:
      data.current.weather_code,

    windSpeed:
      data.current.wind_speed_10m,

    temperatureUnit:
      data.current_units
        ?.temperature_2m || "°C",

    windSpeedUnit:
      data.current_units
        ?.wind_speed_10m || "km/h",
  };
}