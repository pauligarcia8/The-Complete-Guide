# Section 17: forms and inputs
### Forms are about two main things: 
1. **Form Submission:** Handle their submission and extract the values entered by the user, this can be managed via state, extract via refs or via FormDate and native browser features.
2. **Input Validation:** Validate the data that's provided by the user and show some validation errors if incorrect data has been provided. This can be managed validation on overy keystroke ( errors may be shown too early), validate on lost focus (errors may be shown too long) on validate on form submissions (errors may be shown too late).

### Handling form submission
By default the browser sends hettp request, son when a button inside of a form is clicked will generate a request and send those request to the server that is serving the site. So if we have a button without a type that type is going to be submit by default, if we don't want to trigger that http request we need to set the type to button `type='button'`. Or we can do this by not changing the type on the button element and adding the onSubmit prop to the form element and this way when any button inside the form is clicked the form is going to trigger a submit event that we can listen with a handleSubmit(event) function, and there call the preventDefault() that prevents that default htpp request action.

### Managing & getting user input via state & generic handlers
We can handle input change doing different handlers for the different inputs, and managing state for those independently, or we can just use one piece of state with an object, and use one handler function to manage there different inputs. This would be achived doing the following
**Instead of doing this: **
~~~
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

function handleEmailChange(event) {
    setEmail(event.target.value);
}

function handlePasswordChange(event) {
    setPassword(event.target.value);
}


function handleSubmit(event) { // this is set to the onSubmit prop of the form tag element
    event.preventDefault();
    console.log(email, password);
}

---------------

<input  // Two way binding
    id="email" 
    type="email" 
    name="email" 
    onChange={handleEmailChange}  // Two way binding
    value={email}
/>

<input 
    id="email" 
    type="email" 
    name="email" 
    onChange={handlePasswordChange}  // Two way binding
    value={password}
/
~~~
**Do this: **
~~~
const [enteredValues, setEnteredValues] = useState({
    email: '',
    password: ''
  })

  function handleSubmit(event) {
    event.preventDefault();
    console.log(enteredValues);
  }
  
  function handleInputChange(indentifier, value) {
    setEnteredValues(prevValues => ({
      ...prevValues,
      [indentifier]: value
    }))
  }

---------------

<input 
    id="email" 
    type="email" 
    name="email" 
    onChange={(event) => handleInputChange('email', event.target.value)}
    value={enteredValues.email}
/>

<input 
    id="password" 
    type="password" 
    name="password" 
    onChange={(event) => handleInputChange('password', event.target.value)}
    value={enteredValues.password}
/>
~~~
**Or you can work with ref if there are one or two inputs to handle.**
~~~
const email = useRef();
const password = useRef();

function handleSubmit(event) {
    event.preventDefault();

    const enteredEmail = email.current.value;
    const enteredPassword = password.current.value;

    console.log(enteredEmail, enteredPassword);
}

---------------

<input 
    id="email" 
    type="email" 
    name="email" 
    ref={email}
/>

<input 
    id="password" 
    type="password" 
    name="password" 
    ref={password}
/>
~~~

### Using FormData
Sometimes we will have a much more complex form where we need to  extract all different entered input values. We can use useState or ref, but can be a lot of work. That's why we should at least consider using a native built-in feature for getting hold of all those values. \
The FormData constructor is a special kind of object based on a special kind of constructor function that's built into the browser (not provided by React). `const formData = new FormData(event.target);` It takes as a parameter the event target of the form, it will return an object with the different values of the different inputs on the form, for that to work every input need to have a name prop setted. \
To extract the values we use the following: `const enteredEmail = formData.get('email');` although this can be a lot of work if we have many inputs to handle. So in this case we use the built-in Object class, which is also provided by the browser, and call the fromEntries static method on that class and pass the result of calling the entries method, like this `Object.fromEntries(formData.entries());`. We store in a variable and we will have then an array with the different values of each input on the form.
If we have inputs with the same name prop we can access with getAll() method `const acquisitionChannel = formData.getAll('acquisition');`

### Resetting Forms
If we are using useState we do the following:
~~~
setEnteredValues({
    email: '',
    password: ''
})
~~~
If we are working with ref we can do it by setting to wmtpy the current ref value, but is not recommended. 
If we are working with DataForm we can just use the target.reset() method that has the event object `event.target.reset()`

### Validating Input on Every Keystroke via State
We can check if an email for example is valid if it has '@'. If we check on every keystroke we risk to show the error message to early, because the user starts typing (so its no longer empty string) and perhaps hasn't get to write the '@' yet so the error message appears.

