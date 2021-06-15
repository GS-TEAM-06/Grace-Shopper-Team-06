import axios from 'axios'

//action types
const SET_CARDS = "SET_CARDS"

//action creators 
const setCards = (cards) => {
    return {
        type:SET_CARDS,
        cards,
    }
}

//thunk
export const fetchCards = () => {
    return async (dispatch) => {
        try {
            const {data} = await axios.get("/api/cards");
            dispatch(setCards(data));
          } catch (error) {
            console.error(error);
          }
    }
}

//reducer
export default function cardsReducer(state = [], action) {
    switch (action.type) {
        case SET_CARDS:
            return action.cards;
        default:
            return state;
    }
}