export type UserRole = "admin" | "user";

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
};

export type RegisterPayload = {
    email: string;
    password: string;
    token: string;
};
