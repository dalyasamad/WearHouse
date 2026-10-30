import { useState } from "react";

import {
    searchLocation,
    getCurrentWeather,
} from "../services/weatherService";

import {
    createWeatherRecommendation,
} from "../utils/weatherRecommendation";

import {
    createOutfit,
} from "../services/outfitService";

import {
    getAssetUrl,
} from "../config/api";

function getWeatherDescription(code) {
    if (code === 0) {
        return "Clear";
    }

    if ([1, 2, 3].includes(code)) {
        return "Partly cloudy";
    }

    if ([45, 48].includes(code)) {
        return "Foggy";
    }

    if (
        [51, 53, 55, 56, 57].includes(code)
    ) {
        return "Drizzle";
    }

    if (
        [61, 63, 65, 66, 67].includes(code)
    ) {
        return "Rain";
    }

    if (
        [71, 73, 75, 77].includes(code)
    ) {
        return "Snow";
    }

    if (
        [80, 81, 82].includes(code)
    ) {
        return "Rain showers";
    }

    if (
        [95, 96, 99].includes(code)
    ) {
        return "Thunderstorm";
    }

    return "Current weather";
}

function WeatherSmartPick({
    wardrobe,
}) {
    const [city, setCity] =
        useState("");

    const [location, setLocation] =
        useState(null);

    const [weather, setWeather] =
        useState(null);

    const [
        recommendation,
        setRecommendation,
    ] = useState(null);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [
        saveMessage,
        setSaveMessage,
    ] = useState("");

    async function handleWeatherSearch(
        event
    ) {
        event.preventDefault();

        const trimmedCity =
            city.trim();

        if (!trimmedCity) {
            setError(
                "Enter a city first."
            );

            return;
        }

        try {
            setLoading(true);
            setError("");
            setSaveMessage("");

            const foundLocation =
                await searchLocation(
                    trimmedCity
                );

            const currentWeather =
                await getCurrentWeather(
                    foundLocation.latitude,
                    foundLocation.longitude
                );

            const smartPick =
                createWeatherRecommendation(
                    wardrobe,
                    currentWeather
                );

            setLocation(
                foundLocation
            );

            setWeather(
                currentWeather
            );

            setRecommendation(
                smartPick
            );
        } catch (error) {
            setError(
                error.message
            );
        } finally {
            setLoading(false);
        }
    }

    function handleSurpriseMe() {
        if (!weather) {
            return;
        }

        const newRecommendation =
            createWeatherRecommendation(
                wardrobe,
                weather
            );

        setRecommendation(
            newRecommendation
        );

        setSaveMessage("");
    }

    async function handleSaveOutfit() {
        if (
            !recommendation ||
            recommendation.items.length === 0
        ) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSaveMessage("");

            const temperature =
                Math.round(
                    weather.apparentTemperature ??
                    weather.temperature
                );

            await createOutfit({
                name: `Weather Pick - ${location.name}`,
                notes:
                    `${temperature}${weather.temperatureUnit} in ${location.name} • ${getWeatherDescription(
                        weather.weatherCode
                    )}`,
                is_favorite: false,
                item_ids:
                    recommendation.items.map(
                        (item) => item.item_id
                    ),
            });

            setSaveMessage(
                "Smart Pick saved to your outfits."
            );
        } catch (error) {
            setError(
                error.message
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="weather-smart-card">
            <div className="weather-smart-header">
                <div>
                    <span className="weather-smart-label">
                        Smart Pick
                    </span>

                    <h2>
                        What should I wear?
                    </h2>

                    <p>
                        Get an outfit suggestion
                        using today's weather and
                        clothing from your wardrobe.
                    </p>
                </div>
            </div>

            <form
                className="weather-search"
                onSubmit={
                    handleWeatherSearch
                }
            >
                <input
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(event) =>
                        setCity(
                            event.target.value
                        )
                    }
                />

                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >
                    {loading
                        ? "Checking..."
                        : "Get Smart Pick"}
                </button>
            </form>

            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}

            {saveMessage && (
                <p className="success-message">
                    {saveMessage}
                </p>
            )}

            {weather &&
                location &&
                recommendation && (
                    <div className="weather-smart-result">
                        <div className="weather-summary">
                            <div>
                                <strong>
                                    {location.name}
                                    {location.country
                                        ? `, ${location.country}`
                                        : ""}
                                </strong>

                                <span>
                                    {getWeatherDescription(
                                        weather.weatherCode
                                    )}
                                </span>
                            </div>

                            <div className="weather-temperature">
                                {Math.round(
                                    weather.temperature
                                )}
                                {
                                    weather.temperatureUnit
                                }
                            </div>
                        </div>

                        <div className="weather-details">
                            <span>
                                Feels like{" "}
                                {Math.round(
                                    weather.apparentTemperature
                                )}
                                {
                                    weather.temperatureUnit
                                }
                            </span>

                            <span>
                                Wind{" "}
                                {Math.round(
                                    weather.windSpeed
                                )}{" "}
                                {
                                    weather.windSpeedUnit
                                }
                            </span>

                            <span>
                                Precipitation{" "}
                                {weather.precipitation} mm
                            </span>
                        </div>

                        <p className="weather-recommendation-message">
                            {
                                recommendation.message
                            }
                        </p>

                        {recommendation.items.length >
                            0 && (
                                <>
                                    <div className="weather-pick-items">
                                        {recommendation.items.map(
                                            (item) => (
                                                <div
                                                    className="weather-pick-item"
                                                    key={
                                                        item.item_id
                                                    }
                                                >
                                                    <div className="weather-pick-image">
                                                        {item.image_url ? (
                                                            <img
                                                                src={getAssetUrl(
                                                                    item.image_url
                                                                )}
                                                                alt={
                                                                    item.name
                                                                }
                                                            />
                                                        ) : (
                                                            <span>
                                                                No Image
                                                            </span>
                                                        )}
                                                    </div>

                                                    <strong>
                                                        {item.name}
                                                    </strong>

                                                    <span>
                                                        {
                                                            item.category
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="weather-smart-actions">
                                        <button
                                            type="button"
                                            className="primary-button"
                                            onClick={
                                                handleSaveOutfit
                                            }
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save This Outfit"}
                                        </button>

                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={
                                                handleSurpriseMe
                                            }
                                            disabled={saving}
                                        >
                                            Surprise Me Again
                                        </button>
                                    </div>
                                </>
                            )}
                    </div>
                )}
        </section>
    );
}

export default WeatherSmartPick;