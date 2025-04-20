import './Footer.scss';
function Footer(){
    return(
        <>
            <div className = "footer container">
                <div className="footer-section">
                    <p className = "title">SmartBytes.com</p>
                    <p>SmartBytes is a place where you can please your soul and tummy with delicious food recipies ò all cuisine.
                        And our service is absolutely free.
                    </p>
                    <p>&copy; 2025 | All Rights Reserved</p>
                </div>

                <div className="footer-section">
                    <p className = "title">SmartBytes.com</p>
                    <p>smartbytes@gmail.com</p>
                    <p>+849-3743-2511</p>
                    <p>4 Dich Vong Street, Ha Noi</p>
                </div>

                <div className="footer-section">
                    <p className = "title">Contact Us</p>
                    <p>Facebook</p>
                    <p>X/Twitter</p>
                    <p>Instagram</p>
                </div>
            </div>
        </>
    )
}
export default Footer;