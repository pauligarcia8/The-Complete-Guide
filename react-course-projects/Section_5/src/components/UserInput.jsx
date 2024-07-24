import Input from "./Input"
// import Result from "./Result";

export default function UserInput({onChange, userInput}) {
// const [investment, setInvestment] = useState(initiaStateInvestment);

    
    // const [investment, setInvestment] = useState(initiaStateInvestment);

    // const handleInitialInvestmentInput = (event) => {
    //     setInvestment({...investment, initialInvestment: event.target.value});

    // }

    // const handleAnualInput = (event) => {
    //     setInvestment({...investment, annualInvestment: event.target.value});
    // }

    // const handleReturnInput = (event) => {
    //     setInvestment({...investment, expectedReturn: event.target.value});

    // }

    // const handleDurationInput = (event) => {
    //     setInvestment({...investment, duration: event.target.value});

    // }

    // const calculations = calculateInvestmentResults(investment);

    return (
        <>
            <section id="user-input">
                <div className="input-group">
                    <Input 
                        label="Initial Investment"
                        value={userInput.initialInvestment}
                        // handleChange={handleInitialInvestmentInput}
                        handleChange={(event) =>
                        onChange('initialInvestment', event.target.value)}
                    />
                    <Input 
                        label="Expected Return"
                        value={userInput.expectedReturn}
                        // handleChange={handleReturnInput}
                        handleChange={(event) =>
                        onChange('expectedReturn', event.target.value)}
                    />
                </div>
                <div className="input-group">
                    <Input 
                        label='Anual investment' 
                        value={userInput.annualInvestment}
                        // handleChange={handleAnualInput}
                        handleChange={(event) => onChange('annualInvestment', event.target.value)}
                    />
                    <Input 
                        label='Duration' 
                        value={userInput.duration}
                        // handleChange={handleDurationInput}
                        handleChange={(event) => onChange('duration', event.target.value)}
                    />
                </div>
            </section>
            {/* <Result information={calculations}></Result> */}
        </>
    )
}