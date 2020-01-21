import * as actionTypes from '../actions/actionTypes';

export default function () {
  const INITIAL_STATE = {
    selectedOrders: [],
    orders: [],
    savedOrders: []
  };

  return function reducer(state = INITIAL_STATE, action) {
    console.log('PO reducer called with actioin : ', action);
    switch (action.type) {
      case actionTypes.ADD_PURCHASE_ORDERS: {
        console.log('Recieved new records', action.payload);
        const newOrders = action.payload;
        const savedIds = state.savedOrders.map(order => order.INDENT_DT_ID);
        console.log('SAVED ids', savedIds);
        const modifiedNewOrders = newOrders.map((record) => {
          console.log('Record', record);
          if (savedIds.includes(record.INDENT_DT_ID)) {
            console.log('Found Conflicting record');
            const savedRecord = state.savedOrders.find(
              obj => obj.INDENT_DT_ID == record.INDENT_DT_ID
            );
            if (savedRecord) {
              record.QUANTITY = savedRecord.QUANTITY;
              record.RATE = savedRecord.RATE;
              record.DEL_DATE = savedRecord.DEL_DATE;
            }
          }

          return record;
        });
        return { ...state, orders: modifiedNewOrders };
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
          if (prevOrders[i].INDENT_DT_ID == action.payload.orderid) {
            prevOrders[i][action.payload.key] = action.payload.value;
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
      case actionTypes.SEND_PO_DATA: {
        console.log('Updating saved Records ...');
        return { ...state, savedOrders: action.customData };
      }
      case actionTypes.CLEAR_PO_DATA: {
        console.log('Deleting Old PO data');
        return {
          selectedOrders: [],
          orders: [],
          savedOrders: []
        };
      }
      default: {
        console.log('Returning Default State for po reducer : ', state);
        return state;
      }
    }
  };
}
