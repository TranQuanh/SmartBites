import './Sidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
function Sidebar({links,close}){
    return(
        <>
            <div className="sidebar__overlay" onClick={close}></div>
            <div className = "sidebar" onClick={close}>
                {links.map(link=>(
                    <NavLink to={link.path} key={link.name} className="sidebar__link">
                        <FontAwesomeIcon icon={link.icon} className="sidebar__icon" />
                        {link.name}
                    </NavLink>
                ))
                }
            </div>
        </>
    )
}
export default Sidebar;