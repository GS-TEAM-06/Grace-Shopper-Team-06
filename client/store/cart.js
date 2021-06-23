import axios from 'axios';

import { setLoading } from './cartStatus';

//action type
const ADD_TO_CART = 'ADD_TO_CART';
const GET_CART = 'GET_CART';
const DECREASE_FROM_CART = 'DECREASE_FROM_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const CLEAR_CART = 'CLEAR_CART';

//action creator
const addToCart = (cart) => {
  return {
    type: ADD_TO_CART,
    cart,
  };
};

const getCart = (cart) => {
  return {
    type: GET_CART,
    cart,
  };
};

const decreaseFromCart = (cart) => {
  return {
    type: DECREASE_FROM_CART,
    cart,
  };
};

const removeFromCart = (cart) => {
  return {
    type: REMOVE_FROM_CART,
    cart,
  };
};

const clearCart = (cart) => {
  return {
    type: CLEAR_CART,
    cart,
  };
};

//thunk
export const addedToCart = (userId, cardId, quantity) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading('LOADING'));
      const { data } = await axios.put(
        `/api/users/${userId}/cart`,
        {
          cardId,
          quantity,
        },
        {
          headers: { token: window.localStorage.token },
        }
      );

      dispatch(addToCart(data));
      dispatch(setLoading('OK'));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchCart = (userId) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading('LOADING'));
      console.log('userId in fetchCardThunk -->', userId);
      const { data } = await axios.get(`/api/users/${userId}/cart`, {
        headers: { token: window.localStorage.token },
      });
      dispatch(getCart(data));
      dispatch(setLoading('OK'));
    } catch (error) {
      console.error(error);
    }
  };
};

export const decreasedFromCart = (userId, cardId) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading('LOADING'));

      console.log('Does this removeThunk work?');
      const { data } = await axios.put(
        `/api/users/${userId}/cart/decrement`,
        {
          cardId: cardId,
        },
        {
          headers: { token: window.localStorage.token },
        }
      );
      dispatch(decreaseFromCart(data));
      dispatch(setLoading('OK'));
    } catch (error) {
      console.log(error);
    }
  };
};

export const removedFromCart = (userId, cardId) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading('LOADING'));

      console.log('Does this removeThunk work?');
      const { data } = await axios.delete(`/api/users/${userId}/cart`, {
        data: { cardId },
        headers: { token: window.localStorage.token },
      });

      dispatch(removeFromCart(data));
      dispatch(setLoading('OK'));
    } catch (error) {
      console.log(error);
    }
  };
};

export const clearedCart = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.delete(`/api/users/${userId}/cart/clear`, {
        headers: { token: window.localStorage.token },
      });

      dispatch(clearCart(data));
    } catch (error) {
      console.log(error);
    }
  };
};

//reducer
export default function cartReducer(state = {}, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return action.cart;
    case GET_CART:
      return action.cart;
    case DECREASE_FROM_CART:
      return action.cart;
    case REMOVE_FROM_CART:
      return action.cart;
    case CLEAR_CART:
      return action.cart;
    default:
      return state;
  }
}
