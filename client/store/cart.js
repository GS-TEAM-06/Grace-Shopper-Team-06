import axios from 'axios';

//action type
const ADD_TO_CART = 'ADD_TO_CART';
const GET_CART = 'GET_CART';

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

//thunk
export const addedToCart = (userId, cardId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(
        `/api/users/${userId}/cart`,
        {
          cardId: cardId,
        },
        {
          headers: { token: window.localStorage.token },
        }
      );
      dispatch(addToCart(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchCart = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}/cart`, {
        headers: { token: window.localStorage.token },
      });
      dispatch(getCart(data));
    } catch (error) {
      console.error(error);
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
    default:
      return state;
  }
}
