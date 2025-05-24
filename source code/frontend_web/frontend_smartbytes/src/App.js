import React, { useState, useEffect } from "react";
import Home from "./pages/Home/Home";
import Recipes from "./pages/Recipe/Recipes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutDefault from "./pages/layout/LayoutDefault/LayoutDefault";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import "./styles/index.scss"; // Import file CSS chứa định nghĩa theme
import Error404 from "./pages/Error404/Error404";
function App() {
  // Khởi tạo theme từ localStorage hoặc mặc định là "light"
  localStorage.removeItem("theme");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Cập nhật data-theme trên thẻ <html> và lưu vào localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Hàm để toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      <Router>
        {/* Truyền toggleTheme xuống LayoutDefault để các trang con có thể sử dụng */}
        <Routes>
          <Route element={<LayoutDefault toggleTheme={toggleTheme} theme={theme} />}>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path ="/recipes/:id" element={<RecipeDetail/>}/>
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;