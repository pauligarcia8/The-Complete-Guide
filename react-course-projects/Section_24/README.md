# Section 24: Deploying React Apps

### Deploying Steps
1. Write your code
2. Test code: manually & with automated test
3. Optimize code: optimize user experience & performance
4. Build App: run build process to parse, transform & optimize code
5. Upload App: upload production code to hosting server
6. Configure server: ensure app is served securely & as intended

### Lazy Loading
***Load code only when it's needed instead of ahead of time***

For example when we land over a homepage, the data in another route is not needed inmediatly. So when we navigate there, the data should be downloaded.

**instead of this**
~~~
import BlogPage, { loader as postsLoader } from './pages/Blog';
import PostPage, { loader as postLoader } from './pages/Post';

...
children: [
    { index: true, element: <BlogPage />, loader: postsLoader },
    { path: ':id', element: <PostPage />, loader: postLoader },
]
~~~

**
1. load the loader via import (that gives us a promise), and that will import something dinamically 
2. lazy function is executed and takes the import function with the dynamic import as an argument, wrap the component with suspense to wait for content to be loaded before actually rendering the content.
**
~~~
const BlogPage = lazy(() => import("./pages/Blog"));
const PostPage = lazy(() => import("./pages/Post"));
...
children: [
    {
    index: true,
    element: (
        <Suspense fallback={<p>Loading...</p>}>
            <BlogPage /> // we can use it as a component thanks to lazy
        </Suspense>
    ),
    loader: () =>
        import("./pages/Blog").then((module) => module.loader()),
    },
    {
    path: ":id",
    element: (
        <Suspense fallback={<p>Loading...</p>}>
            <PostPage />
        </Suspense>
    ),
    loader: (meta) =>
        import("./pages/Post").then((module) => module.loader(meta)),
    },
],
~~~

### Building the code for production
In the json file of our app we have a build script in order to build an optimize version of our code in order to be supported in browser.
- npm run build
- creates a build folder

### Deploying the app
#### A react SPA is a "Statis Website", only HTML, CSS & JavaScript so a static sit host is needed