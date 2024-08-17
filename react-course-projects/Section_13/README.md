# Section 13: A look behind the scenes of react & optimization techniques

### How does React update the DOM?
**How are components functions executed?** \
Rendering a component means that React goes ahead an execute a component's function and return a jsx code wich is translated to javascript code and then translated to actual elements that can be render on the screen.
React renders step by step the built in components such as h2, p, div tags as well as custom components, when encouter a custom component goes to that component and render what is inside, then 'come back' and keep rendering the next elements in order to build the component tree.

~~~
function App() { // 1. executes this function component
  log('<App /> rendered');

  const [enteredNumber, setEnteredNumber] = useState(0);
  const [chosenCount, setChosenCount] = useState(0);

  function handleChange(event) { // 2. creates this functions not executed
    setEnteredNumber(+event.target.value);
  }

  function handleSetClick() {
    setChosenCount(enteredNumber);
    setEnteredNumber(0);
  }

  return ( // 3. return jsx code
    <>
      <Header /> // 4. goes to Header component a render what is inside
      <main> // 5. keeps rendering next elements
        <section id="configure-counter"> 
          <h2>Set Counter</h2>
          <input type="number" onChange={handleChange} value={enteredNumber} />
          <button onClick={handleSetClick}>Set</button>
        </section>
        <Counter initialCount={chosenCount} /> // 6. Renders what inside here, more custom components
      </main>
    </>
  );
}

export default App;
~~~
![how react renders](src/assets/howReactRenders.png)

With the React profiler devtools we can record a session a see how react rendered the component tree and also see wich component triggered it.
![profiler react devtools](src/assets/profilerReactDevtools.png)

### memo() // is wrapped around components functions
There are moments where we trigger re rendering of several components just because we update one component for having a state that gets updated leading to the execution of all the component on the family tree, that doesn't mean that impacts on the actual DOM because how React works, but that can be optimazed.
**memo() compares prop values,** if the prop values are equal the component function will not be executed again, but if they are different the component will execute again.
~~~
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
export default SomeComponent;
~~~

***DON'T OVERUSE MEMO():***
- Use it as high up in the component tree as possible, blocking a component execution there will also block all child components executions.
- Cheching props with memo() costs performance, don't wrap it around all your component, it will just add a lot of unnecessary chekcs.
- Don't use it on component where props will change frequently, memo() would just perform a meaningles check in such cases (wich costs performance)

### useMemo() // wraped around normal functions that are executed in component functions to prevent their execution

This hook should only be used when you complex calculations that you want to prevent; useMemo takes to parameter the first a function that you want to store, and the second an array of dependecies to know when to reexecute the function `useMemo(() => { function(arg, arg2)}, [dependency1, dependecy2])`
~~~
const initialCountIsPrime = useMemo(() => isPrime(initialCount), []);
~~~

### Why keys matter when managing state
The same custom component can be re used multiple times and pass different values to prop, react will render the same component but is not going to affect to the others even though they are the same component. However if we are managing state in the component we need to know that state is tracked by position by React
When using like this is not such a big issue:
~~~
<Counter initialCount={chosenCount} />
<Counter initialCount={anotherCount} />
~~~
But when we iterate over a value to render several components we cannot use the index from the iteration, because eventhough it generates a unique key, it will always point to the same value if clicked. So the value may change but the position selected don't leading to issues. 
***NOT RECOMENDED -> using index***
~~~
return (
    <ol>
      {history.map((count, index) => (
        <HistoryItem key={index} count={count} /> 
      ))}
    </ol>
  );
~~~
***RECOMENDED USE OF UNIQUE KEYS***
~~~
return (
    <ol>
      {history.map((count) => (
        <HistoryItem key={count.id} count={count.value} />
      ))}
    </ol>
  );
~~~

### Another good practice related to keys
`<Counter key={chosenCount} initialCount={chosenCount} />`
In this case we could set a key to the Counter component with a value that changes by useState, so Counter component will be removed and a new one will be created when the value chosenCount changes, here we can not use the same component twince with same key because that would lead us to an same key error. 
This approach is to avoid the unnecessary usage of useEffect

### State scheduling & batching
When you call a state updating function, like setChosenCount the state update will be scheduled by React. It will not be executed instantly.
~~~
const [chosenCount, setChosenCount] = useState(0);

const handleSetCount = (newCount) => {
  setChosenCount(newCount); // It will not be executed instantly.
  console.log(chosenCount) // this will show the current state
}
~~~
This console.log right after updating the state we will not get the new state but instead the old state. It's a common misconception that people think that they update the state in one line and then in the next line they can use the updated state. This won't work.
Because of those state updates are scheduled it is considered a best practice to perform state updates that depend on the old state value using this function form `setChosenCount(prevChoosenCount => prevChoosenCount + 1)` where you pass a function to the state updating function and that function then receives the old state snapshot 
and should return the new state snapshot.
What's all important to know about this state scheduling is that if you have multiple state updates that are in the end triggered simultaneously 
so in the same function here, you will not end up with multiple component function executions because that would of course be pretty inefficient, thankfully React also performs state batching, which simply means that multiple state updates that are triggered from the same function, for example, are batched together and will only lead to one component function execution.