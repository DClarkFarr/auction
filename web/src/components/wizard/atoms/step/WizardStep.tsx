import { Button } from "flowbite-react";
import { wizardStyles } from "../../wizard.styles";
import { useWizardStepContext } from "./useWizardStepContext";
import WizardStepProvider from "./WizardStepProvider";
import CloseIcon from "~icons/ic/outline-close";
import { StepData, useWizardContext } from "../../useWizardHooks";
import React from "react";

export type WizardStepProps = React.PropsWithChildren<{
    id: string;
    label: string;
    isValid?: boolean;
    isComplete?: boolean;
    showCancelAction?: boolean;
    headerProps?: StepHeaderProps;
    footerProps?: StepFooterProps;
    components?: Partial<{
        Header: (props: StepHeaderProps) => React.ReactNode;
        Footer: (props: StepFooterProps) => React.ReactNode;
        Body: (props: StepBodyProps) => React.ReactNode;
    }>;
}>;

function WizardStepWrapper({
    children,
    components = {},
    footerProps,
    headerProps,
    ...props
}: WizardStepProps) {
    const {
        Header = StepHeader,
        Footer = StepFooter,
        Body = StepBody,
    } = components;
    return (
        <WizardStepProvider {...props}>
            <WizardStepVisibilityController>
                <Header {...headerProps} />
                <Body>{children}</Body>
                <Footer {...footerProps} />
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

export type StepHeaderProps = {
    title?: string | React.ReactNode;
    showCancelButton?: boolean;
    onClickCancel?: () => void;
    components?: Partial<{
        Action?: (props: StepButtonProps) => React.ReactNode;
    }>;
};
function StepHeader({
    title,
    showCancelButton: showCancelButtonControl,
    onClickCancel,
    components = {},
}: StepHeaderProps) {
    const { onCancelWizard } = useWizardContext();
    const { stepData, showCancelAction } = useWizardStepContext();

    const { Action = StepCloseButton } = components;

    const handleCancelClick = () => {
        if (typeof onClickCancel === "function") {
            return onClickCancel();
        }

        if (typeof onCancelWizard === "function") {
            return onCancelWizard();
        }

        console.warn(
            "Unhandled Step > Header > Cancel action. Wizard should be provided `onWizardCancel` or Step.Header should be given onClickCancel"
        );
    };

    const showCancelButton = React.useMemo(() => {
        return typeof showCancelButtonControl === "function"
            ? showCancelButtonControl
            : showCancelAction;
    }, [showCancelButtonControl, showCancelAction]);

    return (
        <div className="step__header" css={wizardStyles.stepHeader}>
            <div className="step__header-title">
                {typeof title !== "undefined" ? title : stepData.label}
            </div>
            {showCancelButton && (
                <div className="step___header-action">
                    <Action onClick={handleCancelClick} />
                </div>
            )}
        </div>
    );
}

export type StepButtonProps = {
    onClick: (props: { step: StepData }) => void;
};
function StepCloseButton({ onClick }: StepButtonProps) {
    const { stepData } = useWizardStepContext();
    return (
        <Button color="light" onClick={() => onClick({ step: stepData })}>
            <CloseIcon />
        </Button>
    );
}

export type StepBodyProps = { children: React.ReactNode };
function StepBody({ children }: StepBodyProps) {
    return (
        <div className="step__body" css={wizardStyles.stepBody}>
            {children}
        </div>
    );
}
export type ActionButton<
    OnClick extends (...args: unknown[]) => void = (...args: unknown[]) => void
> = (props: { onClick: OnClick; disabled?: boolean }) => React.ReactNode;

export type StepFooterProps = {
    primaryAction?: string | ActionButton;
    secondaryAction?: string | ActionButton;
    backAction?: string | ActionButton;
    showBackButton?: boolean;
    helpText?: string | React.ReactNode;

    onClickPrimary?: () => void;
    onClickSecondary?: () => void;
    onClickBack?: () => void;
};
function StepFooter({
    primaryAction,
    secondaryAction,
    backAction,
    showBackButton: showBackButtonForced,
    onClickPrimary: onClickPrimaryDefault,
    onClickSecondary: onClickSecondaryDefault,
    onClickBack: onClickBackDefault,
    helpText,
}: StepFooterProps) {
    const { showPrevStep, showNextStep, onCompleteWizard } = useWizardContext();
    const {
        nextStep,
        prevStep,
        stepData: { isValid },
    } = useWizardStepContext();

    const Back: ActionButton =
        typeof backAction === "function"
            ? backAction
            : ({ onClick }) => (
                  <a
                      href="#"
                      className="text-sky-700"
                      onClick={(e) => (e.preventDefault(), onClick(e))}
                  >
                      {typeof backAction === "string" ? backAction : "Back"}
                  </a>
              );

    const Secondary: ActionButton | null = secondaryAction
        ? typeof secondaryAction === "function"
            ? secondaryAction
            : ({ onClick }) => (
                  <Button color="gray" onClick={onClick}>
                      {secondaryAction}
                  </Button>
              )
        : null;

    const Primary: ActionButton =
        typeof primaryAction === "function"
            ? primaryAction
            : ({ onClick, disabled }) => (
                  <Button disabled={disabled} color="blue" onClick={onClick}>
                      {primaryAction || (nextStep ? "Continue" : "Finish")}
                  </Button>
              );

    const onClickBack = () => {
        if (typeof onClickBackDefault === "function") {
            return onClickBackDefault();
        }

        showPrevStep();
    };

    const showBackButton =
        typeof showBackButtonForced === "boolean"
            ? showBackButtonForced
            : !!prevStep;

    const onClickSecondary = () => {
        if (typeof onClickSecondaryDefault !== "function") {
            return console.warn(
                "Secondary button does not have a default action. Please supply `onClickSecondary` prop."
            );
        }

        return onClickSecondaryDefault();
    };

    const onClickPrimary = () => {
        if (typeof onClickPrimaryDefault === "function") {
            return onClickPrimaryDefault();
        }

        if (nextStep) {
            showNextStep();
        } else {
            onCompleteWizard();
        }
    };

    const canProceed = isValid;
    return (
        <div className="step__footer" css={wizardStyles.stepFooter}>
            {showBackButton && (
                <div
                    className="step__footer-back"
                    css={wizardStyles.stepBackButton}
                >
                    <Back onClick={onClickBack} />
                </div>
            )}
            {helpText && <div css={wizardStyles.helpText}>{helpText}</div>}
            {Secondary && (
                <div>
                    <Secondary onClick={onClickSecondary} />
                </div>
            )}
            {Primary && (
                <div>
                    <Primary disabled={!canProceed} onClick={onClickPrimary} />
                </div>
            )}
        </div>
    );
}

const WizardStep = Object.assign(WizardStepWrapper, {
    Body: StepBody,
    Header: StepHeader,
    Footer: StepFooter,
});

export default WizardStep;
