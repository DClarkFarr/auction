import { useCallback } from "react";
import useRedirect from "../hooks/useRedirect";
import { homeRoutes } from "../router";
import ForgotPasswordWizard from "../components/user/ForgotPasswordWizard";

export default function ForgotPasswordPage() {
    const { redirect } = useRedirect(homeRoutes.login.to);
    const onSuccess = useCallback(() => {
        redirect();
    }, []);

    return (
        <div>
            <div className="container">
                <div className="py-8 lg:py-[150px]">
                    <div className="flex justify-center">
                        <div className="w-[450px] max-w-full">
                            <ForgotPasswordWizard onSuccess={onSuccess} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
