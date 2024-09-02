import { Footer } from "flowbite-react";

export default function HomeFooter() {
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
                    <Footer.Link href="#">About</Footer.Link>
                    <Footer.Link href="#">Privacy Policy</Footer.Link>
                    <Footer.Link href="#">Licensing</Footer.Link>
                    <Footer.Link href="#">Contact</Footer.Link>
                </Footer.LinkGroup>
            </Footer>
        </div>
    );
}
