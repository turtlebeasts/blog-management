import React from "react";
import { Outlet } from "react-router-dom";

import "./dashboard.css"; // Add styles
import Sidebar from "../../component/sidebar/Sidebar";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}
