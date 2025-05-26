import React, { useState, useEffect } from "react";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutDefault from "./pages/layout/LayoutDefault/LayoutDefault";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import "./styles/index.scss"; // Import file CSS chứa định nghĩa theme
import Error404 from "./pages/Error404/Error404";
import Recomendation from "./pages/Recomendation/Recomendation";
import SaveRecipes from "./pages/SaveRecipes/SaveRecipes";
// Đảm bảo đúng tên file: import Recipes from "./pages/Recipe/Recipe";
import Recipes from "./pages/Recipe/Recipe";
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
            <Route path="/recomendation" element={<Recomendation />} />
            <Route path="/save-recipes" element={<SaveRecipes />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;