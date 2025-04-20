import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
function LayoutDefault(){
    return(
        <>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    )
}
export default LayoutDefault;