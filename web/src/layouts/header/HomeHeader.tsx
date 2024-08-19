import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import useUserStore, { useUserInitials } from "../../stores/useUserStore";

export default function HomeHeader() {
    const { user, logout } = useUserStore();

    const userInitials = useUserInitials();

    const onClickLogout = async () => {
        await logout();
    };

    return (
        <div className="container">
            <Navbar>
                <Navbar.Brand as={Link} href="https://flowbite-react.com">
                    <img
                        src="https://placehold.co/150x80"
                        className="mr-3 h-6 sm:h-9"
                        alt="Auction Logo"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Auction
                    </span>
                </Navbar.Brand>
                <div className="ml-auto"></div>
                <div className="flex md:order-2">
                    {user && (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="User settings"
                                    placeholderInitials={userInitials || ""}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className="block text-sm">
                                    {user.name}
                                </span>
                                <span className="block truncate text-sm font-medium">
                                    {user.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item>Dashboard</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Earnings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={onClickLogout}>
                                Sign out
                            </Dropdown.Item>
                        </Dropdown>
                    )}

                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse className="md:mr-4">
                    <Navbar.Link href="#" active>
                        Home
                    </Navbar.Link>
                    <Navbar.Link href="#">About</Navbar.Link>
                    <Navbar.Link href="#">Services</Navbar.Link>
                    <Navbar.Link href="#">Pricing</Navbar.Link>
                    <Navbar.Link href="#">Contact</Navbar.Link>
                    {!user && (
                        <>
                            <Navbar.Link className="ml-4" href="/login">
                                Log in
                            </Navbar.Link>
                            <Navbar.Link href="/sign-up">Sign up</Navbar.Link>
                        </>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}
