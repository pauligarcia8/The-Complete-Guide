# Section 20: Advanced Redux

> Reducers must be pure, side-effect free, synchronous functions!

### **INPUT** (old state + action) ==> **OUTPUT** (new state)

### Side-effect & async tasks should be executed inside the components ( via useEffect ) or inside the action creators

### Where should out logic (code) go?
When we consider where to put our logic, our code then we have to differentiate between synchronous, side-effect free code and code with side effects or codes that is asynchronous.  
So if we basically just have some data transformation then we typically **should prefer reducers.** \
For asynchronous code or code with side effects. There you should prefer action creators or components and you absolutely must never use reducers.

**App.js**
~~~
  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cart data!",
        })
      );
      const response = await fetch(
        "https://mybackend-23b5d-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("");
      }

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "Sent cart data succesfully!",
        })
      );
    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error...",
          message: "Sending cart data failed!",
        })
      );
    });
  }, [cart, dispatch]);
~~~

### What is a Thunk??
A thunk is simply a function, that delays an action until later, until something else finished. And we could write an action creator as a thunk, to write an action creator, which does not immediately return the action object, but which instead, returns another function which eventually returns the action.

Instead of the previous code, we write out asunc logic in an action creator
**cart-actions.js**
~~~
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://mybackend-23b5d-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
  
      if (!response.ok) {
        throw new Error("Sending cart failed.");
      }
    }
    

    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "Sent cart data succesfully!",
        })
      );
    } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error...",
            message: "Sending cart data failed!",
          })
        );
    }

  }
}
~~~

Then we use it on App.js
~~~
useEffect(() => {
     if (isInitial) {
      isInitial = false;
      return;
    }
    dispatch(sendCartData(cart))
}, [cart, dispatch]);
~~~