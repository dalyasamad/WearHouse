// Renders a WearHouse application page and manages its user interactions.


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { getClothingItems } from "../services/clothingService";
import { getOutfits } from "../services/outfitService";
import { getSchedules } from "../services/scheduleService";
import { getWearHistory } from "../services/historyService";

// Parses a calendar date without treating it as a timestamp.
function parseDateOnly(dateValue) {
  if (!dateValue) {
    return null;
  }

  const match = String(dateValue).match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (match) {
    const [, year, month, day] = match;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  }

  const date = new Date(dateValue);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

// Renders the Dashboard page and manages its related state and event handlers.
function Dashboard() {
  const navigate = useNavigate();
  const [wearHistory, setWearHistory] = useState([]);



  const { user } = useAuth();

  const firstName =
    user?.first_name || "User";

  const [clothing, setClothing] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        clothingData,
        outfitData,
        scheduleData,
        historyData,
      ] = await Promise.all([
        getClothingItems(),
        getOutfits(),
        getSchedules(),
        getWearHistory(),
      ]);

      setClothing(clothingData);
      setOutfits(outfitData);
      setSchedules(scheduleData);
      setWearHistory(historyData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const favoriteItems = clothing
    .filter((item) => item.is_favorite)
    .sort(
      (a, b) =>
        new Date(
          b.updated_at ||
          b.created_at ||
          0
        ) -
        new Date(
          a.updated_at ||
          a.created_at ||
          0
        )
    )
    .slice(0, 4);

  const recentOutfits = [...outfits]
    .sort(
      (a, b) =>
        new Date(
          b.updated_at ||
          b.created_at ||
          0
        ) -
        new Date(
          a.updated_at ||
          a.created_at ||
          0
        )
    )
    .slice(0, 2);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allUpcomingOutfits = schedules
    .filter((schedule) => {
      const scheduleDate =
        parseDateOnly(
          schedule.scheduled_date
        );

      if (!scheduleDate) {
        return false;
      }

      return scheduleDate >= today;
    })
    .sort((a, b) => {
      const dateA =
        parseDateOnly(
          a.scheduled_date
        );

      const dateB =
        parseDateOnly(
          b.scheduled_date
        );

      return dateA - dateB;
    });

  const upcomingOutfits =
    allUpcomingOutfits.slice(0, 4);

  function formatScheduleDate(dateValue) {
    const date =
      parseDateOnly(dateValue);

    if (!date) {
      return "";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  }

  function formatWornDate(dateValue) {
    const date =
      parseDateOnly(dateValue);

    if (!date) {
      return "";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <h1>Welcome, {firstName}</h1>
            <p>Loading your wardrobe...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Welcome, {firstName}</h1>

          <p>
            Manage your wardrobe, create outfits,
            and plan your looks.
          </p>
        </div>
      </div>

      {error && (
        <p className="auth-error">{error}</p>
      )}

      {/* REAL STATISTICS */}
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <span>Total Items</span>

          <strong>{clothing.length}</strong>
        </div>

        <div className="dashboard-stat-card">
          <span>Favorite Items</span>

          <strong>
            {
              clothing.filter(
                (item) => item.is_favorite
              ).length
            }
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <span>Saved Outfits</span>

          <strong>{outfits.length}</strong>
        </div>

        <div className="dashboard-stat-card">
          <span>Planned Looks</span>

          <strong>
            {allUpcomingOutfits.length}
          </strong>
        </div>
      </div>

      {/* FAVORITE CLOTHING */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Favorite Items</h2>

          <button
            type="button"
            onClick={() =>
              navigate("/wardrobe?favorites=true")
            }
          >
            View All
          </button>
        </div>

        {favoriteItems.length > 0 ? (
          <div className="dashboard-favorites">
            {favoriteItems.map((item) => (
              <div
                className="dashboard-item-card"
                key={item.item_id}
                onClick={() =>
                  navigate(
                    `/clothing/${item.item_id}`
                  )
                }
              >
                <div className="dashboard-item-image">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <div className="dashboard-item-info">
                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      {item.category}
                    </p>
                  </div>

                  <span className="dashboard-heart">
                    ♥
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <p>
              You haven't added any favorite
              clothing yet.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/wardrobe")
              }
            >
              View Wardrobe
            </button>
          </div>
        )}
      </section>
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Recently Worn</h2>
        </div>

        {wearHistory.length > 0 ? (
          <div className="dashboard-worn-list">
            {wearHistory
              .slice(0, 3)
              .map((entry) => (
                <div
                  className="dashboard-worn-item"
                  key={entry.history_id}
                >
                  <div className="dashboard-worn-preview">
                    {entry.items?.[0]?.image_url ? (
                      <img
                        src={
                          entry.items[0].image_url
                        }
                        alt={entry.outfit_name}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div>
                    <h3>
                      {entry.outfit_name}
                    </h3>

                    <p>
                      Worn{" "}
                      {formatWornDate(
                        entry.worn_date
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <p>
              You haven't marked any outfits as worn yet.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/outfits")
              }
            >
              View Outfits
            </button>
          </div>
        )}
      </section>

      <div className="dashboard-bottom-grid">

        {/* REAL SAVED OUTFITS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Outfits</h2>

            <button
              type="button"
              onClick={() =>
                navigate("/outfits")
              }
            >
              View All
            </button>
          </div>

          {recentOutfits.length > 0 ? (
            <div className="dashboard-outfits">
              {recentOutfits.map((outfit) => (
                <div
                  className="dashboard-outfit-card"
                  key={outfit.outfit_id}
                  onClick={() =>
                    navigate("/outfits")
                  }
                >
                  <div className="dashboard-outfit-preview">
                    {outfit.items?.length >
                      0 ? (
                      outfit.items
                        .slice(0, 4)
                        .map((item) => (
                          <div
                            className="dashboard-outfit-item"
                            key={item.item_id}
                          >
                            {item.image_url ? (
                              <img
                                src={
                                  item.image_url
                                }
                                alt={item.name}
                              />
                            ) : (
                              <span>
                                {item.name}
                              </span>
                            )}
                          </div>
                        ))
                    ) : (
                      <div className="dashboard-outfit-empty">
                        No items
                      </div>
                    )}
                  </div>

                  <div className="dashboard-outfit-name">
                    <h3>{outfit.name}</h3>

                    {outfit.is_favorite && (
                      <span>♥</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <p>
                You haven't created any outfits
                yet.
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate("/outfits/create")
                }
              >
                Create Outfit
              </button>
            </div>
          )}
        </section>

        {/* REAL CALENDAR DATA */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Upcoming Outfits</h2>

            <button
              type="button"
              onClick={() =>
                navigate("/calendar")
              }
            >
              View Calendar
            </button>
          </div>

          {upcomingOutfits.length > 0 ? (
            <div className="dashboard-upcoming-list">
              {upcomingOutfits.map(
                (schedule) => (
                  <div
                    className="dashboard-upcoming-item"
                    key={
                      schedule.schedule_id
                    }
                    onClick={() =>
                      navigate("/calendar")
                    }
                  >
                    <div className="dashboard-date-box">
                      {formatScheduleDate(
                        schedule.scheduled_date
                      )}
                    </div>

                    <div>
                      <h3>
                        {schedule.outfit_name}
                      </h3>

                      <p>
                        Planned outfit
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="dashboard-empty">
              <p>
                Nothing planned yet.
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate("/calendar")
                }
              >
                Plan an Outfit
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;