import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import useUserStore, { useUserInitials } from "../../stores/useUserStore";
import { useMemo } from "react";

const homeRoutes = {
    home: {
        to: "/",
        exact: true,
    },
    shop: {
        to: "/shop",
        exact: false,
    },
    categories: {
        to: "/categories",
        exact: false,
    },
    login: {
        to: "/login",
        exact: true,
    },
    signUp: {
        to: "/sign-up",
        exact: true,
    },
};
export default function HomeHeader() {
    const { user, logout } = useUserStore();

    const userInitials = useUserInitials();

    const location = useLocation();

    const activeRouteName = useMemo(() => {
        const matched = Object.entries(homeRoutes)
            .map(([key, obj]) => {
                return { ...obj, key };
            })
            .filter((obj) => location.pathname.startsWith(obj.to));

        const fullMatched = matched.find((m) => m.to === location.pathname);

        if (fullMatched) {
            return fullMatched.key;
        }

        const exact = matched.find(
            (m) => m.exact && m.to === location.pathname
        );

        if (exact) {
            return exact.key;
        }

        const unexact = matched.find((obj) => !obj.exact);

        if (unexact?.to && !unexact.exact) {
            return unexact.key;
        }

        return null;
    }, [location]);

    const onClickLogout = async () => {
        await logout();
    };

    return (
        <div className="container">
            <div className="-mx-2 sm:-mx-6">
                <Navbar className="relative z-[70]">
                    <Navbar.Brand as={Link} to={homeRoutes.home.to}>
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
                    <div className="flex gap-x-2 md:order-2">
                        <Navbar.Toggle />

                        {user && (
                            <Dropdown
                                className="z-[70]"
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
                                {user.role === "admin" && (
                                    <>
                                        <Dropdown.Item>
                                            <Link className="block" to="/admin">
                                                Dashboard
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link
                                                className="block"
                                                to="/admin/products"
                                            >
                                                Manage Products
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link
                                                className="block"
                                                to="/admin/settings"
                                            >
                                                Site Settings
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link
                                                className="block"
                                                to="/account/profile"
                                            >
                                                Profile Settings
                                            </Link>
                                        </Dropdown.Item>
                                    </>
                                )}
                                {user.role === "user" && (
                                    <>
                                        <Dropdown.Item>
                                            <Link
                                                className="block"
                                                to="/account/profile"
                                            >
                                                Profile Settings
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link
                                                className="block"
                                                to="/account/purchases"
                                            >
                                                Purchase History
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link
                                                className="block"
                                                to="/account/favorites"
                                            >
                                                My Favorites
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link
                                                className="block"
                                                to="/account/bids"
                                            >
                                                My Bids
                                            </Link>
                                        </Dropdown.Item>
                                    </>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={onClickLogout}>
                                    Sign out
                                </Dropdown.Item>
                            </Dropdown>
                        )}
                    </div>
                    <Navbar.Collapse className="md:mr-4">
                        <Navbar.Link
                            as="span"
                            active={activeRouteName === "home"}
                        >
                            <Link className="block" to={homeRoutes.home.to}>
                                Home
                            </Link>
                        </Navbar.Link>
                        <Navbar.Link
                            as="span"
                            active={activeRouteName === "shop"}
                        >
                            <Link className="block" to={homeRoutes.shop.to}>
                                Shop
                            </Link>
                        </Navbar.Link>
                        <Navbar.Link
                            as="span"
                            active={activeRouteName === "categories"}
                        >
                            <Link
                                className="block"
                                to={homeRoutes.categories.to}
                            >
                                Categories
                            </Link>
                        </Navbar.Link>
                        {!user && (
                            <>
                                <Navbar.Link
                                    as="span"
                                    className="lg:ml-4"
                                    active={activeRouteName === "login"}
                                >
                                    <Link
                                        className="block"
                                        to={homeRoutes.login.to}
                                    >
                                        Log in
                                    </Link>
                                </Navbar.Link>
                                <Navbar.Link
                                    as="span"
                                    active={activeRouteName === "signup"}
                                >
                                    <Link
                                        className="block"
                                        to={homeRoutes.signUp.to}
                                    >
                                        Sign up
                                    </Link>
                                </Navbar.Link>
                            </>
                        )}
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>
    );
}
