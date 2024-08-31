import FeaturedCategoryGrid from "../components/category/FeaturedCategoryGrid";
import { HomeCarousel } from "../components/home/HomeCarousel";

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
        </>
    );
}
