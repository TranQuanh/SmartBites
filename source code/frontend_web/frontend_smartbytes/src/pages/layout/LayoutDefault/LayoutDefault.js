import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "../../../styles/index.scss";
function LayoutDefault({ toggleTheme, theme }) {
  return (
    <div className="app-container">
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default LayoutDefault;