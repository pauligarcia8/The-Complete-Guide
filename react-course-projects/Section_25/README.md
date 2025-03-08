# Section 25: React Query / Tanstack Query

Tanstack Query , formerly known as React Query, is a library that help us sending http requests from inside the React app. So it helps coneccting our React frontend to a backend.
**_TANSKTAK QUERY DOES NOT SENT HTTP REQUESTS, (not on its own), WE WRITE THAT CODE AND TANSTACK QUERY THEN MANAGES THE DATA, ERRORS, CACHING AND MUCH MORE_**

### What is Tanstack Query?

Is a library that helps with sending HTTP requests & keeping our frontend UI in sync with the backend data.
Althought we don't need tansktack to make http request because we just can do it with the fetch feature and useEffect, tankstack can vastly simplify our code as a developer

**The code we are going to change for Tanstack Query**

```
import { useEffect, useState } from 'react';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

export default function NewEventsSection() {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/events');

      if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
      }

      const { events } = await response.json();

      return events;
    }

    fetchEvents()
      .then((events) => {
        setData(events);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (error) {
    content = (
      <ErrorBlock title="An error occurred" message="Failed to fetch events" />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
```

### useQuery hook

This hook behind the scenes will send http request, get events data, give us information about the loading and potential errors. For that we pass an object with differents properties.

```
const { data, isPending, isError, error } = useQuery({
    queryKey: ['events'], // some key to identify and cache the data and be reused. The key is an array of values that then are internally store by react-query
    queryFn: fetchEvents // the function we write to fetch http requests
    staleTime: 0, // this controls after wich time React Query will send a behind the scenes request to get updated data in our cache
    gcTime: 30000 // Garbage Collection Time controls how long the data and the cache will be kept around
})
```

### Configuration of tanstack

```
import {
  Navigate, ...
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
...

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/events" />,
  },
  ...
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

```

**This is the code using tanstack query**

```
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  let content;

  if (isPending) { // instead of isLoading manganed by useState
    content = <LoadingIndicator />;
  }

  if (isError) { // instead of error manganed by useState
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
```

### Changing Data with Mutations
But React Query cannot just be used to get data but also to send data.

// ADVANCE SECTION TO BE COMPLETE IN THE FUTURE