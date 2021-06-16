import axios from 'axios'

//action type
const ADD_TO_CART = "ADD_TO_CART"
const GET_CART = "GET_CART"

//action creator 
const addToCart = (cart) => {
    return {
        type:ADD_TO_CART,
        cart,
    }
}

const getCart = () => {

}

//thunk
export const addedToCart = (userId, cardId) => {
    return async (dispatch) => {
        try {
            const {data} = await axios.post(`/api/users/${userId}/cart`, cardId);
            dispatch(addToCart(data))
        } catch (error) {
            
        }
    }
}

export const fetchCart = (cardId) => {
    return async (dispatch) => {
        try {
            const {data} = await axios.get(`/api/cards/${cardId}`);
            dispatch(getCart(data));
          } catch (error) {
            console.error(error);
          }
    }
}

//reducer
export default function cartReducer(state = [], action) {
    switch (action.type) {
        case ADD_TO_CART:
            return [...state, action.cart];
        default:
            return state;
    }
}