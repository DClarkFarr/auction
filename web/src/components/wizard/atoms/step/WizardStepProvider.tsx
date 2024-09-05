import React from "react";
import { WizardStepContext } from "./useWizardStepContext";
import { WizardStepProps } from "./WizardStep";
import { StepData, useWizardContext } from "../../useWizardHooks";
import { isEqual } from "lodash-es";

export default function WizardStepProvider({
    id,
    label,
    isValid = true,
    isComplete = true,
    children,
    showCancelAction: showCancelActionControl,
}: WizardStepProps) {
    const {
        setStepData: registerStepData,
        activeStep,
        steps,
        showCancelActions,
    } = useWizardContext();

    const [stepData, setStepData] = React.useState<StepData>({
        id,
        label,
        isValid,
        isComplete,
    });

    const prevStepData = React.useRef<StepData | null>(null);

    /**
     * Send step data to parent context
     */
    React.useEffect(() => {
        if (!isEqual(prevStepData.current, stepData)) {
            registerStepData(stepData);
        }
        prevStepData.current = { ...stepData };
    }, [stepData, registerStepData]);

    /**
     * If valid / complete props are given, use them as source of truth
     */
    React.useEffect(() => {
        setStepData((prev) => ({ ...prev, isValid, isComplete }));
    }, [isValid, isComplete]);

    const setValid = React.useCallback((isValid: boolean) => {
        setStepData((prev) => ({ ...prev, valid: isValid }));
    }, []);

    const setComplete = React.useCallback((isComplete: boolean) => {
        setStepData((prev) => ({ ...prev, complete: isComplete }));
    }, []);

    const stepIndex = React.useMemo(() => {
        return steps.findIndex((s) => s.id === stepData.id);
    }, [steps, stepData]);

    const isActive = React.useMemo(() => {
        return activeStep === stepData.id;
    }, [activeStep, stepData]);

    const nextStep = React.useMemo(() => {
        return steps[stepIndex + 1]?.id || null;
    }, [stepIndex, steps]);

    const prevStep = React.useMemo(() => {
        return steps[stepIndex - 1]?.id || null;
    }, [stepIndex, steps]);

    const showCancelAction = React.useMemo(() => {
        return typeof showCancelActionControl === "boolean"
            ? showCancelActionControl
            : showCancelActions;
    }, [showCancelActionControl, showCancelActions]);

    return (
        <WizardStepContext.Provider
            value={{
                stepData,
                isActive,
                stepIndex,
                nextStep,
                prevStep,
                showCancelAction,
                setStepData,
                setValid,
                setComplete,
            }}
        >
            {children}
        </WizardStepContext.Provider>
    );
}
