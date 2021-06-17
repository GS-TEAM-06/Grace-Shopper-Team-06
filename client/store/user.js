import axios from "axios";

//action type
const GET_USER = "GET_USER";

// action creator
const getUser = (user) => {
  return {
    type: GET_USER,
    user,
  };
};

// thunk
export const fetchUser = (userId) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/users/${userId}`);
      dispatch(getUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

//reducer
export default function userReducer(state = {}, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    default:
      return state;
  }
}
