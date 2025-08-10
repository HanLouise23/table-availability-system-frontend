import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomeRoute from "./routes/home";
import RestaurantDetailsPage from "./routes/restaurant_details";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomeRoute />} />
        <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
