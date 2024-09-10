import { useParams } from "react-router-dom";
import TransactionDetails from "../../../components/transaction/TransactionDetails";

export default function AccountTransactionDetails() {
    const params = useParams();

    const transactionId = Number(params.id!);

    return <TransactionDetails transactionId={transactionId} />;
}
