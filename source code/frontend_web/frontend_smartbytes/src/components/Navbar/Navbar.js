import './Navbar.scss';
import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faCog, faSun, faMoon, faBookmark } from '@fortawesome/free-solid-svg-icons';
function Navbar({ toggleTheme, theme }) {
    const [showSidebar, setShowSidebar] = useState(false);
    const links = [
        {
            name: "Home",
            path: "/",
            icon: faHome
        },
        {
            name: "Recipes",
            path: "/recipes",
            icon: faList
        },
        {
            name: "Save Recipes",
            path: "/save-recipes",
            icon: faBookmark
        }
        // {
        //     name: "Settings",
        //     path:"/settings",
        //     icon: faCog
        // }
    ]
    function closeSidebar() {
        setShowSidebar(false);
    }
    return (
        <>
            <div className="navbar container">
                <a href="#" className="navbar__logo">
                    <span>Smart</span>Bytes
                </a>
                <div className="navbar__menu">
                    {/* Theme */}
                    <div className="navbar__theme-toggle">
                        <button onClick={toggleTheme} className=" theme-toggle-btn">
                            {theme === "light" ? (
                                <span >
                                    <FontAwesomeIcon icon={faSun} className="sidebar__icon" />
                                </span>
                            ) : (
                                <span>
                                    <FontAwesomeIcon icon={faMoon} className="sidebar__icon" />
                                </span>
                            )}
                        </button>
                    </div>
                    {/* theme */}
                    {links.slice(0, -1).map(link => (
                        <NavLink className="navi-trans" to={link.path} key={link.name}>{link.name}</NavLink>
                    ))}
                    <a className="btn btn-primary">
                        <FontAwesomeIcon icon={faBookmark} className="sidebar__icon" />
                        <span className="span">Saved Reciped</span>
                    </a>
                    <div className={showSidebar ? "navbar__button active" : "navbar__button"} onClick={() => setShowSidebar(true)}>
                        <div className="bar"> </div>
                        <div className="bar"> </div>
                        <div className="bar"> </div>
                    </div>
                </div>
            </div>
            {showSidebar && <Sidebar close={closeSidebar} links={links} />}
        </>
    )
}
export default Navbar;