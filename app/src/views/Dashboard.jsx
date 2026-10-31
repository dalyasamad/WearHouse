// Displays the user's wardrobe overview, recent activity,
// weather-based recommendations, saved outfits, and planned outfits.


import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { getAssetUrl } from "../config/api";

import WeatherSmartPick from "../components/WeatherSmartPick";
import DashboardStatCard from "../components/DashboardStatCard";
import DashboardSectionHeader from "../components/DashboardSectionHeader";
import useDashboardData from "../hooks/useDashboardData";

// Parses a YYYY-MM-DD value as a local calendar date.
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

// Renders the main dashboard and loads the user's
// wardrobe, outfits, schedules, and wear history.
function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName =
    user?.first_name || "User";



  const {
    clothing,
    outfits,
    schedules,
    wearHistory,
    loading,
    error,
  } = useDashboardData();

  // Shows up to four recently updated favorite items.
  const favoriteItems = clothing
    .filter(
      (item) => item.is_favorite
    )
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

  // Shows the two most recently updated outfits.
  const recentOutfits = [
    ...outfits,
  ]
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
  today.setHours(
    0,
    0,
    0,
    0
  );

  // Keeps future and current outfit plans,
  // ordered from nearest to furthest date.
  const allUpcomingOutfits =
    schedules
      .filter((schedule) => {
        const scheduleDate =
          parseDateOnly(
            schedule.scheduled_date
          );

        if (!scheduleDate) {
          return false;
        }

        return (
          scheduleDate >= today
        );
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
    allUpcomingOutfits.slice(
      0,
      4
    );

  function formatScheduleDate(
    dateValue
  ) {
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

  function formatWornDate(
    dateValue
  ) {
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
            <h1>
              Welcome, {firstName}
            </h1>

            <p>
              Loading your wardrobe...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>
            Welcome, {firstName}
          </h1>

          <p>
            Manage your wardrobe,
            create outfits, and plan
            your looks.
          </p>
        </div>
      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}

      {/* Dashboard statistics */}
      <div className="dashboard-stats">
        <DashboardStatCard
          label="Total Items"
          value={clothing.length}
        />

        <DashboardStatCard
          label="Favorite Items"
          value={
            clothing.filter(
              (item) =>
                item.is_favorite
            ).length
          }
        />

        <DashboardStatCard
          label="Saved Outfits"
          value={outfits.length}
        />

        <DashboardStatCard
          label="Planned Looks"
          value={
            allUpcomingOutfits.length
          }
        />
      </div>

      {/* Weather-based wardrobe recommendation */}
      <WeatherSmartPick
        wardrobe={clothing}
      />

      {/* Favorite clothing */}
      <section className="dashboard-section">
        <DashboardSectionHeader
          title="Favorite Items"
          actionLabel="View All"
          onAction={() =>
            navigate(
              "/wardrobe?favorites=true"
            )
          }
        />

        {favoriteItems.length > 0 ? (
          <div className="dashboard-favorites">
            {favoriteItems.map(
              (item) => (
                <div
                  className="dashboard-item-card"
                  key={
                    item.item_id
                  }
                  onClick={() =>
                    navigate(
                      `/clothing/${item.item_id}`
                    )
                  }
                >
                  <div className="dashboard-item-image">
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

                  <div className="dashboard-item-info">
                    <div>
                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {
                          item.category
                        }
                      </p>
                    </div>

                    <span className="dashboard-heart">
                      ♥
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="dashboard-empty">
            <p>
              You haven't added any
              favorite clothing yet.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  "/wardrobe"
                )
              }
            >
              View Wardrobe
            </button>
          </div>
        )}
      </section>

      {/* Recently worn outfits */}
      <section className="dashboard-section">
        <DashboardSectionHeader
          title="Recently Worn"
        />

        {wearHistory.length > 0 ? (
          <div className="dashboard-worn-list">
            {wearHistory
              .slice(0, 3)
              .map(
                (entry) => (
                  <div
                    className="dashboard-worn-item"
                    key={
                      entry.history_id
                    }
                  >
                    <div className="dashboard-worn-preview">
                      {entry.items?.[0]
                        ?.image_url ? (
                        <img
                          src={getAssetUrl(
                            entry
                              .items[0]
                              .image_url
                          )}
                          alt={
                            entry.outfit_name
                          }
                        />
                      ) : (
                        <span>
                          No Image
                        </span>
                      )}
                    </div>

                    <div>
                      <h3>
                        {
                          entry.outfit_name
                        }
                      </h3>

                      <p>
                        Worn{" "}
                        {formatWornDate(
                          entry.worn_date
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <div className="dashboard-empty">
            <p>
              You haven't marked any
              outfits as worn yet.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  "/outfits"
                )
              }
            >
              View Outfits
            </button>
          </div>
        )}
      </section>

      <div className="dashboard-bottom-grid">
        {/* Recently saved outfits */}
        <section className="dashboard-section">
          <DashboardSectionHeader
            title="Recent Outfits"
            actionLabel="View All"
            onAction={() =>
              navigate(
                "/outfits"
              )
            }
          />

          {recentOutfits.length >
            0 ? (
            <div className="dashboard-outfits">
              {recentOutfits.map(
                (outfit) => (
                  <div
                    className="dashboard-outfit-card"
                    key={
                      outfit.outfit_id
                    }
                    onClick={() =>
                      navigate(
                        "/outfits"
                      )
                    }
                  >
                    <div className="dashboard-outfit-preview">
                      {outfit.items
                        ?.length >
                        0 ? (
                        outfit.items
                          .slice(
                            0,
                            4
                          )
                          .map(
                            (item) => (
                              <div
                                className="dashboard-outfit-item"
                                key={
                                  item.item_id
                                }
                              >
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
                                    {
                                      item.name
                                    }
                                  </span>
                                )}
                              </div>
                            )
                          )
                      ) : (
                        <div className="dashboard-outfit-empty">
                          No items
                        </div>
                      )}
                    </div>

                    <div className="dashboard-outfit-name">
                      <h3>
                        {
                          outfit.name
                        }
                      </h3>

                      {outfit.is_favorite && (
                        <span>
                          ♥
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="dashboard-empty">
              <p>
                You haven't created
                any outfits yet.
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(
                    "/outfits/create"
                  )
                }
              >
                Create Outfit
              </button>
            </div>
          )}
        </section>

        {/* Upcoming scheduled outfits */}
        <section className="dashboard-section">
          <DashboardSectionHeader
            title="Upcoming Outfits"
            actionLabel="View Calendar"
            onAction={() =>
              navigate(
                "/calendar"
              )
            }
          />

          {upcomingOutfits.length >
            0 ? (
            <div className="dashboard-upcoming-list">
              {upcomingOutfits.map(
                (schedule) => (
                  <div
                    className="dashboard-upcoming-item"
                    key={
                      schedule.schedule_id
                    }
                    onClick={() =>
                      navigate(
                        "/calendar",
                        {
                          state: {
                            selectedDate:
                              String(
                                schedule.scheduled_date
                              ).slice(0, 10),
                          },
                        }
                      )
                    }
                  >
                    <div className="dashboard-date-box">
                      {formatScheduleDate(
                        schedule.scheduled_date
                      )}
                    </div>

                    <div>
                      <h3>
                        {
                          schedule.outfit_name
                        }
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
                  navigate(
                    "/calendar"
                  )
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