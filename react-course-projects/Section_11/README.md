# Section 11: Handling Side Effects & Working With the useEffect() Hook
-   Understanding side effects & useEffect()
-   Effects & dependencies
-   When NOT to use useEffect()

### What are side effects?
When we talk about side effects in the context of React.js, we are referring to anything that is outside the scope of React or "tasks" that don't impact the current component render cycle. Example: When we use React with any of the Browser’s API such as the localStorage, we are creating side-effects.
Another example is when we are using a browser method such as navigation (that help us knowing the user location) and we use useState to update a value needed to render some information on the UI this can cause an infinite loop. The loop is infinite because when the component is render the navigation method is also executed wich call a setState of useState, and useState make a component reexecution and the following behavior is understandable.

### What does useEffect function do?
The function allows React developers to stop side effects that do not need to be executed before our component is unmounted, just like the other hooks useEffects needs to be executed inside the component function. \ 
useEffect unlike useState or useRef doesn't return a value, instead needs 2 arguments, the first one is a function that should wrap the side effect code and the second argument is an array of dependencies
`useEffect(() => {}, [])` \
The code inside the first argument will be executed by React after every component execution, that is after the render of the component finish. If the useEffect hook has empty dependencies the code inside the fisrt argument will only execute once but if it has the code will execute when those dependencies change.

### What is the useEffect cleanup function?
For example, you have a React component that performs a certain action in a setTimeout. Every time the component is shown, it runs the setTimeout function and performs the action in the timeout on that component. Assuming You decided to navigate away from this component and into another portion of the app. The component is no longer being rendered, thus there is no need to leave the setTimeout function running in the background. However, the setTimeout function is still running in the background.

This is where the useEffect cleaning function comes in. In the cleanup function, we can simply add a clearTimeout which clears the timeout when the component is unmounted (i.e., no longer rendered).
The useEffect cleanup function is a return function within the useEffect hook.

~~~
import React, { useEffect } from "React";

useEffect(() => {
  // Your effect
  return () => {
    // Cleanup
  };
}, []);
~~~

### When to use the useEffect cleanup function
- Fetch requests: When initiating an API request in a component, it is important that we also account for a way to abort the request when the component is unmounted or re-rendered.
- Timeouts: For timeouts, you can use the setTimeout(callback, timeInMs) timer function in the useEffect hook, followed by the clearTimeout(timerId) function in the cleanup function. This guarantees that the timer is cleared when the component is unmounted.
~~~
useEffect(() => {
    console.log('TIMER SET');
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      console.log('Cleaning up timer');
      clearTimeout(timer);
    };
  }, [onConfirm]);
~~~
- Intervals: The setInterval(callback, timeInMs) function can be declared in the useEffect hook, and the clearInterval(intervalId) function can be added to the cleanup function to handle intervals. By doing this, you can be sure that the timer will stop when the part is unmounted.
~~~
useEffect(() => {
    const interval = setInterval(() => {
      console.log('INTERVAL');
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);
~~~

### useCallback() hook
We can face an infinite loop when using function as dependecy in useEffect. \
This built in hook that React offers to us is ideal when we use a function as a dependency of useEffect, this method takes as first argument a function and as second argument a dependecy. Unlike useEffect this hook does return a value, in fact return the function of the first argument