import axios from "axios";

//action types
const SET_CARD = "SET_CARD";

//action creators
const setCard = (card) => {
  return {
    type: SET_CARD,
    card,
  };
};

//thunk
export const fetchCard = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/cards/${id}`);
      dispatch(setCard(data));
    } catch (error) {
      console.error(error);
    }
  };
};

//reducer
export default function cardReducer(state = {}, action) {
  switch (action.type) {
    case SET_CARD:
      return action.card;
    default:
      return state;
  }
}
