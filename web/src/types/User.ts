export type UserRole = "admin" | "user";

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
};
