# Section 15: Sending http requests and Data Fetching

We need to always keep in mind that our React code runs in the browsers of our users. So they can view the code (via browser developer tools) if they want to. \
Frontend apps runs in the user's broser, son they can theoretically view the entire code. We don't connect directly to a data base, we connect via HTTP requests to a Backend that runs on a separate (inaccesible) server wich interact with databases.

### What is a RESTful API?
Rest means **Re**presentational **S**tate **T**ransfer, basically transfer data around. 
RESTful APIs are stateless backends. A restfull server could have different urls like /users, /post, /products; and each of them supporting differents type of https request like GET, POST, DELETE to managed that data transfer, this data is usually moved as JSON. 

### Making a http call
fetch wants the url you want to send the resquest, and return a promise that evetually will give you the data or response. That can be acces with the then method. After the data is available we use again the then method to set our state with the data received
~~~
useEffect(() => {
    fetch('http://localhost:3000/places')
    .then((response) => {
      return response.json()
    })
    .then((resData) => {
      setAvailablePlaces(resData.places)
    });
}, []);
~~~
As we have empty dependencies this fetch will only execute once. Here is a better way of making a fetch
~~~
useEffect(() => {
    async function fetchPlaces() {
      const response = await fetch('http://localhost:3000/places');
      const resData = await response.json();
      setAvailablePlaces(resData.places)
    }

    fetchPlaces();
}, []);
~~~

### Showing loading messages regarded to state of the data fetched
Although looks simple, it takes a few second to load the data, so using state is pretty simple to handle a message that let the user know the state of the data
~~~
const [availablePlaces, setAvailablePlaces] = useState([]);
const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      const response = await fetch('http://localhost:3000/places');
      const resData = await response.json();
      setAvailablePlaces(resData.places)
      setIsFetching(false);

    }

    fetchPlaces();
  }, []);
~~~

### Handling HTTP errors
We may frequently face when sending HTTP requests are errors because when sending HTTP requests, there are many reasons for why things may fail, because a user lost their network connection, because maybe something went wrong on the back end, the server might be temporarily offline, for example, or we have some bug in your code there. Whatever the reason may be, errors can occur, and therefore, in the front-end code, we should also be prepared for the scenario that fetching the data might fail, and there are two main ways of how fetching that data may fail. \
For one, we might fail to send that request in the first place, for example, because the network connection crashed. The other situation where sending the request may kind of fail is that it is actually sent successfully to the back end, but something goes wrong there, and the back end sends back an error response, and we typically wanna handle both cases. \ 
For data fetching is super common to have three pieces of state working together, one for the fetching state (to know if the data is being fetched to the user), another for storing the data fetched and the last one for the errors. 
~~~
const [availablePlaces, setAvailablePlaces] = useState([]);
const [isFetching, setIsFetching] = useState(false);
const [error, setError] = useState();
~~~

For error response we do the following:
when we throw an error like this `if (!response.ok) { throw new Error('Failed to fetch places') }` we will crash the application, though, which might not really be what we wanna do. So we should wrap code that could potentially throw an error with try-catch, which we can do when using async/await. \
We wrap try around the code that might fail and inside catch we handle the error.

~~~
useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try { // this migth fail
        const response = await fetch('http://localhost:3000/paces');
        const resData = await response.json();

        if (!response.ok) { // we checked for the error
          const error = new Error('Failed to fetch places');
          throw error
        }

        setAvailablePlaces(resData.places)
      } catch (error) { // we catch the error
        setError({message: error.message || 'Could not fetch places, please try again later'});
      }

      setIsFetching(false);
    }
    fetchPlaces();
  }, []);
~~~

### Sending data with POST requests
The default http request is GET, when we want to use a different one we need to specify it. After the first parameter that take the fetch method there is a second one for specify different http requests. The second parameter takes an object with the method we want to use, the body stringify to JSON and the headers. Then we can return the response. 

~~~
export async function updateUserPlacer(places) { // places is an object that has been updated via useState on the App.jsx
  const response = await fetch('http://localhost:3000/user-places', {
    method: 'PUT',
    body: JSON.stringify({places: places}),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const resData = await response.json();

  if(!response.ok) {
    throw new Error('Failed to update user data')
  }

  return resData.message;
}
~~~

### Deleting data vis DELETE http request