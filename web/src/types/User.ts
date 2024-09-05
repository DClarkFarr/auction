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

export type UserFavorite = {
    id_favorite: number;
    id_item: number;
    id_user: number;
    createdAt: string;
};
