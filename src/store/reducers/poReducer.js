import * as actionTypes from '../actions/actionTypes';


export default function () {
  const INITIAL_STATE = {
    selectedOrders: [],
    orders: []
  };

  return function reducer(state = INITIAL_STATE, action) {
    console.log('PO reducer INITIALIZED', action);
    switch (action.type) {

      case actionTypes.ADD_PURCHASE_ORDERS: {
        return { ...state, orders: action.payload };
      }
      case actionTypes.ADD_SELECTED_PURCHASE_ORDERS: {
        return { ...state, selectedOrders: action.payload };
      }
      default: {
        console.log('Returning Default State for po reducer : ', state);
        return state;
      }
    }
  };

}
