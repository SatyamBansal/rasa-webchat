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
      case actionTypes.SELECT_PURCHASE_ORDERS: {
        return { ...state, selectedOrders: action.payload };
      }
      case actionTypes.MODIFY_PUCHASE_ORDER: {
        console.log('INitial Quantity:', state.orders[0].QUANTITY);
        // const modifiedState = { ...state };
        const modifiedState = JSON.parse(JSON.stringify(state));
        const prevOrders = modifiedState.orders;
        for (let i = 0; i < prevOrders.length; ++i) {
          if (prevOrders[i]._id == action.payload.orderid) {
            prevOrders[i][action.payload.key] = action.payload.value;
            break;
          }
        }

        console.log('Previous State ====================  ', state === modifiedState, state.orders[0].QUANTITY);

        return modifiedState;
      }
      default: {
        console.log('Returning Default State for po reducer : ', state);
        return state;
      }
    }
  };

}
