# Section 18: practice project. Building a food order app

## App Description
A food order application that shows a list of different food options with its price, description and a button to add to the cart. In the header apart from the title a cart button is shown with the items selected by the user. If the cart button is clicked a modal appears showing a list of food selected with 2 buttons, one for drecreasing the amount of the food and the other to increase it. The total value is updated when this buttons are clicked to give the user a better experience. 
This modal has aswell two buttons, one to close the modal and go back to first screen of the app and the other (checkout button) to order the food selected. 
The checkout button lead the user to another modal with a form with required fields and 2 buttons, one to go back to first screen an other to submit the order. 
If the submition is done correctly a succes message will appear with a button that lead the user to first screen and the cart button on the header is reset at 0. 

## Technical information
The **app.jsx** component is the responsible of rendering all the components of this app. This is it structure:
~~~
function App() {
  return (
    <UserProgressContextProvider>
      <CartContextProvider>
        <Header />
        <Meals />
        <Cart />
        <Checkout />
      </CartContextProvider>
    </UserProgressContextProvider>
  );
}
~~~

### Meals
The **meals.jsx** component renders a list of different food options. This is managed by a custom hook (useHttp.js) that makes the http request to fetch the meals in order to show them to the user. 

### Cart and cartItems
The **cart.jsx** component shows a modal to the user with the items (**cartItems.jsx**) selected. This component use 2 contexts (CartContext and UserProgressContext) and has 2 functions handleCloseCart() that calls the hideCart method of the userProgressContex and handleGoToCheckout() that calls the showCheckout() method also of the userProgressContex.

### Checkout 
The **checkout.jsx** component shows a modal with a form in order to submit the order. This component use 2 contexts (CartContext and UserProgressContext) and has 3 functions handleClose() that uses the hideCheckout() method of the userProgressContext, handleFinish() uses the clearCart() method of the userProgressContext and the clearData() destructed of the useHttp() custom hook, and handleSubmit() function calls the sendRequest() function also destructed of the useHttp() custom hook. 

## Contexts
### **CartContext.jsx**

The context has a default value as follows:
~~~
import { createContext, useReducer } from 'react';

const CartContext = createContext({
  items: [], // the meals selected
  addItem: (item) => {}, // a method with an item to be added to the items array
  removeItem: (id) => {}, // a method with an id to remove an item from the items array
  clearCart: () => {}, // a method to set to 0 the cart
});

export default CartContext; // to be use outside of the current file
~~~

***The context provider*** is constructed with the useReducer hook that accept a dispatch function as first parameter and as a second parameter we pass the initial state value ( { items: [] } ). We destructure from useReducter a cart containing as first value { items: [] } and a dispatchAction that will be calling our cartReducer function. 
The provider has different functions that triggers via type different dispatch actions. 
~~~
export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', id });
  }

  function clearCart() {
    dispatchCartAction({ type: 'CLEAR_CART' });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}
~~~

***The cartReducer function***
Receives a state and an action, with this values will be handling the methods addItem, removeItem and clearData returning each of them the state spreaded and the updated items array.
~~~
function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === 'REMOVE_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === 'CLEAR_CART') {
    return { ...state, items: [] };
  }

  return state;
}
~~~
### **UserProgressContext.jsx**
The idea of this context is to set 'cart' or 'checkout' flags in order to use them for showing or hiding the cart or the checkout modal. 
~~~
import { createContext, useState } from 'react';

const UserProgressContext = createContext({
  progress: '', // 'cart', 'checkout'
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState('');

  function showCart() {
    setUserProgress('cart');
  }

  function hideCart() {
    setUserProgress('');
  }

  function showCheckout() {
    setUserProgress('checkout');
  }

  function hideCheckout() {
    setUserProgress('');
  }

  const userProgressCtx = {
    progress: userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
  };

  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
~~~

## Custom Hook
### **useHttp.jsx**
First we create a helper function to deal with sending requests that accepts url and config as parameters.
~~~
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || 'Something went wrong, failed to send request.'
    );
  }

  return resData;
}
~~~
Then on our custom hook **useHttp.js** we handle data, loading and error via state. We create a function to clear the data and also we create a constand that holds the returning value of an async function called sendRequest. \\
The sendRequest() sets the data, isLoading and error state with the value returned by sendHttpRequest helper function in a try-catch block because we are sending an http request, that means it may fail. \\
useEffect() is used to call sendRequest an as a dependecy has sendRequest because it is created outside of the request function and config is also a dependency, and as we don't want to end in an infinit loop we wrap the sendRequest function in useCallback() hook. \\
On the useEffect we need to add a validation in order to send the request, this validation is true if there are a config object received and if config.method === 'GET' or if !config.method.
~~~
export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        setData(resData);
      } catch (error) {
        setError(error.message || 'Something went wrong!');
      }
      setIsLoading(false);
    },
    [url, config]
  );

  useEffect(() => {
    if ((config && (config.method === 'GET' || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData
  };
}
~~~