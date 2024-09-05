import { wizardStyles } from "../../wizard.styles";
import { useWizardStepContext } from "./useWizardStepContext";
import WizardStepProvider from "./WizardStepProvider";

export type WizardStepProps = React.PropsWithChildren<{
    id: string;
    label: string;
    components?: Partial<{
        Heading: (props: StepHeadingProps) => React.ReactNode;
    }>;
}>;

function WizardStepWrapper({
    children,
    components = {},
    ...props
}: WizardStepProps) {
    const { Heading = StepHeading } = components;
    return (
        <WizardStepProvider {...props}>
            <WizardStepVisibilityController>
                <Heading />
                {children}
            </WizardStepVisibilityController>
        </WizardStepProvider>
    );
}

function WizardStepVisibilityController({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isActive } = useWizardStepContext();
    if (!isActive) {
        return null;
    }
    return (
        <div className="step" css={wizardStyles.step}>
            {children}
        </div>
    );
}

export type StepHeadingProps = {
    title?: string | React.ReactNode;
};
function StepHeading({ title }: StepHeadingProps) {
    const { stepData } = useWizardStepContext();
    return (
        <div className="step__heading" css={wizardStyles.stepHeading}>
            {typeof title !== "undefined" ? title : stepData.label}
        </div>
    );
}

function StepBody({ children }: { children: React.ReactNode }) {
    return <div className="step__body">{children}</div>;
}

const WizardStep = Object.assign(WizardStepWrapper, {
    Body: StepBody,
    Heading: StepHeading,
});

export default WizardStep;
