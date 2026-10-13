import Books from "../others/Books";
import Cards from "../others/Cards";
import HeroSlider from "../others/HeroSlider";
import Newsletter from "../others/Newsletter";

export default function Main() {
    return(
        <div className="main">
            <HeroSlider />
            <Cards/>
            <Books />
            <Newsletter />
        </div>
    )
}