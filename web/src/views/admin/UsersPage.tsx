import { Outlet, useParams } from "react-router-dom";

export default function UsersPage() {
    const params = useParams();

    if (params.id) {
        return <Outlet />;
    }

    return <div>Users page</div>;
}
