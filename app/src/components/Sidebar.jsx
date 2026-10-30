// Renders a reusable React interface component.


import { NavLink } from "react-router-dom";

// Renders the reusable Sidebar interface component.
function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">WearHouse</h2>

      <nav>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Dashboard
        </NavLink>
        <NavLink to="/wardrobe">My Wardrobe</NavLink>
        <NavLink to="/clothing/add">Add Clothing</NavLink>
        <NavLink to="/outfits/create">Outfit Creator</NavLink>
        <NavLink to="/outfits" end className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}> Saved Outfits</NavLink>
        <NavLink to="/calendar">Outfit Calendar</NavLink>
        <NavLink to="/profile">Profile & Settings</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;