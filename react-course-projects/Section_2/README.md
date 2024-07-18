# React projects use a build process, which simply means,
the code you write is not the code that gets executed like this, at least, in the browser. Instead, the code you write is transformed behind the scenes
before it's handed off to the browser.
We use a build process for two main reasons: 
- The first reason is that raw unprocessed React code won't execute in the browser.
Mostly because React code uses this special JSX feature.
- Another reason is that the code you write would not be optimized for production,
it would not be minified, that means names of variables or functions are shortened
to reduce the amount of JavaScript code that's served to the user.
## Javascript Refresher:
-	**“import & export”:** we use it when we need to use something of a js file in different files. (to use this we need to use type=”module” on the script in the index.html). \
`export let something = “string”` \
`import {somthing} from “./theFileExportingTheVariable.js”;` \
***export default:*** can be use only one per file, and is to export a default value in that file. \
`export default “something” `
`import something (we need to name what we are importing) “./theFileExportingTheVariable.js”;` \
***Multiple exports:*** \
`export let something = “string”` \
`export let something2 = “string2”` \
We can import in two ways: \  
Importing name by name:\
`Import {something, something2} from “./theFileExportingTheVariable.js”;`\
Importing all the values exported as an object, we access to their valus with dot notation -> myImports.something, myImports.something2 the values exported:\
`Import * as myImports from “./theFileExportingTheVariable.js”;`\
This way we import 

