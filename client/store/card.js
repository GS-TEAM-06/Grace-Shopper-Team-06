import axios from 'axios';

//action types
const SET_CARD = 'SET_CARD';
const CREATE_CARD = 'ADD_CARD';
const UPDATE_CARD = 'UPDATE_CARD';
const DELETE_CARD = 'DELETE_CARD';

//action creators
const setCard = (card) => {
  return {
    type: SET_CARD,
    card,
  };
};

const createCard = (card) => {
  return {
    type: CREATE_CARD,
    card,
  };
};

const updateCard = (card) => {
  return {
    type: UPDATE_CARD,
    card,
  };
};

const deleteCard = (card) => {
  return {
    type: DELETE_CARD,
    card,
  };
};

//thunk
export const fetchCard = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/cards/${id}`);
    dispatch(setCard(data));
  } catch (error) {
    console.error(error);
  }
};

export const createCardThunk = (card, history) => async (dispatch) => {
  card.price = Math.round(card.price * 100);
  const { data: createdCard } = await axios.post('/api/cards/', card, {
    headers: { token: window.localStorage.token },
  });
  dispatch(createCard(createdCard));
  history.push('/cards');
};

export const updateCardThunk = (singleCard, history) => async (dispatch) => {
  singleCard.price = Math.round(singleCard.price * 100);
  const { data: updatedCard } = await axios.put(
    `/api/cards/${singleCard.id}`,
    singleCard,
    {
      headers: { token: window.localStorage.token },
    }
  );
  dispatch(updateCard(updatedCard));
  history.push(`/cards/${singleCard.id}`);
};

export const deleteCardThunk = (id, history) => async (dispatch) => {
  const { data: card } = await axios.delete(`/api/cards/${id}`, {
    headers: { token: window.localStorage.token },
  });
  dispatch(deleteCard(card));
  // history.push('/cards');
};

//reducer
export default function cardReducer(state = {}, action) {
  switch (action.type) {
    case SET_CARD:
      return action.card;
    case CREATE_CARD:
      return action.card;
    case UPDATE_CARD:
      return action.card;
    case DELETE_CARD:
      return action.card;
    default:
      return state;
  }
}
