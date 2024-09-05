import React, { useCallback, useMemo } from "react";
import { WizardProps } from "./Wizard";
import {
    PrevNextStepProps,
    StepData,
    useWizardContext,
    WizardContext,
} from "./useWizardHooks";

export type WizardProviderProps = WizardProps;

export default function WizardProvider({
    onCompleteWizard,
    onCancelWizard,
    showCancelActions: showCancelActionsControl,
    showStepper: showStepperControl,
    onShowStepper: setShowStepperControl,
    initialActiveStep,
    activeStep: activeStepControl,
    onChangeStep: onChangeStepControl,
    children,
}: WizardProviderProps) {
    const [showStepperInternal, setShowStepperInternal] = React.useState(true);

    const showStepper = React.useMemo(() => {
        return typeof showStepperControl === "boolean"
            ? showStepperControl
            : showStepperInternal;
    }, [showStepperControl, showStepperInternal]);

    const setShowStepper = React.useCallback(
        (bool: boolean) => {
            if (typeof setShowStepperControl === "function") {
                setShowStepperControl(bool);
                return;
            }

            if (typeof showStepperControl === "boolean") {
                throw new Error(
                    "This wizard is controlled externally. Stepper visibility cannot be changed at the step level"
                );
            }

            setShowStepperInternal(bool);
        },
        [setShowStepperControl]
    );

    const [activeStepInternal, onChangeStepInternal] = React.useState("");

    const [steps, setSteps] = React.useState<WizardContext["steps"]>([]);
    const [prevSteps, showPrevSteps] = React.useState<
        WizardContext["prevSteps"]
    >([]);

    const setStepData = React.useCallback((data: StepData) => {
        setSteps((prev) => {
            const found = prev.find((s) => s.id === data.id);
            if (found) {
                return prev.filter((s) => (s.id === data.id ? data : s));
            }
            return [...prev, data];
        });
    }, []);

    const addPrevStep = useCallback(
        (newPrevId: string) => {
            const newPrevIndex = steps.findIndex((s) => s.id === newPrevId);

            const pSteps = [
                ...prevSteps.filter((ps) => ps.index >= newPrevIndex),
                { id: newPrevId, index: newPrevIndex },
            ];
            showPrevSteps(pSteps);
        },
        [steps, prevSteps]
    );

    const activeStep = React.useMemo(() => {
        if (typeof activeStepControl === "string") {
            return activeStepControl;
        }
        return activeStepInternal;
    }, [activeStepControl, activeStepInternal]);

    const setActiveStep = React.useCallback(
        (step: string) => {
            if (activeStep === step) {
                return;
            }

            if (typeof onChangeStepControl === "function") {
                addPrevStep(activeStep);
                onChangeStepControl(step);
                return;
            }

            if (typeof activeStepControl === "string") {
                throw new Error(
                    "This wizard is controlled. Do not try to change step internally"
                );
            }

            addPrevStep(activeStep);
            onChangeStepInternal(step);
        },
        [
            activeStep,
            onChangeStepControl,
            onChangeStepInternal,
            addPrevStep,
            activeStepControl,
        ]
    );

    const activeStepIndex = useMemo(() => {
        return steps.findIndex((s) => s.id === activeStep);
    }, [activeStep, steps]);

    const hasMoreSteps = useMemo(() => {
        return steps.length - 1 > activeStepIndex;
    }, [activeStepIndex, steps]);

    const showNextStep = React.useCallback(
        ({ orIndex, orStep }: PrevNextStepProps = {}) => {
            let nextIndex = activeStepIndex + 1;
            if (typeof orStep === "string") {
                nextIndex = steps.findIndex((s) => s.id === orStep);
            } else if (typeof orIndex === "number") {
                nextIndex = orIndex;
            }

            if (nextIndex >= steps.length) {
                return onCompleteWizard();
            }

            setActiveStep(steps[nextIndex].id);
        },
        [steps, activeStepIndex, setActiveStep, onCompleteWizard]
    );

    const showPrevStep = React.useCallback(
        ({ orIndex, orStep }: PrevNextStepProps = {}) => {
            let prevIndex = Math.max(0, activeStepIndex - 1);
            if (typeof orStep === "string") {
                prevIndex = steps.findIndex((s) => s.id === orStep);
            } else if (typeof orIndex === "number") {
                prevIndex = orIndex;
            }

            setActiveStep(steps[prevIndex].id);
        },
        [steps, activeStepIndex, setActiveStep]
    );

    const showCancelActions = React.useMemo(() => {
        if (typeof showCancelActionsControl === "boolean") {
            return showCancelActionsControl;
        }

        return typeof onCancelWizard === "function";
    }, [showCancelActionsControl, onCancelWizard]);

    return (
        <WizardContext.Provider
            value={{
                steps,
                activeStep,
                prevSteps,
                setActiveStep,
                showStepper,
                setShowStepper,
                activeStepIndex,
                hasMoreSteps,
                showCancelActions,
                showNextStep,
                showPrevStep,
                onCompleteWizard,
                onCancelWizard,
                setStepData,
            }}
        >
            {children}
            <EndChildrenHook initialActiveStep={initialActiveStep} />
        </WizardContext.Provider>
    );
}

function EndChildrenHook({
    initialActiveStep,
}: {
    initialActiveStep?: string;
}) {
    const { activeStep, setActiveStep, steps } = useWizardContext();

    React.useEffect(() => {
        if (activeStep) {
            return;
        }

        if (initialActiveStep) {
            setActiveStep(initialActiveStep);
            return;
        }

        if (steps.length) {
            setActiveStep(steps[0].id);
            console.log("setting active step", steps[0].id);
        }
    }, [steps]);

    return <></>;
}
