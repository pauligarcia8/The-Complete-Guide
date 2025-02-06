# Section 18b: Advance. Handling form submission

### use() hook is available in React version 19+, we can use it instead of useContext()

### useFormStatus() hook

Is a new hook that's meant to be used in conjunction with form actions. useFormStatus is importend from react-dom and actually can't be used in the component that contains the form and the form action. This hook must be used in some nested component and as a result, we will get back an object that contains various pieces of information about the current form status, the current status of form in wich this nested component is being used. You can get hold of the data that has been submitted, but the most common piece of data is the pending property, wich is true or false depending on whether the surrounding form is currently being submitted or not.

~~~
import { useFormStatus } from 'react-dom';

export default function Submit() {
    const { pending } = useFormStatus();

    return (
        <p className="actions">
          <button type="submit" disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>
        </p>
    )
}; // We then use this component in the form parent component.
~~~ 

### Registering multiple form actions
Form action functions can actually not just be set as values for the action propmpt of the form, but instead you can also got obuttons inside of a form and add the formAction prompt to such a button and set that to an action functions. That's something allowed by React.

~~~
function upvoteAction() {
    console.log('UPVOTE')
};

function downvoteAction() {
    console.log('DOWNVOTE')
};
-----

<form className="votes">
    <button formAction={upvoteAction}>
    <svg> ... </svg>   
    </button>

    <span>{votes}</span>

    <button formAction={downvoteAction}>
        <svg> ... </svg>
    </button>
</form>

~~~

### Using the 'pending' state from useActionState() hook
In order to disabled the buttons depending if they are being trigger we can use the useActionState() hook and the pending state. So instead of passing the functions to the formAction prop in the buttons, we destructure state, action and pending of useActionState() hook, passing the action to buttons and utilizing the pending values to disabled or enable the buttons. 
~~~
async function upvoteAction() {
    console.log("UPVOTE");
    await upvoteOpinion(id);
}

async function downvoteAction() {
    console.log("DOWNVOTE");
    await downvoteOpinion(id);
}

const [upvoteFormState, upvoteFormAction, upvotePending] = useActionState(upvoteAction);
const [downvoteFormState, downvoteFormAction, downvotePending] = useActionState(downvoteAction);

----
<form className="votes">
    <button formAction={upvoteAction} disabled={upvotePending || downvotePending}>
    <svg> ... </svg>   
    </button>

    <span>{votes}</span>

    <button formAction={downvoteAction} disabled={upvotePending || downvotePending}>
        <svg> ... </svg>
    </button>
</form>
~~~

### Adding Optimistc Updating
useOptimistic() hook aims to help us with optimistic updating. 
- First parameter: the value that needs to be updated optimistically
- Second parameter: function invoked by React, defined by us. This function will then receive a first parameter (the old state) and as a second argument a mode
This hook return an array and destructuring we get the current state and the action. 
~~~
const [optimisticVotes, setVotesOptimistically] = useOptimistic(votes, (prevVotes, mode) =>
    mode === "up" ? prevVotes + 1 : prevVotes - 1
  );
async function upvoteAction() {
    setVotesOptimistically('up');
    await upvoteOpinion(id);
}

async function downvoteAction() {
    setVotesOptimistically('down');
    await downvoteOpinion(id);
}
~~~
        
And then we use the state value `<span>{optimisticVotes}</span>`