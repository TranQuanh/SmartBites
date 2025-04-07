import './Sidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Sidebar({links,close}){
    return(
        <>
            <div className = "sidebar" onClick={close}>
                {links.map(link=>(
                    <a href="#!" key={link.name} className="sidebar__link">
                        <FontAwesomeIcon icon={link.icon} className="sidebar__icon" />
                        {link.name}
                    </a>
                ))
                }
            </div>
        </>
    )
}
export default Sidebar;