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
import AccountTransactionDetails from "./views/account/transactions/AccountTransactionDetails";
import AccountTransactions from "./views/account/AccountTransactions";

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
                path: "shop",
                element: <ShopPage />,
            },
            {
                path: "shop/single/:itemId",
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
                path: "transactions",
                element: <AccountTransactions />,
                children: [
                    {
                        path: ":id",
                        element: <AccountTransactionDetails />,
                    },
                ],
            },
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
