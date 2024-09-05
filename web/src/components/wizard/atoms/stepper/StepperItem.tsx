import { StepData, useWizardContext } from "../../useWizardHooks";
import { StepperColorProps, wizardStyles } from "../../wizard.styles";

export type WizardStepperItemProps = {
    step: StepData;
    index: number;
};
export function WizardStepperItem({ step, index }: WizardStepperItemProps) {
    const { activeStep, activeStepIndex, steps } = useWizardContext();

    const styleProps: StepperColorProps = {
        prev: index < activeStepIndex,
        next: index === activeStepIndex + 1,
        active: step.id === activeStep,
        complete: step.isComplete,
        valid: step.isValid,
        index,
        maxIndex: steps.length - 1,
    };
    return (
        <div
            className="stepper__item"
            css={wizardStyles.stepperItem(styleProps)}
        >
            <div
                className="stepper__icon-wrapper"
                css={wizardStyles.stepperIconWrapper}
            >
                <div
                    className="stepper__progress stepper__progress--down"
                    css={wizardStyles.stepProgress(styleProps, false)}
                ></div>
                <div
                    className="stepper__progress stepper__progress--up"
                    css={wizardStyles.stepProgress(styleProps, true)}
                ></div>
                <div
                    className="stepper__icon"
                    css={wizardStyles.stepperIcon(styleProps)}
                >
                    <div className="stepper__icon-text">{index + 1}</div>
                </div>
            </div>
            <div className="stepper__label" css={wizardStyles.stepperLabel}>
                <div
                    className="stepper__label-text"
                    css={wizardStyles.stepperLabelText}
                >
                    {step.label}
                </div>
            </div>
        </div>
    );
}
