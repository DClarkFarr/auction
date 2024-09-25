import { Footer } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { homeRoutes } from "../../router";

export default function HomeFooter() {
    const navigate = useNavigate();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const target = e.nativeEvent.target as HTMLAnchorElement;
        if (target) {
            e.preventDefault();
            const href = target.getAttribute("href")!;
            navigate(href);
        }
    };

    const year = new Date().getFullYear();
    return (
        <Footer
            theme={{
                root: {
                    base: "w-full bg-white shadow dark:bg-gray-900 md:flex md:items-center md:justify-between mt-4",
                    container: "w-full p-6",
                    bgDark: "bg-gray-900",
                },
            }}
            bgDark
            container
        >
            <div className="container flex flex:wrap gap-4">
                <Footer.Copyright
                    by="Southern Utah Bargain Bin Auctions"
                    year={year}
                />
                <Footer.LinkGroup className="ml-auto">
                    <Footer.Link href="/" onClick={handleLinkClick}>
                        Home
                    </Footer.Link>
                    <Footer.Link
                        href={homeRoutes.shop.to}
                        onClick={handleLinkClick}
                    >
                        Bid Now
                    </Footer.Link>
                    <Footer.Link
                        href={homeRoutes.howItWorks.to}
                        onClick={handleLinkClick}
                    >
                        How it works
                    </Footer.Link>
                    <Footer.Link
                        href={homeRoutes.aboutUs.to}
                        onClick={handleLinkClick}
                    >
                        About us
                    </Footer.Link>
                    <Footer.Link
                        href={homeRoutes.contactUs.to}
                        onClick={handleLinkClick}
                    >
                        Contact Us
                    </Footer.Link>
                </Footer.LinkGroup>
            </div>
        </Footer>
    );
}
