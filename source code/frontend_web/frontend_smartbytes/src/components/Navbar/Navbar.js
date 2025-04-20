import './Navbar.scss';
import {useState} from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { NavLink,Link } from 'react-router-dom';
import { faHome, faList, faCog } from '@fortawesome/free-solid-svg-icons';
function Navbar(){
    const [showSidebar, setShowSidebar] = useState(false);
    const links = [
        {
            name: "Home",
            path:"/",
            icon: faHome
        },
        {
            name:"Recipes",
            path:"/recipes",
            icon: faList
        },
        {
            name: "Settings",
            path:"/settings",
            icon: faCog
        }
    ]
    function closeSidebar(){
        setShowSidebar(false);
    }
    return(
        <>
            <div className="navbar container">
                <a href="#" className="navbar__logo">
                    <span>Smart</span>Bytes
                </a>
                <div className = "navbar__menu">
                    {links.map(link=>(
                        <NavLink to={link.path} key={link.name}>{link.name}</NavLink>
                    ))}
                    {/* <a href="#">About</a> */}
                    {/* <a href="#">Recipes</a>
                    <a href="#">Recomendation</a>
                    <a href = "#">Settings</a> */}
                </div>
                <div className={showSidebar ? "navbar__button active" : "navbar__button"} onClick={() => setShowSidebar(true)}>
                    <div className = "bar"> </div>
                    <div className = "bar"> </div>
                    <div className = "bar"> </div>
                </div>
            </div>
            {showSidebar && <Sidebar close={closeSidebar}links = {links}/>}
        </>
    )
}
export default Navbar;