import FeaturedCategoryGrid from "../components/category/FeaturedCategoryGrid";
import { HomeCarousel } from "../components/home/HomeCarousel";
import FeaturedProductGrid from "../components/product/FeaturedProductGrid";

export default function HomePage() {
    return (
        <>
            <section className="section">
                <div className="container">
                    <HomeCarousel />
                </div>
            </section>
            <section className="section py-4">
                <div className="container">
                    <FeaturedCategoryGrid />
                </div>
            </section>
            <section className="section py-4">
                <div className="container">
                    <FeaturedProductGrid />
                </div>
            </section>
        </>
    );
}
