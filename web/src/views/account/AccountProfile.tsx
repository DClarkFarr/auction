import { Label, TextInput } from "flowbite-react";
import Panel from "../../components/controls/Panel";
import useUserStore from "../../stores/useUserStore";
import ResetPasswordForm, {
    ResetPasswordState,
} from "../../components/user/ResetPasswordForm";
import UserService from "../../services/UserService";
import useToastContext from "../../providers/useToastContext";
import { AxiosError } from "axios";

export default function AccountProfile() {
    const { user } = useUserStore();
    const { toast } = useToastContext();

    if (!user) {
        return null;
    }

    const onSubmitPassword = async (data: ResetPasswordState) => {
        try {
            await UserService.changeUserPassword(user.id, data);
            toast({
                text: "Password updated successfully",
                type: "success",
            });
        } catch (err) {
            if (err instanceof AxiosError) {
                toast({
                    text: err.response?.data?.message || err.message,
                    type: "failure",
                });
            } else if (err instanceof Error) {
                toast({
                    text: err.message,
                    type: "failure",
                });
            }

            throw err;
        }
    };

    return (
        <div className="account-profile">
            <div className="container">
                <h1 className="text-2xl font-bold mb-10">Profile Setting</h1>
                <Panel title="Profile">
                    <div className="mb-4">
                        <Label>Name</Label>
                        <TextInput value={user.name} disabled />
                    </div>
                    <div className="mb-4">
                        <Label>Email</Label>
                        <TextInput value={user.email} disabled />
                    </div>
                </Panel>

                <div className="h-10"></div>

                <Panel title="Reset password">
                    <ResetPasswordForm onSubmit={onSubmitPassword} />
                </Panel>
            </div>
        </div>
    );
}
