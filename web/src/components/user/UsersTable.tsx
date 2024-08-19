import { Alert, Table } from "flowbite-react";
import { User } from "../../types/User";
import { DateTime } from "luxon";

export function UsersTable({ users }: { users: User[] }) {
    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Joined At</Table.HeadCell>
                    <Table.HeadCell>Role</Table.HeadCell>
                    <Table.HeadCell>Joined At</Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {!users.length && (
                        <Table.Row>
                            <Table.Cell colSpan={6}>
                                <Alert color="info">No users yet</Alert>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {users.map((user) => {
                        return (
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                </Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>TODO</Table.Cell>
                                <Table.Cell>{user.role}</Table.Cell>
                                <Table.Cell>
                                    {DateTime.fromISO(
                                        user.createdAt
                                    ).toLocaleString(DateTime.DATE_MED)}
                                </Table.Cell>
                                <Table.Cell>
                                    <a
                                        href="#"
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                        TODO
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
}
