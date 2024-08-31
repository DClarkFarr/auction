import AmexIcon from "~icons/fa6-brands/cc-amex";
import DinersIcon from "~icons/fa6-brands/cc-diners-club";
import DiscoverIcon from "~icons/fa6-brands/cc-discover";
import JbcIcon from "~icons/fa6-brands/cc-jcb";
import MasterIcon from "~icons/fa6-brands/cc-mastercard";
import VisaIcon from "~icons/fa6-brands/cc-visa";
import DefaultIcon from "~icons/ic/baseline-credit-card";
import { PaymentMethod } from "../../stores/useUserStore";
import { ReactNode } from "react";

const brandIcons = {
    american_express: AmexIcon,
    diners_club: DinersIcon,
    discover: DiscoverIcon,
    jcb: JbcIcon,
    mastercard: MasterIcon,
    visa: VisaIcon,
};
export default function CardDetails({
    paymentMethod,
    actions,
}: {
    paymentMethod: PaymentMethod;
    actions?: ReactNode;
}) {
    const Icon =
        brandIcons[paymentMethod.display_brand as keyof typeof brandIcons] ||
        DefaultIcon;

    return (
        <div className="border border-gray-300 rounded p-4">
            <div className="flex w-full items-center gap-4">
                <div className="text-xl text-purple-600">
                    <Icon />
                </div>
                <div>
                    <span className="text-sm text-gray-500">
                        Last 4 Digits:{" "}
                    </span>
                    <span className="font-semibold">{paymentMethod.last4}</span>
                </div>
                <div>
                    <span className="text-sm text-gray-500">
                        Expiration Date:{" "}
                    </span>
                    <span className="font-semibold">
                        {paymentMethod.exp_month}/{paymentMethod.exp_year}
                    </span>
                </div>
                {actions && <div className="ml-auto">{actions}</div>}
            </div>
        </div>
    );
}
