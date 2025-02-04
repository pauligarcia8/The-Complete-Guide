# Section 23: Adding Authentication to React apps

### How authentication works in react apps?
Authentication in the end it means that certain resources, certain backend routes, for example, should be protected and should not be accessible by everyone. 
So the front end application, the React application that wants to access certain backend resources must authenticate before this access is granted. It must get permission.
And for that of course, the question is how does our client side React application get permission from that backend application running on a server? 
1. starts with sending a request with user credentials. So with an email and a password, for example to that back and server.
2. That backend server is then able to validate those credentials or create a new user if that's what we're doing.
3. And then if the credentials are valid, if we did provide a valid email password combination then the server will send us back a response that includes a toke that basically gives us permission to access certain protected resources.
4. On the client side, we have to store that token attach it to future outgoing requests, and use that token as an indicator, whether a user is logged in or not.

### Query parameter
They are in the end a parameter that's appended in the URL after a question mark. ``localhost:3000/auth?mode=login`` or ``localhost:3000/auth?mode=singup``

react-router gives us a hook that makes it easy to get access to the currently set query parameters. And the hook is called **useSearchParams()** because query parameters are officially called search parameters. 
We can call useSearchParams wich actually returns an array and hence we can use array destructuring to get access to the elements in that array. And there are two elements in that array. The first element is an object that gives us access to the currently set query parameters and the second value we get from that array is a function that allows us to update the currently set query parameters. \ 
``const [searchParams, setSearchParams] = useSearchParams();`` \
``const isLogin = searchParams.get('mode') === 'login';``

