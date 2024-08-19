import { Alert, Spinner } from "flowbite-react";
import useUsersQuery from "../../hooks/admin/useUsersQuery";
import { UsersTable } from "./UsersTable";

export default function UsersList() {
    const { users, isLoading, error } = useUsersQuery();

    if (isLoading) {
        return (
            <div className="p-10">
                <Spinner aria-label="Loading Users" /> Loading Users...
            </div>
        );
    }

    if (error) {
        return (
            <Alert color="failure">
                <b>Error loading users</b>
                <div>{error.message}</div>
            </Alert>
        );
    }

    return <UsersTable users={users} />;
}
