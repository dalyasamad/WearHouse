// Defines the frontend application routes and layout.


import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./views/Dashboard";
import Wardrobe from "./views/Wardrobe";
import AddClothing from "./views/AddClothing";
import ClothingDetails from "./views/ClothingDetails";
import EditClothing from "./views/EditClothing";
import OutfitCreator from "./views/OutfitCreator";
import SavedOutfits from "./views/SavedOutfits";
import OutfitCalendar from "./views/OutfitCalendar";
import Profile from "./views/Profile";
import Login from "./views/Login";
import Register from "./views/Register";
import EditOutfit from "./views/EditOutfit";

// Implements the App operation for this module.
function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/wardrobe"
          element={<Wardrobe />}
        />

        <Route
          path="/clothing/add"
          element={<AddClothing />}
        />

        <Route
          path="/clothing/:id"
          element={<ClothingDetails />}
        />

        <Route
          path="/clothing/:id/edit"
          element={<EditClothing />}
        />

        <Route
          path="/outfits/create"
          element={<OutfitCreator />}
        />

        <Route
          path="/outfits"
          element={<SavedOutfits />}
        />

        <Route
          path="/calendar"
          element={<OutfitCalendar />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
        

        <Route
          path="/outfits/:id/edit"
          element={<EditOutfit />}
        />
      </Route>
      
    </Routes>
  );
}

export default App;