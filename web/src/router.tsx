import {
    createBrowserRouter,
    RouterProvider,
    UNSAFE_ErrorResponseImpl,
    useRouteError,
} from "react-router-dom";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";

function ErrorPage() {
    const error = useRouteError();
    console.log(error);

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
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
