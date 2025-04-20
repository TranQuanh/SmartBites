import Home from "./pages/Home/Home";
import Recipes from "./pages/Recipe/Recipes";
import Settings from "./pages/Setting/Settings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutDefault from "./pages/layout/LayoutDefault/LayoutDefault";
function App() {
  return (
      <>
        <Router>
          <Routes>
            <Route element={<LayoutDefault />}>
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </>
  );
}

export default App;
