import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/css/index.css";
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from "./reducers"

// dev tools !!! Not in production
import { composeWithDevTools} from "redux-devtools-extension";
import logger from "redux-logger";

// creating the store
const store = createStore(
  // delete composeWithDevTools in production
  rootReducer, composeWithDevTools(applyMiddleware(thunk, logger))
)

// wrapping of App in a Provider
ReactDOM.render(
  <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
);
