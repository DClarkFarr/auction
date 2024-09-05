import { useWizardContext } from "../../useWizardHooks";
import { wizardStyles } from "../../wizard.styles";
import { WizardStepperItem, WizardStepperItemProps } from "./StepperItem";

export type WizardStepperProps = {
    components?: Partial<{
        Item: (props: WizardStepperItemProps) => React.ReactNode;
    }>;
};
export function WizardStepperWrapper({ components = {} }: WizardStepperProps) {
    const { steps } = useWizardContext();

    const { Item = WizardStepperItem } = components;

    if (!steps.length) {
        return null;
    }
    return (
        <div className="stepper" css={wizardStyles.stepper}>
            {steps.map((step, i) => (
                <Item key={step.id} step={step} index={i} />
            ))}
        </div>
    );
}

const WizardStepper = Object.assign(WizardStepperWrapper, {
    Item: WizardStepperItem,
});

export default WizardStepper;
