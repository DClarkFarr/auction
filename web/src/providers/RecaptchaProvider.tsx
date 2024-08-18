import { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function RecaptchaProvider({
    children,
}: {
    target?: string | HTMLElement;
    children: ReactNode;
}) {
    const key = import.meta.env.VITE_RECAPTCHA_KEY;

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={key}
            scriptProps={{
                async: true, // optional, default to false,
                defer: true, // optional, default to false
                appendTo: "head", // optional, default to "head", can be "head" or "body",
                nonce: undefined, // optional, default undefined
            }}
            container={{
                // optional to render inside custom element
                // element: target,
                parameters: {
                    // badge: "[inline|bottomright|bottomleft]", // optional, default undefined
                    // theme: "dark", // optional, default undefined
                },
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
