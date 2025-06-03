import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const LayoutComNavbar = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 24 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutComNavbar;
