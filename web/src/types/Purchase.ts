import { FullProductItem } from "./Product";
import { User } from "./User";

export type Purchase = {
    id_purchase: number;
    id_user: number;
    id_transaction_external: string;
    totalAmount: number;
    createdAt: string;
};

export type FullPurchase = Purchase & { items: FullProductItem[]; user: User };
