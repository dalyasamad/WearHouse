// Renders a reusable React interface component.


import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

// Renders the reusable Layout interface component.
function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;