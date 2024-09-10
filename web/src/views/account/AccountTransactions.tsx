import { Outlet, useParams } from "react-router-dom";
import TransactionList from "../../components/transaction/TransactionList";

export default function AccountTransactions() {
    const params = useParams();

    const transactionId = params.id;

    return transactionId ? <Outlet /> : <TransactionList />;
}
