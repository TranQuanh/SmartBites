import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

function LayoutDefault({ toggleTheme, theme }) {
  return (
    <div>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
        <Outlet />
      <Footer />
    </div>
  );
}

export default LayoutDefault;