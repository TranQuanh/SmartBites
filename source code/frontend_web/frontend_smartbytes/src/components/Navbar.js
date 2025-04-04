import './Navbar.scss';
import {useState} from 'react';
function Navbar(){
    const [showSidebar, setShowSidebar] = useState(false);

    return(
        <>
            <div className="navbar container">
                <a href="#" className="navbar__logo">
                    <span>Smart</span>Bytes
                </a>
                <div className = "navbar__menu">
                    <a href="#" >Home</a>
                    {/* <a href="#">About</a> */}
                    <a href="#">Recipes</a>
                    <a href="#">Recomendation</a>
                    <a href = "#">Settings</a>
                </div>
                <div className={showSidebar ? "navbar__button active" : "navbar__button"} onClick={() => setShowSidebar(!showSidebar)}>
                    <div className = "bar"> </div>
                    <div className = "bar"> </div>
                    <div className = "bar"> </div>
                </div>
            </div>
        </>
    )
}
export default Navbar;