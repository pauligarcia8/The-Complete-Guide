# Section 5: Practice project

1. Creating inputs and handling value changes: \
My approach was creating a custom input that accepted label, type. Then I used this custom input on userInput component, create 4 functions to handle each input value and create an object with initial investment fields that were update spreading it and updating each value in the different functions.
While the approach of the course was to handle the values changes in just one function and passing a string as identifier to change the key value of the object. \

**UserInput.jsx**
~~~
State with initial object values
const [investment, setInvestment] = useState(initiaStateInvestment);

4 functions to handle each input value 

    const handleInitialInvestmentInput = (event) => {
        setInvestment({...investment, initialInvestment: event.target.value});

    }

    const handleAnualInput = (event) => {
        setInvestment({...investment, annualInvestment: event.target.value});
    }

    const handleReturnInput = (event) => {
        setInvestment({...investment, expectedReturn: event.target.value});

    }

    const handleDurationInput = (event) => {
        setInvestment({...investment, duration: event.target.value});

    }

Input components poiting to each function

<div className="input-group">
    <Input label='Initial investment' handleChange={handleInitialInvestmentInput}/> // handleChange is a prop that custom input is receiving
    <Input label='Expected Return' handleChange={handleReturnInput}/>
</div>
<div className="input-group">
    <Input label='Anual investment' handleChange={handleAnualInput}/>
    <Input label='Duration' handleChange={handleDurationInput}/>
</div>
~~~

This was the approach of the course
~~~
const [userInput, setUserInput] = useState(initiaStateInvestment);

// creates a general function to handle all inputs change by an string indentifier equal to the object key

    function handleChange(inputIdentifier, newValue) {
        setUserInput(prevUserInput => {
            return {
                ...prevUserInput,
                [inputIdentifier]: newValue
            }
        });
    }

<div className="input-group">
<Input 
    label='Initial investment' 
    handleChange={(event) => handleChange('initialInvestment', event.target.value)}
    value={userInput.initialInvestment}
/>
<Input 
    label='Expected Return' 
    handleChange={(event) => handleChange('expectedReturn', event.target.value)}
    value={userInput.expectedReturn}
/>
</div>
<div className="input-group">
<Input 
    label='Anual investment' 
    handleChange={(event) => handleChange('anualInvestment', event.target.value)}
    value={userInput.annualInvestment}
/>
<Input 
    label='Duration' 
    handleChange={(event) => handleChange('duration', event.target.value)}
    value={userInput.duration}
/>
</div>
~~~

2. Using the values to populate the table
I did it in UserInput component, utilizing the function calculateInvestmentResults and passing the returned value to the Result component.
While the course proposes lifting the state up, that means remove the handleChange function from UserInput component and using it on the App component, because here is where the Result compoennt should go.
~~~
    const calculations = calculateInvestmentResults(userInput);

    <Result information={calculations}></Result>
~~~

Lifting the state up, and using a pointer in UserInput component \
**App.jsx**
~~~
function App() {
  const [userInput, setUserInput] = useState(initiaStateInvestment);
  const inputIsValid = userInput.duration >= 1;

  function handleChange(inputIdentifier, newValue) {
    setUserInput(prevUserInput => {
        return {
            ...prevUserInput,
            [inputIdentifier]: newValue
        }
    });
  }

  return (
    <>
      <Header title='React Investment Calculator' />
      <UserInput userInput={userInput} onChange={handleChange} />
      {!inputIsValid && <p className="center">Please enter a duration greater tha zero</p>}
      {inputIsValid && <Result information={userInput} />} // rendering Result table on App component
    </>
  )
}
~~~
**UserInput.jsx**
~~~

export default function UserInput({onChange, userInput}) // adds onChange props to handle input variations and userInput object to extract values
<Input 
    label='Initial investment' 
    handleChange={(event) => onChange('initialInvestment', event.target.value)} // we not longer use handleChange function because that is now on App, instead we use the prop that we receive
    value={userInput.initialInvestment}
/>

~~~