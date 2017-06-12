# redux-saga-kit

redux-saga is a very sophisticated and awesome library, but it's not that easy to work with.

This package aims to help with the creation and development of sagas.

## Getting started
### Prerequisites:
* [redux](http://redux.js.org/)
* [redux-saga](https://redux-saga.github.io/redux-saga/)

### Install  

    npm install --save redux-saga-kit
    

## What This Project Includes
At the moment, this project includes only two methods:
* **sagaCreator** - used for creating sagas
* **stateSelector** - A helper method to easily create saga selectors

### sagaCreator  
```sagaCreator(definition)```  
**definition**: object
###### returns: Generator Function 
The sagaCreator accepts a definitions object, and returns one saga that takes different 
(using takeEvery or takeLatest) actions, and forks their handlers.

#### How to use

    import { sagaCreator } from 'redux-saga-kit';
      
    const saga = sagaCreator({...definitionsObject});

The definition object should have this form:
     
    {actionName: object|func}
     
This will define a handler for the action with the given actionName.  
If a function is give, this will be the handler that will be called each time the action is dispatched.
 
Alternatively, a definition object can be passed. It looks like this:
 
    {
        handler: func,
        takeLatest: bool,
        throttle: bool|number,
        noParams: bool
     }
      
##### handler (function)
_default: no default - must be provided_  

The handler function to be called every time the action is dispatched.  
By default, the handler should be a function, accepting saga params, and that returns
a function (or generator function) which will actually handle the action.  
The returned function receives ```{payload}``` as an argument.

**Example**: 
    
    const myHandler = ({Param1, Param2, ...}) => function* ({payload}) {
      // saga logic here
    };

Saga params are used in order to easily test the sagas.
You can see more here: [redux-saga-tester](https://github.com/wix/redux-saga-tester).
 
If you choose to work without saga params, you can use the _noParams_ (explained below), 
and then you can just pass the generator function itself, as so:  

    const myHandler = function* ({payload}) {
      // saga logic here
    };  
      
    // or  
      
    function* anotherHandler ({payload}) {
      // saga logic here     
    }
    

##### takeLatest (boolean)
_default: false_  

If this is true, each action cancels previous unfinished handlers.
Else, it will call the handler for each action, regardless if previous handlers have finished running.

For more information see: [takeLatest](https://redux-saga.github.io/redux-saga/docs/api/index.html#takelatestpattern-saga-args)

##### takeFirst (boolean)
_default: false_  

When true, the handler will be called only once, and not at each action "fired".

##### throttle (boolean | number)
_default: 100 (ms)_
  
You can throttle the handlers for the actions by adding the throttle prop.  
If throttle value is true then action will be throttled by 100ms.  
Alternatively, you can pass a number as the ms value to be throttled by.

 For more information see: [throttle](https://redux-saga.github.io/redux-saga/docs/api/index.html#throttlems-pattern-saga-args)

##### cancelOn (string | array[string])
_default: null_
  
With this property you can pass an action type, or a list of action types, that when they are "fired", this saga will
be cancelled, if it is currently running. 

 For more information see: [cancel](https://redux-saga.js.org/docs/api/#canceltask)

##### noParams (boolean)
_default: false_  

As described above, this option gives an option to pass a handler without saga params
  
  
### stateSelector 
```stateSelector(pathToProp, [defaultValue])```  
**pathToProp**: string  
**defaultValue**: any (optional)
###### returns: Any

#### How to use

    import { stateSelector } from 'redux-saga-kit';
      
    const myPropSelector = stateSelector('path.to.my.prop', {default: 'value'});
    
This is a pretty straight forward method.
 It uses lodash's [get](https://lodash.com/docs/4.17.4#get) method to get the property from the state.
