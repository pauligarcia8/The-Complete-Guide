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
