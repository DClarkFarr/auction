import { Footer } from "flowbite-react";

export default function HomeFooter() {
    return (
        <div className="container">
            <Footer>
                <Footer.Copyright href="#" by="Auction" year={2022} />
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
