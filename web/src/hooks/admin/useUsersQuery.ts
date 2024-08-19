import { useQuery } from "@tanstack/react-query";
import AdminService from "../../services/AdminService";

export default function useUsersQuery() {
    const {
        data: users,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["users"],
        queryFn: () => AdminService.getUsers(),
    });

    return {
        users: users || [],
        isLoading,
        isSuccess,
        error,
    };
}
