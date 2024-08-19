import { Outlet, useParams } from "react-router-dom";
import UsersList from "../../components/user/UsersList";

export default function UsersPage() {
    const params = useParams();

    if (params.id) {
        return <Outlet />;
    }

    return (
        <div>
            <h1 className="text-2xl mb-8">System Users</h1>
            <UsersList />
        </div>
    );
}
