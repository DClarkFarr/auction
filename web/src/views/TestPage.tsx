import Wizard from "../components/wizard/Wizard";

export default function TestPage() {
    const onCompleteWizard = () => {
        alert("you complete me");
    };
    return (
        <div className="container py-10 bg-gray-200">
            <div className="test-page">
                <h1 className="text-2xl mb-8">This is a test page</h1>

                <Wizard
                    onCompleteWizard={onCompleteWizard}
                    initialActiveStep="email"
                >
                    <Wizard.Step id="name" label="Customer Name">
                        <Wizard.Step.Body>Wizard step name</Wizard.Step.Body>
                    </Wizard.Step>
                    <Wizard.Step id="email" label="Customer Email">
                        <Wizard.Step.Body>Wizard step email</Wizard.Step.Body>
                    </Wizard.Step>
                    <Wizard.Step id="age" label="Customer age">
                        <Wizard.Step.Body>Wizard step age</Wizard.Step.Body>
                    </Wizard.Step>
                    <Wizard.Step id="wife" label="Customer wife">
                        <Wizard.Step.Body>Wizard step wife</Wizard.Step.Body>
                    </Wizard.Step>
                    <Wizard.Step id="totalData" label="Customer totalData">
                        <Wizard.Step.Body>
                            Wizard step totalData
                        </Wizard.Step.Body>
                    </Wizard.Step>
                </Wizard>
            </div>
        </div>
    );
}
