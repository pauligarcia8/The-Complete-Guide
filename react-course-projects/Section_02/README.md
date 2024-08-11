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
`Import * as myImports from “./theFileExportingTheVariable.js”;` \
This way we import 

- **Variables:**
We use variables because of we can store a value one and use it as often and in many places as needed (**reusability**) and we can organize our code over several lines rather than cramming everything into a single line (**readability**).
***Name a variable in camelcase, starting with underscore and use number only at the end***    
Let variables can be reassing and const can not be reassignet, they are unique
-  **Values:**
    - String: Text values wrapped with sigles, double quotes or backticks
    - Number: Positive or negative, with decimal point (float) or without it (integer)
    - Boolean: True or false, typically used in conditions
    - Null & undefined: "There is no value". 
        - undefined: Default if no value is assgned yet
        - null: Explicitly assigned by developer (reset value)
- **Operators:**
Javascript operators are used to perform different types of mathematical and logical computations. \
The Assignment Operator = assigns values \
The Addition Operator + adds values \
The Multiplication Operator * multiplies values \
The Comparison Operator > compares values 
    - Comparison Operators: \
**==** 	equal to \
**===** 	equal value and equal type \
**!=** 	not equal \
**!==** 	not equal value or not equal type \
**>**	greater than \
**<**	less than \
**>=** 	greater than or equal to \
**<=** 	less than or equal to \
**?**	ternary operator 
    - Logical Operators: \
**&&** 	logical and\
**||** 	logical or\
**!** 	logical not 
- **Functions:**
The idea behind functions, no matter how you are creating them, simply is that you're defining some code that's not executed immediately, but instead, at some point in the future when you call the function and that can be executed as often as you want because a function can be called multiple times. 
Function must only have one return statement at most, without "return" implicitly return "undefined".
~~~ 
function greet(userName) { // defining
    console.log(userName)
} 
greet('Paula'); // calling

function createGreeting(userName, message = "Hello! ") { // defining with one default parameter
    return "Hi, I am " + userName + "." + message; // returning a string
}

const greeting1 = createGreeting("Paula"); // as the function is returning a value we store it in a constant

() => {} //arrow functions
~~~

**Using functions as values:**

Is posible to pass a function as value to another function for example:
Global method setTimeout() needs a function as first paramenter and a number as second
~~~
setTimeout(() => { // we are creating an anonymus function
    console.log("Time out");
}, 1000); 

Also we could do the following:

const handleTimeOut = ()  => {
     console.log("Time out");
}
setTimeout(handleTimeOut, 2000); // passing a function as a value
~~~

**Defining Functions inside of functions**
We have to be aware of the scope of the function, if we define a function inside a function it will be available only in the scope where it was created, for example:
~~~
function init() {
    function greet() { // created in init function
        console.log("Hi!");
    }

    greet(); // called on init function
}

init(); 
~~~

**Syntax shortcuts**
1) Omiiting parameter list parentheses. If your arrow functions takes exactly **one** parameter, you may omit the wrapping parentheses.

~~~
Instead of (userName) => { ... } you could write userName => { ... }
~~~
2) Omitting function body curly braces. If your arrow function contains no other logic but a return statement, you may omit the curly braces and the return keyword. 

~~~
Instead of 
number => { 
    return number * 3;
}
you could write
number => number * 3;
~~~

3) Special case: Just returning an object. To "tell" JavaScript that an object should be created (and returned) instead, the code would need to be adjusted like this:
~~~
number => ({ age: number }); // wrapping the object in extra parentheses
~~~
By wrapping the object and its curly braces with an extra pair of parentheses, JavaScript understands that the curly braces are not there to define a function body but instead to create an object. Hence that object then gets returned.

- **Objects & Classes:**
An object is a standalone entity, with properties and type.
~~~
const user = {
    name: "Paula",
    age: 31,
    greet() { // a function in an object is called method
        console.log("Hello!); 
        console.log(this.age); // this refers to the object itself
    }
}

console.log(user.name); // access to a value by dot notation
user.greet(); // executing an object method
~~~
A class object is a blueprint that can then later be used to create the actual objects
~~~
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const user1 = new User("Jazmin", 33);
console.log(user1);
~~~
Destructuring:
~~~
const {name, age} = {
    name: "Paula",
    age: 31,
}

Then we can use name of age standalone without dot notation.
~~~
Spread Operator:
~~~
const user = {
    name: "Paula",
    age: 31,
}

const extendedUser = {
    isAdmin = true,
    ...user // adds name and age as new properties
}
~~~
- **Arrays:**
An array is created by using square brackets, opening and closing square brackets. And the idea behind an array
simply is that you can create a list of values.
So where objects allow you to group values together with key-value pairs, the idea behind arrays is to have just values, which are stored in a certain order and which can be accessed by their position in that list.
~~~
const hobbies = ["sports", "cooking", "reading"];

console.log(hobbies[0]); // indexs start at 0, this would print "sports"
~~~
There are utility methos available for arrays and we can acces with the dot notation, like push(), findIndex(), map(), etc. For example:

~~~
const editedHobbies = hobbies.map((item) => item + "!"); // map return a new array
console.log(editedHobbies); this would print ["sports!", "cooking!", "reading!"]
~~~

Destructuring: 
~~~
Do this 
    const [firstName, lastName] = ["Paula", "Garcia"];
Instead of
    const userNameData = ["Paula", "Garcia"];
    const firstName = userNameData[0];
    const lastName = userNameData[1];
~~~
Spread operator:
Pull the content of an array and added to the new array. For example:
~~~
const hobbies = ["sports", "cooking", "reading"];

const newHobbies = ["swimming"];

const mergedHobbbies = [...hobbies, ...newHobbies]; // we would have a new array with standole hobbies pulled out from hobbies and newHobbies array
~~~

- **Control Structures:**
    - If, if else statement: to check if something is true or false and return a desirable value
~~~
const greeting = prompt("Hello or hello");

if (greeting === "Hello") {
    console.log("H uppercase")
} else if (greeting === "hello") {
    console.log("h lowercase")
} else {
    console.log("Acces not granted)
}
~~~
- For loop: we loop through an array
~~~
const hobbies = ["Sports", "Cooking"];

for (const hobby of hobbies) { // prints each value of the array
    console.log(hobby);
}

for ( i = 0; i < hobbies.length; i++) { // loops through the array depending on its length
    console.log(hobbies[i]); // prints each value of the array through index
}
~~~

- **Reference vs Primitive:**
    - Primitives: string, numbers and booleans can't edit them. We can overide a value, but the previous value is thrown away.
    - Reference: objects and array allows us to edit them because when we store a value in an object or array we are referencing to a memory address. 