~~~
const emailIsInvalid = enteredValues.email !== '' && !enteredValues.email.includes('@');
---------------
<div className="control-error">{emailIsInvalid && <p>Please enter a valid email adress</p>}</div>
~~~

### Validating Input upon Lost Focus via State
Another way of validating is using the onBlur prop in the input tag. Focus refers to click in and out of an input field. We need to handle the blur prop in order to listen the onFocus event. We do it by setting a state and creating a handleBlur function that manage the previous state of an input (via idetifier), update it to the opposite value and use the current state to validation.
~~~
const [didEdit, setIsEdit] = useState({
    email: false,
    password: false
})

const emailIsInvalid = didEdit.email && !enteredValues.email.includes('@');


function handleInputBlur(identifier) {
    setIsEdit(prevEdit => ({
      ...prevEdit,
      [identifier]: true
    }))
}

---------------

<input 
    id="email" 
    type="email" 
    name="email" 
    onBlur={() => handleInputBlur('email')}
    onChange={(event) => handleInputChange('email', event.target.value)}
    value={enteredValues.email}
/>
~~~
But we can combinate validation on every key stroke and upon lost focus. Because if we go with the lost focus the validation is made too long away the user starts typing, and with every keytrok is too early. We can combinate by reseting to false the state of the handleBlur in order to remove the message if the user lost focus and starts typing again. 
~~~
function handleInputChange(identifier, value) {
    setEnteredValues(prevValues => ({
      ...prevValues,
      [identifier]: value
    }));
    setIsEdit(prevEdit => ({ // set to false the isEdit state
      ...prevEdit,
      [identifier]: false
    }))
  }

function handleInputBlur(identifier) { // set to true the isEdit state
    setIsEdit(prevEdit => ({
        ...prevEdit,
        [identifier]: true
    }))
}
~~~

### Validating input upon form submission
When using refs we cannot validate on every keystroke. We would have to set up separate event listeners for that. And if we would do that, we could also just start managing the input values via state. So if we wanna stick to refs, we can basically only validate the input when the user submits the form. This is how we do it:
~~~
const [emailIsInvalid, setEmailIsInvalid] = useState(false);

  const email = useRef();
  const password = useRef();

  function handleSubmit(event) {
    event.preventDefault();

    const enteredEmail = email.current.value;
    const enteredPassword = password.current.value;

    const emailIsValid = !enteredEmail.includes('@');

    if (!emailIsValid) {
      setEmailIsInvalid(true);
      return;
    }

    setEmailIsInvalid(false);

    console.log('Sending HTTP request...')

  }
~~~

### Creating a custom component to be reusable
It is important to viasualize when to create a custom component in order to reduce repetitive code. We create an Input component that is reconfigurable and can be reused changing the prop values. 
**Input.jsx**
~~~
export default function Input({ label, id, error, ...props}) {
    return (
        <div className="control no-margin">
          <label htmlFor={id}>{label}</label>
          <input 
            id={id} 
            {...props}
          />
          <div className="control-error">{error && <p>{error}</p>}</div>
        </div>
    )
}
~~~
**StateLogin.jsx**
~~~
<div className="control-row">
    <Input 
        label="Email"  
        id="email" 
        type="email" 
        name="email" 
        onBlur={() => handleInputBlur('email')}
        onChange={(event) => handleInputChange('email', event.target.value)}
        value={enteredValues.email}
        error={emailIsInvalid && 'Please enter a valid email'}
    />

    <Input 
        label="Password"  
        id="password" 
        type="password" 
        name="password" 
        onBlur={() => handleInputBlur('password')}
        onChange={(event) => handleInputChange('password', event.target.value)}
        value={enteredValues.password}
        error={passwrodIsInvalid && 'Please enter a valid password'}
    />
</div>
~~~
### Validation Logic
Is a good practice to have a file where all the validations are made, so they can be reused where needed. 

### Custom hook 
We can create a custom hook that manage the validation and different values of the inputs. Before we had the validation and the useState on the same component that rendered the inputs. Now with the custom hook **useInput** we get the value and validate each input independently and with a much more cleaner code in the component itself. 
**useInput.js**
This custom hook receives a default value that depends on the change of the input that is calling and returs an object with value, the handlers and the error if exists.
~~~
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
~~~
Then we can use this custom hooks for email and password independly a destructured the returns values to use it on the ui
**StateLogin.jsx**
~~~
const { 
    value: emailValue, 
    handleInputChange: handleEmailChange, 
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError 
  } = useInput('', isEmail(value) && isNotEmpty(value));

const { 
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError 
} = useInput('', (value) => hasMinLength(value, 6));
~~~