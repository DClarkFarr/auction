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
        path: "/",
        element: <HomeLayout />,
        errorElement: <ErrorPage />,
        children: [
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
                path: "",
                element: <DashboardPage />,
            },
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
