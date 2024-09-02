import { Footer } from "flowbite-react";
import { useNavigate } from "react-router-dom";

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
    return (
        <div className="container">
            <Footer
                theme={{
                    root: {
                        base: "w-full rounded-lg bg-white shadow dark:bg-gray-900 md:flex md:items-center md:justify-between mt-4",
                        container: "w-full p-6",
                        bgDark: "bg-gray-900",
                    },
                }}
                bgDark
                container
            >
                <Footer.Copyright href="#" by="Auction" year={2024} />
                <Footer.LinkGroup>
                    <Footer.Link href="/" onClick={handleLinkClick}>
                        Home
                    </Footer.Link>
                    <Footer.Link href="/shop" onClick={handleLinkClick}>
                        Shop
                    </Footer.Link>
                    <Footer.Link href="/categories" onClick={handleLinkClick}>
                        Categories
                    </Footer.Link>
                    <Footer.Link href="#" onClick={handleLinkClick}>
                        Contact
                    </Footer.Link>
                </Footer.LinkGroup>
            </Footer>
        </div>
    );
}
