import { useWizardStepContext } from "./useWizardStepContext";
import WizardStepProvider from "./WizardStepProvider";

export type WizardStepProps = React.PropsWithChildren<{
    id: string;
    label: string;
}>;

function WizardStepWrapper({ children, ...props }: WizardStepProps) {
    return <WizardStepProvider {...props}>{children}</WizardStepProvider>;
}

function StepBody({ children }: { children: React.ReactNode }) {
    const { isActive } = useWizardStepContext();
    return <>{isActive ? children : null}</>;
}
const WizardStep = Object.assign(WizardStepWrapper, {
    Body: StepBody,
});

export default WizardStep;
