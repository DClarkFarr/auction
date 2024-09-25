import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import useUserStore, { useUserInitials } from "../../stores/useUserStore";
import { useAdminLayout } from "../AdminLayout";

export default function AdminHeader() {
    const { user, logout } = useUserStore();

    const userInitials = useUserInitials();

    const { menuOpen, toggleMenuOpen } = useAdminLayout();

    const onClickLogout = async () => {
        await logout();
    };

    const onClickToggle = () => {
        toggleMenuOpen(!menuOpen);
    };

    return (
        <Navbar
            theme={{
                root: {
                    base: "bg-cyan-800 px-2 py-2.5 sm:px-4",
                },
                brand: {
                    base: "flex items-center text-white",
                },
            }}
            fluid
        >
            <Navbar.Toggle onClick={onClickToggle} />
            <Navbar.Brand as={Link} href="/">
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
                            <span className="block text-sm">{user.name}</span>
                            <span className="block truncate text-sm font-medium">
                                {user.email}
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Item>
                            <Link to="/admin">Dashboard</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/admin/products">Manage Products</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/admin/settings">Site Settings</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/account/profile">Profile Settings</Link>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={onClickLogout}>
                            Sign out
                        </Dropdown.Item>
                    </Dropdown>
                )}
            </div>
        </Navbar>
    );
}
