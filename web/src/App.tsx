import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "./router";
import ToastProvider from "./providers/ToastProvider";
const queryClient = new QueryClient();

function App() {
    return (
        <>
            <ToastProvider>
                <QueryClientProvider client={queryClient}>
                    <Router />
                </QueryClientProvider>
            </ToastProvider>
        </>
    );
}

export default App;
