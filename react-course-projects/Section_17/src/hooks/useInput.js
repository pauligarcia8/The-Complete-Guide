import { useState } from "react"

export function useInput(defaultValue, validationFn) {
    const [enteredValue, setEnteredValue] = useState(defaultValue)
    const [didEdit, setIsEdit] = useState(false)

    const valueIsValid = validationFn(enteredValue);

    function handleInputChange(event) {
        setEnteredValue(event.target.value);
        setIsEdit(true)
      }
    
    function handleInputBlur() {
        setIsEdit(true)
    }

    return {
        value: enteredValue,
        handleInputBlur,
        handleInputChange,
        hasError: didEdit && !valueIsValid
    }
}