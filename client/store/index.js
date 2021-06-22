import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import auth from "./auth";
import cardsReducer from "./cards";
import cardReducer from "./card";
import userReducer from "./user";
import cartReducer from "./cart";

const reducer = combineReducers({
  auth,
  cards: cardsReducer,
  card: cardReducer,
  user: userReducer,
  cart: cartReducer,
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from "./auth";
