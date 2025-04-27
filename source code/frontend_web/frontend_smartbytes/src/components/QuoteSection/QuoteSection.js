import './QuoteSection.scss';
import { FaQuoteLeft,FaQuoteRight } from "react-icons/fa6";

function QuoteSection(){
    return(
        <>
        <div className = "section quote container main">
            <p className="quote-text">
            <div className="quote-left"><FaQuoteLeft /></div>
                Food is everything we are. It's an extension of nationalist feeling,
                ethnic feeling, your personal history, your province, your region, your tribe, your grandma.
                It's inseparable from those from the get-go.
                <div className="quote-right"><FaQuoteRight /></div>
            </p>
            <p className="quote-author">- Anthony Bourdain</p>
        </div>
        </>
    )
}
export default QuoteSection;