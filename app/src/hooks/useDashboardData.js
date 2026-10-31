import {
  useEffect,
  useState,
} from "react";

import {
  getClothingItems,
} from "../services/clothingService";

import {
  getOutfits,
} from "../services/outfitService";

import {
  getSchedules,
} from "../services/scheduleService";

import {
  getWearHistory,
} from "../services/historyService";

// Loads the data used by the dashboard.
function useDashboardData() {
  const [clothing, setClothing] =
    useState([]);

  const [outfits, setOutfits] =
    useState([]);

  const [schedules, setSchedules] =
    useState([]);

  const [
    wearHistory,
    setWearHistory,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
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

        setClothing(
          clothingData
        );

        setOutfits(
          outfitData
        );

        setSchedules(
          scheduleData
        );

        setWearHistory(
          historyData
        );
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    clothing,
    outfits,
    schedules,
    wearHistory,
    loading,
    error,
  };
}

export default useDashboardData;