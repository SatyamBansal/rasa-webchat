import * as actionTypes from '../actions/actionTypes';

export default function () {
  const INITIAL_STATE = {
    selectedCharges: [],
    charges: [],
    amount: 200
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
        console.log('Updating selected charges...');
        return { ...state, selectedCharges: action.payload };
      }
      case actionTypes.MODIFY_OTHER_CHARGES: {
        // console.log('INitial Quantity:', state.orders[0].QUANTITY);
        // const modifiedState = { ...state };
        const modifiedState = JSON.parse(JSON.stringify(state));
        const prevCharges = modifiedState.charges;
        for (let i = 0; i < prevCharges.length; ++i) {
          if (prevCharges[i]._id == action.payload.id) {
            prevCharges[i][action.payload.key] = action.payload.value;

            // if (
            //   action.payload.key == 'ACCOUNT_PERCENTAGE' ||
            //                 action.payload.key == 'unit'
            // ) {
            //   if (prevCharges[i].unit == 'percentage') {
            //     prevCharges[i].AMOUNT =
            //                         (modifiedState.amount * prevCharges[i].ACCOUNT_PERCENTAGE) /
            //                         100;
            //   }
            // }
            if (action.payload.key == 'ACCOUNT_PERCENTAGE') {
              prevCharges[i].AMOUNT =
                                (modifiedState.amount * prevCharges[i].ACCOUNT_PERCENTAGE) / 100;
            }
            if (action.payload.key == 'AMOUNT') {
              prevCharges[i].ACCOUNT_PERCENTAGE =
                                (prevCharges[i].AMOUNT * 100) / modifiedState.amount;
            }
            break;
          }
        }

        // console.log(
        //   'Previous State ====================  ',
        //   state === modifiedState,
        //   state.orders[0].QUANTITY
        // );

        return modifiedState;
      }
      default: {
        console.log('Returning Default State for charges reducer : ', state);
        return state;
      }
    }
  };
}
