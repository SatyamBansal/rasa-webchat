import * as actionTypes from '../actions/actionTypes';

export default function () {
  const INITIAL_STATE = {
    selectedCharges: [],
    charges: []
  };

  return function reducer(state = INITIAL_STATE, action) {
    console.log('PO reducer INITIALIZED', action);
    switch (action.type) {
      case actionTypes.ADD_OTHER_CHARGES: {
        const pocharges = action.payload;
        for (let i = 0; i < pocharges.length; ++i) {
          if (pocharges[i].ACCOUNT_PERCENTAGE == 'null') {
            pocharges[i].unit = 'percentage';
          } else {
            pocharges[i].unit = 'fixed';
          }
        }

        console.log('#####################', pocharges);
        return { ...state, charges: pocharges };
      }
      case actionTypes.SELECT_CHARGES: {
        return { ...state, selectedCharges: action.payload };
      }
      case actionTypes.MODIFY_CHARGES: {
        // console.log('INitial Quantity:', state.orders[0].QUANTITY);
        // const modifiedState = { ...state };
        const modifiedState = JSON.parse(JSON.stringify(state));
        const prevCharges = modifiedState.charges;
        for (let i = 0; i < prevOrders.length; ++i) {
          if (prevCharges[i]._id == action.payload.chargesid) {
            prevCharges[i][action.payload.key] = action.payload.value;
            break;
          }
        }

        console.log(
          'Previous State ====================  ',
          state === modifiedState,
          state.orders[0].QUANTITY
        );

        return modifiedState;
      }
      default: {
        console.log('Returning Default State for charges reducer : ', state);
        return state;
      }
    }
  };
}
