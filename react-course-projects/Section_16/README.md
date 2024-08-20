# Section 16: Custom Hooks
## Rules of Hook
1. Only call Hooks inside of Components Functions or Other Hooks Functions
2. Only call Hooks on the top level

### Creating a custom hook
The function must to start with use because that's a convention. Because functions that start with use are treated as hooks and React projects typically look for functions that start with use and enforce certain rules on such functions.

The idea is to make a reusable hook, custom hooks can use another hooks so for example we can move logic that is repetead out in a separate custom hook and make it configurable in order to use that custom hook and its returned values. 
Here we are creating a custom hook called useFetch that uses useEffect and useSate to manage an api call. This custom hook receives 2 arguments, one is a function that handles the http request and the other is an initial value to set the data. Inside of this custom hooks is just the same logic that was used before in App.jsx but now with more general names in order to be reused. This custom hooks returns an object with 3 pices of state needed to feed the App.jsx component as well as an updating function needed there.

**useFetch.js**
~~~
import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialValue) {
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);

    useEffect(() => {
        async function fetchData() {
          setIsFetching(true);
          try {
            const data = await fetchFn();
            setFetchedData(data);
          } catch (error) {
            setError({ message: error.message || 'Failed to fetch data.' });
          }
    
          setIsFetching(false);
        }
    
        fetchData();
      }, [fetchFn]);

      return {
        isFetching,
        fetchedData,
        setFetchedData,
        error
      }
}
~~~
On App.jsx we destructure the returned object that give us the execution of useFetch, also some values are renamed in order to matched better in the component.
**App.jsx**
~~~
  const { isFetching, error, fetchedData: userPlaces, setFetchedData: setUserPlaces } = useFetch(fetchUserPlaces, []);
~~~