import { contextFactory } from "../../utils/context";

export type StepData = {
    id: string;
    label: string;
    isValid: boolean;
    isComplete: boolean;
};

export type PrevSteps = {
    id: string;
    index: number;
};

export type PrevNextStepProps = {
    orStep?: string;
    orIndex?: number;
};
export type PrevNextStepMethod = (props: PrevNextStepProps) => void;

export type WizardContext = {
    activeStep: string;
    setActiveStep: (step: string) => void;
    activeStepIndex: number;
    hasMoreSteps: boolean;
    steps: StepData[];
    showStepper: boolean;
    setShowStepper: (bool: boolean) => void;
    prevSteps: PrevSteps[];
    showNextStep: PrevNextStepMethod;
    showPrevStep: PrevNextStepMethod;
    onCompleteWizard: () => void;
    setStepData: (data: StepData) => void;
};

export const [WizardContext, useWizardContext] =
    contextFactory<WizardContext>();
