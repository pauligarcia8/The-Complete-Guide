import { useState } from "react";
import Header from "./components/Header"
import UserInput from "./components/UserInput"
import Result from "./components/Result";

let initiaStateInvestment = {
  initialInvestment: 1000,
  annualInvestment: 1200,
  expectedReturn: 6,
  duration: 10,
}

function App() {
  const [userInput, setUserInput] = useState(initiaStateInvestment);
  const inputIsValid = userInput.duration >= 1;

  function handleChange(inputIdentifier, newValue) {
    setUserInput(prevUserInput => {
        return {
            ...prevUserInput,
            [inputIdentifier]: +newValue
        }
    });
  }

  return (
    <>
      <Header title='React Investment Calculator' />
      <UserInput userInput={userInput} onChange={handleChange} />
      {!inputIsValid && <p className="center">Please enter a duration greater tha zero</p>}
      {inputIsValid && <Result information={userInput} />}
    </>
  )
}

export default App
