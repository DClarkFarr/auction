import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
    theme: {
        extend: {
            colors: {
                //  cyan
                cyan: {
                    50: "#f9ebf0",
                    100: "#f2d4de",
                    200: "#e6a9bb",
                    300: "#d87397",
                    400: "#c43a66",
                    500: "#a52153",
                    600: "#87043f",
                    700: "#5c0e34",
                    800: "#4a0b2a",
                    900: "#3a0820",
                },
            },
        },
    },
    plugins: [flowbite.plugin()],
};
