import { useContext } from "react";
import { ToastContext } from "./ToastProvider";

export default function useToastContext() {
    return useContext(ToastContext);
}
