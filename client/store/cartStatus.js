export const CART_LOADING = 'CART_LOADING';

export const setLoading = (status) => {
  return {
    type: CART_LOADING,
    status,
  };
};

export default function cartStatusReducer(state = '', action) {
  switch (action.type) {
    case CART_LOADING:
      return action.status;
    default:
      return state;
  }
}
