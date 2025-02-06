# Section 18: Handling Forms via Form Actions

### Form Actions is available in React 19+

### What are form actions?

Forms has an **action** prop that usually just working with any language we use it to define the path or the url to wich the browser sends the form data when the form is submitted.
Working with react we usually pass a function to the **onSubmit** prop and take the event to prevent default.
In order to use form actions we change that onsubmit prop to action prop and then we can get an object with the values of the form, that works because the object takes the name prop of our inputs as keys.
`<form action={signupAction}>`

```
const signupAction = (formData) => {
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    const firstName = formData.get('first-name');
    const lastName = formData.get('last-name');
    const role = formData.get('role');
    const terms = formData.get('terms');
    const acquisition = formData.getAll('acquisition'); // get all values of the checkbox
}
```

### useActionState hook

This hooks aims to manages some form-related **state** for us or some action-related state.
useActionState takes as first parameter an action function (the function we pass to the onSubmit prop of form tag), and as a second parameter need an initial state value.
`useActionState(signupAction, { errors: null});`
This hook returns an arrary of **three elements** that we can accces via destructuring.

- The first element is the current value so initially the initial state that we set but after the action triggers the first value that returns our useActionState hook will be the returned value of the action function.
- The second element is an updated formAction that in the end is the action function that we set but enhance by react, and is this function that we need to set in the action prop of our form tag.
- The third element is a pending element wich is true or false depending on wether the form is being submitting or not. (is optional) \
  `const [formState, formAction, pending] = useActionState(signupAction, { errors: null })` \
  `<form action={formAction}>`

When passing signupAction to the useActionState, this action function will be called differently.
And formData will actually be the second input value, the second parameter, because the first parameter will be the previous form state, so the old form state, because of course it's possible that this action is invoked multiple times.
And in that case, React gives you the last form state it was aware of
as an input value in case you wanted to base your new state on that old state.
And the first time this is being executed, the previous form state will simply be that initial state that's being passed to it.
Even if we dont really need that previous form state, we need to accept it and extract formData as a second parameter since we'll get an error otherwise.

```
function signupAction(prevFormState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    ...
}
```

### Submitting cleans all inputs fields

Its important to prepropula the inputs that has been already fill to give a better user experience.
That can be handled by setting a defalt value to our input pointing to the formState.
`<input id="email" type="email" name="email" defaultValue={formState.enteredValues?.email} /> `
We achived that becuase apart of returning the errors array we now return also an object with the values of the inputs.
~~~
if (errors.length > 0) {
    return {
    errors,
    enteredValues: {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        role,
        acquisitionChannel,
        terms
    },
    };
}
~~~
