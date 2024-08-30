import { CardElement } from "@stripe/react-stripe-js";
import {
    StripeCardElement,
    StripeCardElementChangeEvent,
} from "@stripe/stripe-js";
import { Button } from "flowbite-react";
import { useState } from "react";

/**
 * Should be inside <StripeProvider>
 */
export default function StripeCardForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const onReady = (e: StripeCardElement) => {
        console.log("ready event was", e);

        setIsReady(true);
    };

    const onChange = (e: StripeCardElementChangeEvent) => {
        console.log("change event was", e);

        setIsValid(e.complete);
    };

    <form>
        <div>ready: {isReady}</div>
        <div>valid: {isValid}</div>
        <CardElement
            onReady={onReady}
            onChange={onChange}
            options={{ disabled: isSubmitting }}
        />
        <div>
            <Button type="submit">Save</Button>
        </div>
    </form>;
}
