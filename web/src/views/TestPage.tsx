import { css } from "@emotion/react";
import Wizard from "../components/wizard/Wizard";

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
                            <Wizard.Step.Body>
                                Wizard step name
                            </Wizard.Step.Body>
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
                            <Wizard.Step.Body>
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
                                    <div>Wizard step email</div>
                                </div>
                            </Wizard.Step.Body>
                        </Wizard.Step>
                        <Wizard.Step id="age" label="Customer Age">
                            <Wizard.Step.Body>Wizard step age</Wizard.Step.Body>
                        </Wizard.Step>
                        <Wizard.Step id="wife" label="Customer Wife">
                            <Wizard.Step.Body>
                                Wizard step wife
                            </Wizard.Step.Body>
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData"
                            label="Customer Total Data with too wide a title"
                        >
                            <Wizard.Step.Body>
                                Wizard step totalData
                            </Wizard.Step.Body>
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData2"
                            label="Customer Total Data with too wide a title"
                        >
                            <Wizard.Step.Body>
                                Wizard step totalData2
                            </Wizard.Step.Body>
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData3"
                            label="Customer Total Data with too wide a title"
                        >
                            <Wizard.Step.Body>
                                Wizard step totalData3
                            </Wizard.Step.Body>
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData4"
                            label="Customer Total Data with too wide a title"
                        >
                            <Wizard.Step.Body>
                                Wizard step totalData4
                            </Wizard.Step.Body>
                        </Wizard.Step>
                        <Wizard.Step
                            id="totalData5"
                            label="Customer Total Data with too wide a title"
                        >
                            <Wizard.Step.Body>
                                Wizard step totalData5
                            </Wizard.Step.Body>
                        </Wizard.Step>
                    </Wizard>
                </div>
            </div>
        </div>
    );
}
