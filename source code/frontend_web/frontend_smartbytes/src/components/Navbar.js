import './Navbar.scss';
function Navbar(){
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
            </div>
        </>
    )
}
export default Navbar;