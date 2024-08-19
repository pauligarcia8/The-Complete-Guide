# Section 14: class based components
***FUNCTIONAL COMPONENTS***
The default & most modern approach. Components are regular JavaScript functions wich return renderable results (typically JSX). React 16.8 introduced "React Hook" for functional components
~~~
function Product(props) {
    return <h2>A Product!</h2>
}
~~~
***CLASS-BASED COMPONENTS***
Was required in the past. Components can also be defined as JS classes where a render() method defines the to-be-rendered output. Traditionally when using React prior to version 16.8, you had to use class-based components to managed **state.** 
~~~
class Product extends Component {
    render() {
        <h2>A Product!</h2>
    }
}
~~~

### How class-based components receives props
We need to `import {Component} from 'react'` and with that we have available the props that can be accessed by `this` keyword.
~~~
import { Component } from 'react';

class User extends Component {
  render() {
    return (
      <li className={classes.user}>{this.props.name}</li>
    )
  }
}
~~~

### How class-based components manage state
Class-based components manage state on the constructor method, also in contrast of the possibility of chossing the name of our state in useState hook, here that cannot be another word but **state** accesed by this keyword. The state on the class-based component always is an object (using useState hook can be booleans, arrays, objects, strings), and inside of this object we set every state that we want to manage. \
Then also we create the method wich will be in charge of changing the state wich also returns an object. 
~~~
constructor() {
    super()
    this.state = {
      showUsers: true 
    }
  }

  toggleUsersHandler() {
    this.setState((curState) => {
      return {
        showUsers: !curState.showUsers
      }
    });
  }
~~~
Then to access to the state we need utlize this keyword : 
~~~
return (
    <div className={classes.users}>
      <button onClick={this.toggleUsersHandler.bind(this)}>
        {this.state.showUsers ? 'Hide' : 'Show'} Users
      </button>
      {this.state.showUsers && usersList}
    </div>
)
~~~

### Class components Lifecycle
1. compomnentDidMount(): is called once a component **mounted**, is like useEffect({}, []) with empty dependency
2. componentDidUpdate: is called one a component **updated**, is like using useEffect({}, [someValue]) with depedency when changed triggers re-render
3. componentWillUnmount(): is called rigth before component is **unmounted**, is like using the clean up function use it on useEffect(() => { return () => {...}}, [])

