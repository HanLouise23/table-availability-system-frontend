import React, { useState } from "react";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const [location, setLocation] = useState("");
  const [tableCount, setTableCount] = useState(2);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/");
  };

  return (
    <div>
      <Header />
      <SearchForm
        location={location}
        tableCount={tableCount}
        onLocationChange={setLocation}
        onTableCountChange={setTableCount}
        onSearch={handleSearch}
      />
      <main style={{ padding: "1rem" }}>
        <Outlet context={{ location, tableCount }} />
      </main>
    </div>
  );
}
