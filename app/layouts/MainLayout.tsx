import "../styles/main.css";
import React, { useState } from "react";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const [location, setLocation] = useState("");
  const [tableCount, setTableCount] = useState(2);
  const navigate = useNavigate();
  const routeLocation = useLocation();

  const handleLocationChange = (value: string) => {
    setLocation(value);
    // If we're not on the home page and the query is meaningful, go home
    if (routeLocation.pathname !== "/" && value.trim().length >= 2) {
      navigate("/");
    }
  };

  const handleTableCountChange = (value: number) => {
    setTableCount(value);
    // If we're not on the home page and the query is already meaningful, go home
    if (routeLocation.pathname !== "/" && location.trim().length >= 2) {
      navigate("/");
    }
  };

  return (
    <div className="page-container">
      <Header />
      <SearchForm
        location={location}
        tableCount={tableCount}
        onLocationChange={handleLocationChange}
        onTableCountChange={handleTableCountChange}
      />
      <main style={{ padding: "1rem" }}>
        {/* Share params to routes */}
        <Outlet context={{ location, tableCount }} />
      </main>
    </div>
  );
}
