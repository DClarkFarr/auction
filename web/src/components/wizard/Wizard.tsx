import React from "react";
import { StepData, useWizardContext, WizardContext } from "./useWizardHooks";
import WizardProvider from "./WizardProvider";
import WizardStep from "./Wizard/step/WizardStep";
import { css, SerializedStyles } from "@emotion/react";

const radius = 8;
const colors = {
    primary: "#146EF5",
    white: "#FFFFFF",
    neutral20: "#CED3DA",
    gray: "#8E959E",
    grayDisabled: "#CED3DA",
    grayActive: "#202328",
};

type StepperColorProps = {
    prev: boolean;
    next: boolean;
    active: boolean;
    complete: boolean;
    valid: boolean;
    index: number;
    maxIndex: number;
};
const styles = {
    wizard: css(`
        padding: 32px;
        display: flex;
        box-shadow: 0px 8px 12px 6px rgba(0, 33, 82, 0.15),
            0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        align-items: stretch;
        min-height: 500px;
        max-height: 100%;
        border-radius: ${radius}px;
        background-color: ${colors.white};
        max-height: 100%;

    `),
    stepperWrapper: css(`
        border-right: solid 1px ${colors.neutral20};
        padding-right: 32px;
        max-width: 200px;
        min-width: 135px;
        flex: 0 0 auto;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: visible;
    `),
    body: (hasStepper: boolean) =>
        css(`
            padding-left: ${hasStepper ? 32 : 0}px;
            flex: 0 0 auto;
            overflow-x: visible;
            overflow-y: auto;
        `),

    stepper: css(``),
    stepperItem: (props: StepperColorProps) => {
        const cs = styles.stepperColors(props);

        return css(`
            color: ${cs.color};
            font-weight: ${props.active ? 700 : 400};
            height: 64px;
            position: relative;
        `);
    },
    stepperIcon: (props: StepperColorProps) => {
        const cs = styles.stepperColors(props);

        const size = props.active ? 32 : 24;

        return css(`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: ${size}px;
            width: ${size}px;
            border: solid 2px ${cs.iconBorder};
            background-color: ${cs.iconBackground};
            color: ${cs.iconColor};
            border-radius: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        `);
    },
    stepperIconText: (props: StepperColorProps) => {
        return css(`
            font-weight: ${props.active ? 700 : 700};    
            font-size: ${props.active ? 18 : 16}px;    
        `);
    },

    stepperIconWrapper: css(`
        width: 44px;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;  
    `),
    stepperLabel: css(`
        padding-left: 52px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        max-width: 100%;
    `),
    stepperLabelText: css(`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `),
    stepProgress: (colorProps: StepperColorProps, isUp: boolean) => {
        if (!isUp && colorProps.index === 0) {
            return undefined;
        }
        if (isUp && colorProps.index >= colorProps.maxIndex) {
            return undefined;
        }

        const cs = styles.stepperColors(colorProps);
        return css(`
            position: absolute;
            width: 2px;
            height: 50%;
            left: 50%;
            transform: translateX(-50%);
            top: ${isUp ? 32 : 0}px;    
            background: ${cs.iconBorder};
        `);
    },

    stepperColors({ prev, next, active, valid }: StepperColorProps) {
        if (prev) {
            return {
                iconBorder: colors.primary,
                iconBackground: colors.white,
                iconColor: colors.primary,
                color: colors.grayActive,
            };
        }

        if (next && valid) {
            return {
                iconBorder: colors.gray,
                iconBackground: colors.white,
                iconColor: colors.gray,
                color: colors.gray,
            };
        }
        if (active) {
            return {
                iconBorder: colors.primary,
                iconBackground: colors.primary,
                iconColor: colors.white,
                color: colors.grayActive,
            };
        }

        // disabled is left
        return {
            iconBorder: colors.gray,
            iconBackground: colors.white,
            iconColor: colors.gray,
            color: colors.grayDisabled,
        };
    },
};

type WizardStepperItemProps = {
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
        <div className="stepper__item" css={styles.stepperItem(styleProps)}>
            <div
                className="stepper__icon-wrapper"
                css={styles.stepperIconWrapper}
            >
                <div
                    className="stepper__progress stepper__progress--down"
                    css={styles.stepProgress(styleProps, false)}
                ></div>
                <div
                    className="stepper__progress stepper__progress--up"
                    css={styles.stepProgress(styleProps, true)}
                ></div>
                <div
                    className="stepper__icon"
                    css={styles.stepperIcon(styleProps)}
                >
                    <div className="stepper__icon-text">{index + 1}</div>
                </div>
            </div>
            <div className="stepper__label" css={styles.stepperLabel}>
                <div
                    className="stepper__label-text"
                    css={styles.stepperLabelText}
                >
                    {step.label}
                </div>
            </div>
        </div>
    );
}
export function WizardStepper() {
    const { steps } = useWizardContext();

    if (!steps.length) {
        return null;
    }
    return (
        <div className="stepper" css={styles.stepper}>
            {steps.map((step, i) => (
                <WizardStepperItem key={step.id} step={step} index={i} />
            ))}
        </div>
    );
}

export type WizardProps = React.PropsWithChildren<{
    initialActiveStep?: string;
    activeStep?: string;
    showStepper?: WizardContext["showStepper"];
    onShowStepper?: WizardContext["setShowStepper"];
    onChangeStep?: (step: string) => void;
    onCompleteWizard: WizardContext["onCompleteWizard"];
    styles?: SerializedStyles;
}>;
function WizardWrapper({
    children,
    showStepper = true,
    styles: customStyles,
    ...props
}: WizardProps) {
    return (
        <WizardProvider showStepper={showStepper} {...props}>
            <div className="wizard" css={[styles.wizard, customStyles]}>
                {showStepper && (
                    <div
                        css={styles.stepperWrapper}
                        className="wizard__stepper"
                    >
                        <Wizard.Stepper />
                    </div>
                )}
                <div className="wizard__body" css={styles.body(showStepper)}>
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
