import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomeRoute from "./routes/home";
import RestaurantDetailsRoute from "./routes/restaurant-details";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomeRoute />} />
        <Route path="restaurants/:id" element={<RestaurantDetailsRoute />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
