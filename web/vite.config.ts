import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Inspect from "vite-plugin-inspect";
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxImportSource: "@emotion/react",
        }),
        Icons({ compiler: "jsx", jsx: "react" }),
        Inspect(),
    ],
});
