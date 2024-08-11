# Section 8: working with refs and portals

### Refs
A ref is a value just like a state in the end is a value, and just as a variable contains a value. But refs are managed by React in a special way. 
To create a ref value you need to import the useRef hook from React `import {useRef} from 'react'`, and then store it in a variable `const playerName = useRef()`
It is important to know that the ref value we are getting back from useRef will always be a JavaScript object, that will have a **current** property that will hold the current input value, as well as all the methos and properties that are exposed by that input HTML element
~~~
const playerName = useRef();
const [enteredPlayerName, setEnteredPlayerName] = useState('');

function handleClick() {
    setEnteredPlayerName(playerName.current.value);
}

<input ref={playerName} type="text" />
<button onClick={handleClick}>Set Name</button>
~~~

### Difference between ref and state
Whenever a ref changes, the component function does not re-execute, and for state thats different. Whenever you change a state by calling that state updating function the component will be re-executed, and for refs that simply not the case.
So, therefore, both state and refs are important concepts and have their purposes in the React world. State values do cause a component to be re-executed when changed through that state updating function and therefore state should be used whenever you have values that should directly be reflected in the UI. On the other hand, you should not use state for values that are only used behind the scenes and have no direct UI impact. Refs on the other hand, do not cause a component to be executed again. The component will not be reevaluated just because the ref value changed, ref can be use to gain direct DOM element access (great for reading values or accessing certain browser APIs)

### Forwarding refs to a custom components
To use ref value inside of custom component you cannot just forward props because this doesn't work. Instead you need to import `import {forwarfRef} from 'react'` and wrap your custom compont with this method, then export it. 
forwardRef will have a second parameter "ref" that will connect both components 
~~~
import { forwardRef } from "react"

const ResultModal = forwardRef(function ResultModal({ref, result, targetTime}) {
    return (
        <dialog ref={ref} className="result-modal">
            <h2>You {result}</h2>
            <p>The target time was <strong>{targetTime} seconds</strong></p>
            <p>You stopped the timer with <strong>X seconds left.</strong></p>
            <form action="dialog">
                <button>Close</button>
            </form>
        </dialog>
    )
});

export default ResultModal;
~~~

### Portals
Elements such as modals are not expected to be deeply inside html tags, instead should go on a top level. CreatePortal wraps the html and take as first parament the html that want to be moved and the second parameter is where to move it. For example:
~~~
import { forwardRef, useImperativeHandle, useRef } from "react"
import { createPortal } from 'react-dom';

const ResultModal = forwardRef(function ResultModal({targetTime, remainingTime, onReset}, ref) {
    const dialog = useRef();
    const userLost = remainingTime <= 0;
    const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
    const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    })
    
    return createPortal( // wrap html
        <dialog ref={dialog} className="result-modal">
            {userLost && <h2>You lost</h2>}
            {!userLost && <h2>You score: {score}</h2>}
            <p>The target time was <strong>{targetTime} seconds</strong></p>
            <p>You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong></p>
            <form action="dialog" onSubmit={onReset}>
                <button>Close</button>
            </form>
        </dialog>,
        document.getElementById('modal') // should go to index.html to the div with id modal
    )
});

export default ResultModal;
~~~
Then if we inspect the page we can see that the modal when show is inside the div id="modal"