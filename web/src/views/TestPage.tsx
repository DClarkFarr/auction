import { css } from "@emotion/react";
import Wizard from "../components/wizard/Wizard";
import React from "react";
import { useWizardStepContext } from "../components/wizard/atoms/step/useWizardStepContext";

export default function TestPage() {
    const onCompleteWizard = () => {
        alert("you complete me");
    };

    const onCancelWizard = () => {
        alert("you total wimp");
    };

    return (
        <div className="container py-10 bg-gray-200">
            <div className="test-page">
                <h1 className="text-2xl mb-8">This is a test page</h1>

                <div className="max-h-[600px]">
                    <Wizard
                        styles={css(`
                            max-height: 600px;
                        `)}
                        onCompleteWizard={onCompleteWizard}
                        onCancelWizard={onCancelWizard}
                        initialActiveStep="email"
                    >
                        <Wizard.Step id="name" label="Customer Name">
                            Wizard step name
                        </Wizard.Step>
                        <Wizard.Step
                            id="email"
                            label="Customer Email"
                            footerProps={{ helpText: "Click the button" }}
                            components={{
                                Footer: (props) => (
                                    <Wizard.Step.Footer
                                        {...props}
                                        helpText={`${props.helpText}!!!`}
                                    />
                                ),
                            }}
                        >
                            <div className="text-xl flex flex-col gap-y-5">
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                                <div>Wizard step email</div>
                            </div>
                        </Wizard.Step>
                        <Wizard.Step id="age" label="Customer Age">
                            <Wizard.Step.Body>Wizard step age</Wizard.Step.Body>
                        </Wizard.Step>
                        <CustomWizard.MustClickStep />
                        <Wizard.Step id="wife" label="Customer Wife">
                            Wizard step wife
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData"
                            label="Customer Total Data with too wide a title"
                        >
                            Wizard step totalData
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData2"
                            label="Customer Total Data with too wide a title"
                        >
                            Wizard step totalData2
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData3"
                            label="Customer Total Data with too wide a title"
                        >
                            Wizard step totalData3
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData4"
                            label="Customer Total Data with too wide a title"
                        >
                            Wizard step totalData4
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData5"
                            label="Customer Total Data with too wide a title"
                        >
                            Wizard step totalData5
                        </Wizard.Step>
                    </Wizard>
                </div>
            </div>
        </div>
    );
}

function CustomWizardWrapper() {
    return <div>This should do nothing</div>;
}

function MustClickStep() {
    const [clicksCount, setClicksCount] = React.useState(0);

    const isValid = clicksCount > 3;

    const stepContext = useWizardStepContext();
    console.log("context", stepContext);

    return (
        <Wizard.Step id="mustClick" label="You must click" isValid={isValid}>
            <div className="flex flex-inline">
                <div
                    className="leading-0 rounded-lg py-1 px-2"
                    onClick={() => setClicksCount(clicksCount + 1)}
                >
                    {clicksCount}
                </div>
            </div>
        </Wizard.Step>
    );
}

const CustomWizard = Object.assign(CustomWizardWrapper, {
    MustClickStep,
});
