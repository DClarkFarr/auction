import { contextFactory } from "../../../../utils/context";
import { StepData } from "../../useWizardHooks";

export type WizardStepContext = {
    stepData: StepData;
    stepIndex: number;
    nextStep: string | null;
    prevStep: string | null;
    isActive: boolean;
    setStepData: (sd: StepData) => void;
    setValid: (isValid: boolean) => void;
    setComplete: (isComplete: boolean) => void;
};

export const [WizardStepContext, useWizardStepContext] =
    contextFactory<WizardStepContext>();
