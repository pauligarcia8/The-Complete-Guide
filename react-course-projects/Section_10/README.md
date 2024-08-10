# Section 10: React's Context API & useReducer

As quickly as a React project grows, we face the need to add multiple new components to our component tree, and managing state updates through multiple components can lead us to prop drilling making our components less reusable.
To deal with this drilling problem we have some options:
### **1. Component Composition** 

The idea is to use the needed component as we were creating it on the component that needs it. 
For example we have the App component that renders a component that receives a prop from App to handle some event. The idea behind component composition is to lift up to the parent component that logic removing the prop and just using the children prop to render the component behaviour needed. To better understanding:

**App.jsx**
~~~ 
return (
      <Shop onAddItemToCart={handleAddItemToCart}> // passing as a prop a function to handle the addition of items to the cart
)
~~~
**Shop.jsx**
~~~
export default function Shop({ onAddItemToCart }) { // receive prop from App
  return (
    <section id="shop">
      <h2>Elegant Clothing For Everyone</h2>

      <ul id="products">
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={onAddItemToCart} />
          </li>
        ))}
      </ul>
    </section>
  );
}
~~~
***Embracing Component Composition*** \
**App.jsx**
~~~ 
return (
      <Shop> // remove prop
      {DUMMY_PRODUCTS.map((product) => ( // do the process in the App component rather than in the Shop component
          <li key={product.id}>
            <Product {...product} onAddToCart={handleAddItemToCart} />
          </li>
      ))}
      </Shop>
)

~~~
**Shop.jsx**
~~~
export default function Shop({ children }) { // add children
  return (
    <section id="shop">
      <h2>Elegant Clothing For Everyone</h2>

      <ul id="products">
        {children} 
      </ul>
    </section>
  );
}
~~~
Component composition is not a good idea to use in big apps because we can end ups with to big parent component and just with wrapper children components. 

### **2. React's Context API** 

It's a feature that is built in React and let us share data across components and component layers in an easy way.
The idea is to create a context value and then you provide that value wrapping multiple components, possibly around App component and making the value created available for the components wrapped in. 
This is easily connected to state, and the the component that need to change or update the state handle it directly to the context.

#### Creating our Context
We import createContext function from react and store the returned value in a constant called CartContext. The return value of createContext() is an object that has a provider component that will be the one wrapping the component where we want to use our context, the provider needs always to be use with a default value.
A value (number, string, array, object) can be provided to createContext to be the initial value of the context that then will be use on the different components. \
The return value of createContext() is an object that has a provider component that will be the one wrapping the component where we want to use our context. \
In order to use the context in a child component we need to import a hook called useContext and pass as a value the context we previously created.
It is importante to notice that the use of context make revaluate a component that means being reexecuted.

**shopping-cart-context.jsx**
~~~
import { createContext } from "react";

export const CartContext = createContext();
~~~
**App.jsx**
~~~
return (
    <CartContext.Provider value={{ items: []}}> // provider with default value
      <Header
        cart={shoppingCart}
        onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
      />
      <Shop>
      {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={handleAddItemToCart} />
          </li>
      ))}
      </Shop>
    </CartContext.Provider>
  );
~~~
**Cart.jsx**
~~~
import { useContext } from "react";
import { CartContext } from "../store/shopping-cart-context";

export default function Cart({ items, onUpdateItemQuantity }) {
  const cartCtx = useContext(CartContext); // this can be destructured
  return (
    {cartCtx.items.map((tem) => (
        <li>{item}</li>
    ))}
  )
}
~~~

Apart from the provider component object that has the createContext function there is the consumer. 
The consumer is component wrapper that we can use directly on the component, the consumer needs a function that receives the value from the context and passes to the component that we are using. This is more cumbersome way of doing it and is also harder to read. Would look like this:

~~~
return (
    <CartContext.Consumer>
        {(cartCtx) => {
            return (
                {cartCtx.items.map((item) => (
                    <li>{item}</li>
                ))}
            )
        }}
    </CartContext.Consumer>
)
~~~

### **3. useReducer Hook** 
What's a Reducer? \
Is a function that reduce one or more complex values to a simpler one. The idea of useReducer is to reduce one or more values to a typically simple value of state management purposes. \
How do we use reducer for state management? \
The useReducer method will give us an array of two elements, the first one for state and the second one for a dispatch action that then will be define with a reducer function `const [state, dispatch] = useReducer();`
~~~
const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer, // first parameter is the action
    {
        items: [], // second parameter the initial state
    }


    function handleAddItemToCart(id) { // this function call the function shoppingCartDispatch that is built outside the component function
        shoppingCartDispatch({ // passes the type and the id
            type: 'ADD_ITEM',
            payload: id,
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UPDATE_ITEM', // passes the type and the id
            payload: {
                productId,
                amount
            }
        });
    }
);
~~~

A function (shoppingCartReducer(state, action)) that is set outside the component triggers the different actions and update the state
~~~
function shoppingCartReducer(state, action) { 
    if (action.type === 'ADD_ITEM') { // handles the action for ADD_ITEM
        const updatedItems = [...state.items];

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find(
                (product) => product.id === action.payload
            );
            updatedItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            ...state, // not needed here because we have only one value
            items: updatedItems,
        };
    }

    if (action.type === 'UPDATE_ITEM') { // handles the action for UPDATE_ITEM
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            ...state,
            items: updatedItems,
        };
    }
    return state;
}
~~~

It is important to clarify that the context keeps running this is a way of managing the state without using useState