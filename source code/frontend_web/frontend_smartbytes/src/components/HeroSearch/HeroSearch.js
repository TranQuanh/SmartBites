import './HeroSearch.scss';
import { MdLocalDining } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
function HeroSearch() {
    return (
        <>
            <div className="section container hero-search">
                <div className="banner-card">
                    <h1 className="display-large">Your desired dish?</h1>
                    <div className="search-wrapped">
                        <div className="leading-icon">
                            <MdLocalDining />
                        </div>
                        <input type="search" name="search" className="search-field body-medium" placeholder="Search recipes..." data-search-filed />
                        <button class="search-submit">
                            <IoSearch />
                        </button>
                    </div>
                    <p className="label-medium">
                        Search any recipe e.g: burger, pizza, sandwich, toast.
                    </p>
                </div>
            </div>
        </>
    )
}
export default HeroSearch;