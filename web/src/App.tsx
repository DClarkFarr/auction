import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ToastProvider from "./providers/ToastProvider";
import { Router } from "./router";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <Router />
            </ToastProvider>
        </QueryClientProvider>
    );
}

export default App;
