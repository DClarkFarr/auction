import {
    createBrowserRouter,
    RouterProvider,
    UNSAFE_ErrorResponseImpl,
    useRouteError,
} from "react-router-dom";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./views/SignupPage";
import AdminLayout, { AdminLayoutProvider } from "./layouts/AdminLayout";
import DashboardPage from "./views/admin/DashboardPage";
import ProductsPage from "./views/admin/ProductsPage";
import UsersPage from "./views/admin/UsersPage";
import UserSinglePage from "./views/admin/Users/UserSinglePage";
import ProductSinglePage from "./views/admin/Products/ProductSinglePage";
import CategoriesPage from "./views/admin/CategoriesPage";
import SettingsPage from "./views/admin/SettingsPage";
import ShopPage from "./views/ShopPage";
import ShopSinglePage from "./views/Shop/ShopSinglePage";
import ShopCategoriesPage from "./views/CategoriesPage";
import CategoriesSinglePage from "./views/Categories/CategoriesSinglePage";
import TestPage from "./views/TestPage";
import AccountLayout from "./layouts/AccountLayout";
import AccountProfile from "./views/account/AccountProfile";
import ProductInventoryPage from "./views/admin/Products/ProductInventoryPage";
import AccountBids from "./views/account/AccountBids";
import AccountFavorites from "./views/account/AccountFavorites";
import AccountPurchases from "./views/account/AccountPurchases";
import AccountPurchaseDetails from "./views/account/purchases/AccountPurchaseDetails";
import ForgotPasswordPage from "./views/ForgotPasswordPage";

function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    if (!(error instanceof UNSAFE_ErrorResponseImpl)) {
        return <div>I don't know what this is</div>;
    }

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.data}</i>
            </p>
        </div>
    );
}

export const homeRoutes = {
    home: {
        to: "/",
        exact: true,
    },
    shop: {
        to: "/bid",
        exact: false,
    },
    categories: {
        to: "/categories",
        exact: false,
    },
    aboutUs: {
        to: "/about-us",
        exact: true,
    },
    contactUs: {
        to: "/contact",
        exact: true,
    },
    howItWorks: {
        to: "/how-it-works",
        exact: true,
    },
    login: {
        to: "/login",
        exact: true,
    },
    signUp: {
        to: "/sign-up",
        exact: true,
    },
    forgotPassword: {
        to: "/forgot-password",
        exact: true,
    },
};

const router = createBrowserRouter([
    {
        path: "/test",
        element: <TestPage />,
    },
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "bid",
                element: <ShopPage />,
            },
            {
                path: "bid/single/:itemId",
                element: <ShopSinglePage />,
            },
            {
                path: "categories",
                element: <ShopCategoriesPage />,
                children: [
                    {
                        path: ":categorySlug",
                        element: <CategoriesSinglePage />,
                    },
                ],
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "sign-up",
                element: <SignupPage />,
            },
            {
                path: "forgot-password",
                element: <ForgotPasswordPage />,
            },
            {
                path: "",
                element: <HomePage />,
            },
        ],
    },
    {
        path: "/admin",
        element: (
            <AdminLayoutProvider>
                <AdminLayout />
            </AdminLayoutProvider>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: "products",
                element: <ProductsPage />,
                children: [
                    {
                        path: ":id",
                        element: <ProductSinglePage />,
                    },
                    {
                        path: ":id/inventory",
                        element: <ProductInventoryPage />,
                    },
                ],
            },
            {
                path: "categories",
                element: <CategoriesPage />,
            },
            {
                path: "users",
                element: <UsersPage />,
                children: [
                    {
                        path: ":id",
                        element: <UserSinglePage />,
                    },
                ],
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },
            {
                path: "",
                element: <DashboardPage />,
            },
        ],
    },
    {
        path: "/account",
        element: <AccountLayout />,
        children: [
            {
                path: "profile",
                element: <AccountProfile />,
            },
            {
                path: "bids",
                element: <AccountBids />,
            },
            {
                path: "favorites",
                element: <AccountFavorites />,
            },
            {
                path: "purchases",
                element: <AccountPurchases />,
                children: [
                    {
                        path: ":id",
                        element: <AccountPurchaseDetails />,
                    },
                ],
            },
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
