# Section 21: react-router-dom part 2

### loader
Each route can define a "loader" function to provide data to the route element before it renders.
The loader for a page will be called right when start navigating to that page. So no after the page component has been rendered, but before we actually go there.
Loader has helpfull properties that are received as parameters, called resquest and params
~~~
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, path: "", element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            path: "",
            element: <EventsPage />,
        --> loader: async () => {
              const response = await fetch("http://localhost:8080/events");

              if (!response.ok) {
              } else {
                const resData = await response.json();
                return resData.events;
              }
            },
          },
          { path: ":eventId", element: <EventDetailPage /> },
          { path: "new", element: <NewEventPage /> },
          { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
    ],
  },
]);
~~~
As the user navigates around the app, the loaders for the next matching branch of routes will be called in parallel and their data made available to components through useLoaderData.

~~~
import { useLoaderData } from 'react-router-dom';
import EventsList from '../components/EventsList';

function EventsPage() {

  const events = useLoaderData();
  
  return (
    <>
      <EventsList events={events} />
    </>
  );
}

export default EventsPage;
~~~
It is better to keep the loader function on the component to wich it belongs, in order to keep the code clean. 
**App.js**
~~~
import EventsPage, { loader as eventsLoader } from "./pages/Events";

children: [
          {
            index: true,
            path: "",
            element: <EventsPage />,
            loader: eventsLoader,
          },
//...
~~~
**Events.js**
~~~
import { json, useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData();
  const events = data.events;

  if (data.isError) {
    return <p>{data.message}</p>;
  }

  return (
    <>
      <EventsList events={events} />
    </>
  );
}

export default EventsPage;

export async function loader() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
    //   status: 500,
    // });
    return json(
      { message: "Could not fetch events." },
      {
        status: 500,
      }
    );
  } else {
    return response;
  }
}
~~~
### Reflecting the current navigation on the UI 

**useNavigation** hoook gives us an object that has different properties, but the most important one is the state property that let us know if the state of the navigation is "idle, loading or submitting' via string.   

`` import { Outlet, useNavigation } from "react-router-dom";``  \
`` const navigation = useNavigation() `` \
`` {navigation.state === 'loading' && <p>Loading...</p>} ``

### Error handled with custom errors
The **errorElemeent** property of react-router-dom renders whenever any component throws an error. 

### action() functions
To add action to a route we add the special property 'action' just like with loader.
just as with loaders, we typically don't wanna add our action functions here in our route definitions file but instead we want to keep that code close to the components to which it belongs.


### Form component provided by react-router-dom
All inputs must have the name attribute because those names will later be used for extracting the data.
This form tag will make sure that the browser default of sending a request to the backend will be omitted but it will take that request that would've been sent and give it to your action.
And that's pretty useful because that request will contain all the data that was submitted as part of the form.
**Form component** support HTTP methods like post, delete or patch.
`` <Form method="post" className={classes.form}> ... </Form> ``
The request and that's important, will not be sent to the backend automatically, but instead to your action.