# Section 22: Building a SPA with react router

### What is Routing?
Routing is when different url path loads different content on the screen. 
Traditionally, we would implement Routing by simply loading different content, different HTML files for different paths, and that is how you would build a multi-page application which you typically would build without ReactJS. With that, we get different content for different paths, but the disadvantage is that we always have to fetch new content. 
A new HTTP request is sent and a new response is received, and that can kind of break the user flow. 
That's why wen need to use a Single Page Application, because we send only one initial HTML request and then this HTML file with a bunch of extra JavaScript is downloaded, and thereafter the extra JavaScript code
that runs on the client will actually take care about adjusting what the user sees on the screen. That's how single page applications work.
So instead of loading new HTML files from the backend, we could add some client-side code that simply watches the URL and then loads a different React component when that URL changes. 
With that, we're still in a single page application but we nonetheless support different URLs and therefore Routing.

### createBrowserRouter
This is a function provided by this package which allows us to define our routes that we wanna support in this application. 
This is how we define differents paths, we call this function and to this function, we pass an array of route definition objects. We provide a couple of JavaScript objects where every object represents one route. And we add some properties to define the route characteristics like for example, the path for which this route should be activated and an element that is the component that needs to be render.
~~~
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import Products from './pages/Products';

const router = createBrowserRouter([
  { path: '/', element: <HomePage />},
  { path: '/products', element: <Products />},

])

function App() {
  return <RouterProvider router={router}/>;
}

export default App;
~~~

**RouterProvider: receives a prop where we pass the router created with createBrowserRouter**


### createRoutesFromElements: Another alternative of defining routes
If you worked with older versions of react-router-dom, it might also be a bit of a strange approach because in older versions you actually defined all your routes with help of components and JSX code instead
of JavaScript Objects in array. You can import another function from react-router-dom, and that's the create routes from elements function.
We can create a new constant call route definitions, for example, and call create routes from elements and to this function, you pass a bunch of JSX code. We import a route component from react-router-dom, and then add our route component to create routs from elements.
Then we use createBrowserRouter and pass the routes created with createRoutesFromElements.
~~~
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import Products from './pages/Products';

const routeDefinitions = createRoutesFromElements(
  <Route>
    <Route path='/' element={<HomePage />}/>
    <Route path='/products' element={<Products />}/>
  </Route>
);

const router = createBrowserRouter(routeDefinitions);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;
~~~

### Link component
It does render an anchor element but it basically listens for clicks on that element, prevents the browser default of sending a HTTP request if the link is clicked, and instead simply takes a look at the route definitions to update the page accordingly and load the appropriate content.
It will also change the URL but without sending a new HTTP request. 

Instead of this : 
~~~
<>
            <h1>My Home Page</h1>
            <p>Go to the <a href="/products">the list of products</a></p>
        
        </>
~~~

Do this:
~~~
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <>
            <h1>My Home Page</h1>
            <p>Go to the <Link to="/products">the list of products</Link></p>
        
        </>
    )
}

export default HomePage;
~~~

### Nested Routes
We might want to add a navigation bar at the top, which actually lets us navigate between different pages. We can add some layout that wraps all these routes, and that simply loads these route components inside of this wrapping layout component. 
***App.js***
~~~
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <Products /> },
    ],
  },
]);
~~~
***Root.js***
The Outlet component from "react-router-dom" renders the children array (prop of createBrowserRouter) and its components.
~~~
import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import classes from './Root.module.css';

function RootLayout() {
    return (
        <>
            <MainNavigation />
            <main className={classes.content} >
                <Outlet />
            </main>
        </>
    )
}

export default RootLayout;
~~~

### Showing error pages with errorElement
There is another prop of createBrowserRouter that is errorElement that can help us showing screen with error message for better user experience. We pass the component responsible of showing the message to the prop and that is it:
~~~
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <Products /> },
    ],
  },
]);
~~~

### Using Dynamic Routes
With the help of semicolon we can create dynamic routes, what comes after the semicolen we can use ir with help of useParams ( another react-router-dom feature) 
~~~
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:productId", element: <ProductDetailPage /> },
    ],
  },
]);
~~~
***ProductDetail.js***
~~~
import { useParams } from "react-router-dom";

function ProductDetailPage() {
    const params = useParams();

    return (
        <>
            <h1>Product Details!</h1>
            <p>{params.productId}</p> // (productId) it has to be the same identifier
        </>
    )
}

export default ProductDetailPage;
~~~


And to create dynamic routes with the same Link component we can do the following:
~~~
import { Link } from "react-router-dom";

const PRODUCTS = [
  { id: "p1", title: "Product 1" },
  { id: "p2", title: "Product 2" },
  { id: "p3", title: "Product 3" },
];
function Products() {
  return (
    <>
      <h1>Products Page</h1>
      <ul>
        {PRODUCTS.map((prod) => (
          <li key={prod.id}>
            <Link to={`/products/${prod.id}`}>{prod.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Products;
~~~

### Absolute vs Realtive paths
***Absolute*** paths specify the full path starting from the root of your app. They start with a /.

- Usage: Useful when you want to direct the user to a specific route in your app, regardless of the current location.

- Example: /home, /dashboard, /profile/settings

***Relative*** paths define routes based on the current location. They do not start with a /.

Usage: Relative paths are helpful when you want to build nested or contextual routing within a particular section of your application.

Example: settings, edit, details
To go to the previous path we use:
~~~
    <p><Link to=".." relative="path">Back</Link></p>
~~~