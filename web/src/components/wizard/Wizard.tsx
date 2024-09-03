import React from "react";
import { WizardContext } from "./useWizardHooks";
import WizardProvider from "./WizardProvider";
import WizardStep from "./Wizard/step/WizardStep";

export type WizardProps = React.PropsWithChildren<{
    initialActiveStep?: string;
    activeStep?: string;
    showStepper?: WizardContext["showStepper"];
    onShowStepper?: WizardContext["setShowStepper"];
    onChangeStep?: (step: string) => void;
    onCompleteWizard: WizardContext["onCompleteWizard"];
}>;
function WizardWrapper({
    children,
    showStepper = true,
    ...props
}: WizardProps) {
    return (
        <WizardProvider showStepper={showStepper} {...props}>
            {children}
        </WizardProvider>
    );
}

const Wizard = Object.assign(WizardWrapper, {
    Step: WizardStep,
});

export default Wizard;
