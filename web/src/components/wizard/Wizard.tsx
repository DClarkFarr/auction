import React from "react";
import { WizardContext } from "./useWizardHooks";
import WizardProvider from "./WizardProvider";
import WizardStep from "./atoms/step/WizardStep";
import { SerializedStyles } from "@emotion/react";
import { wizardStyles } from "./wizard.styles";
import WizardStepper from "./atoms/stepper/Stepper";

export type WizardProps = React.PropsWithChildren<{
    initialActiveStep?: string;
    activeStep?: string;
    showStepper?: WizardContext["showStepper"];
    showCancelActions?: WizardContext["showCancelActions"];
    onShowStepper?: WizardContext["setShowStepper"];
    onChangeStep?: (step: string) => void;
    onCompleteWizard: WizardContext["onCompleteWizard"];
    onCancelWizard?: WizardContext["onCancelWizard"];
    styles?: SerializedStyles;
    components?: Partial<{
        Stepper: () => React.ReactNode | null;
    }>;
}>;
function WizardWrapper({
    children,
    showStepper = true,
    styles: customStyles,
    components = {},
    ...props
}: WizardProps) {
    const { Stepper = WizardStepper } = components;

    return (
        <WizardProvider showStepper={showStepper} {...props}>
            <div className="wizard" css={[wizardStyles.wizard(), customStyles]}>
                {showStepper && (
                    <div
                        css={wizardStyles.stepperWrapper}
                        className="wizard__stepper"
                    >
                        <Stepper />
                    </div>
                )}
                <div
                    className="wizard__body"
                    css={wizardStyles.body(showStepper)}
                >
                    {children}
                </div>
            </div>
        </WizardProvider>
    );
}

const Wizard = Object.assign(WizardWrapper, {
    Step: WizardStep,
    Stepper: WizardStepper,
});

export default Wizard;
