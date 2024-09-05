import { css } from "@emotion/react";

export const wizardStyleConfig = {
    size: 8,
    radius: 8,
    colors: {
        primary: "#146EF5",
        white: "#FFFFFF",
        neutral20: "#CED3DA",
        gray: "#8E959E",
        grayDisabled: "#CED3DA",
        grayActive: "#202328",
    },
};

export type StepperColorProps = {
    prev: boolean;
    next: boolean;
    active: boolean;
    complete: boolean;
    valid: boolean;
    index: number;
    maxIndex: number;
};
export const wizardStyles = {
    wizard: () => {
        return css(`
            padding: ${wizardStyleConfig.size * 4}px;
            box-shadow: 0px 8px 12px 6px rgba(0, 33, 82, 0.15),
                0px 4px 4px 0px rgba(0, 0, 0, 0.25);
            align-items: stretch;
            min-height: 500px;
            max-height: 100%;
            border-radius: ${wizardStyleConfig.radius}px;
            background-color: ${wizardStyleConfig.colors.white};
            max-height: 100%;
            display: flex;
            align-items: stretch;
        `);
    },
    stepperWrapper: css(`
        border-right: solid 1px ${wizardStyleConfig.colors.neutral20};
        padding-right: 32px;
        flex: 0 0 auto;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: visible;
        max-width: 220px;
        width: 40%;
    `),
    body: (hasStepper: boolean) =>
        css(`
            padding-left: ${hasStepper ? 4 * wizardStyleConfig.size : 0}px;
            flex-grow: 1;
        `),

    stepper: css(``),
    stepperItem: (props: StepperColorProps) => {
        const cs = wizardStyles.stepperColors(props);

        return css(`
            color: ${cs.color};
            font-weight: ${props.active ? 700 : 400};
            height: 64px;
            position: relative;
        `);
    },
    stepperIcon: (props: StepperColorProps) => {
        const cs = wizardStyles.stepperColors(props);

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
        padding-left: ${44 + wizardStyleConfig.size}px;
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

        const cs = wizardStyles.stepperColors(colorProps);
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
                iconBorder: wizardStyleConfig.colors.primary,
                iconBackground: wizardStyleConfig.colors.white,
                iconColor: wizardStyleConfig.colors.primary,
                color: wizardStyleConfig.colors.grayActive,
            };
        }

        if (next && valid) {
            return {
                iconBorder: wizardStyleConfig.colors.gray,
                iconBackground: wizardStyleConfig.colors.white,
                iconColor: wizardStyleConfig.colors.gray,
                color: wizardStyleConfig.colors.gray,
            };
        }
        if (active) {
            return {
                iconBorder: wizardStyleConfig.colors.primary,
                iconBackground: wizardStyleConfig.colors.primary,
                iconColor: wizardStyleConfig.colors.white,
                color: wizardStyleConfig.colors.grayActive,
            };
        }

        // disabled is left
        return {
            iconBorder: wizardStyleConfig.colors.gray,
            iconBackground: wizardStyleConfig.colors.white,
            iconColor: wizardStyleConfig.colors.gray,
            color: wizardStyleConfig.colors.grayDisabled,
        };
    },

    step: css(`
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        row-gap: ${wizardStyleConfig.size * 2}px;    
    `),
    stepHeading: css(`
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24px;
        font-weight: 700;
        color: ${wizardStyleConfig.colors.grayActive};
        flex-shrink: 1;
        column-gap: ${wizardStyleConfig.size * 2}px;
    `),
    stepBody: css(`
        flex-grow: 1;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: visible;
    `),
    stepFooter: css(`
        flex-shrink: 1;    
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        column-gap: ${wizardStyleConfig.size * 2}px;
    `),
    stepBackButton: css(`
        margin-right: auto;    
    `),
};
