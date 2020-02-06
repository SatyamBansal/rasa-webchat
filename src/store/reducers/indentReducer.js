import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';

// const INIT_STATE = {
//   item: {},
//   selecteduom: null,
//   uomlist: [],
//   rate: '',
//   qty: '',
//   qtyAlloted: 0,
//   supplier: {},
//   activity: {},
//   deliveryData: []
// };
// export default (state = INIT_STATE, action) => {
//   switch (action.type) {
//     case actionTypes.ADD_ITEM:
//       return {
//         ...state,
//         qty: action.data.quantity,
//         rate: action.data.rate.toString(),
//         item: action.data.toString()
//       };
//     case actionTypes.CHANGE_QUANTITY:
//       return {
//         ...state,
//         qty: action.data
//       };

//     case actionTypes.CHANGE_RATE:
//       return {
//         ...state,
//         rate: action.data
//       };

//     case actionTypes.CHANGE_ACTIVITY:
//       return {
//         ...state,
//         activity: action.data
//       };
//     case actionTypes.CHANGE_SUPPLIER:
//       return {
//         ...state,
//         supplier: action.data
//       };

//     case actionTypes.ADD_DELIVERY_DATA:
//       return {
//         ...state,
//         qtyAlloted: state.qtyAlloted + parseFloat(action.data.qty),
//         deliveryData: _.concat(state.deliveryData, action.data)
//       };
//     case actionTypes.DELTE_DELIVERY_DATA: {
//       const prevState = JSON.parse(JSON.stringify(state));
//       console.log('Ids to be deleted : ', action.payload);
//       return {
//         ...prevState,
//         deliveryData: prevState.deliveryData.filter(
//           data => !action.payload.includes(data.id)
//         )
//       };
//     }
//     default:
//       return state;
//   }
// };

export default function () {
  const INITIAL_STATE = {
    item: {},
    selecteduom: null,
    uomlist: [],
    rate: '',
    qty: '',
    qtyAlloted: 0,
    supplier: {},
    activity: {},
    deliveryData: [],
    indentData: []
  };

  return function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case actionTypes.ADD_ITEM:
        return {
          ...state,
          qty: action.data.quantity,
          rate: action.data.rate.toString(),
          item: action.data.toString()
        };
      case actionTypes.CHANGE_QUANTITY:
        return {
          ...state,
          qty: action.data
        };

      case actionTypes.CHANGE_RATE:
        return {
          ...state,
          rate: action.data
        };

      case actionTypes.CHANGE_ACTIVITY:
        return {
          ...state,
          activity: action.data
        };
      case actionTypes.CHANGE_SUPPLIER:
        return {
          ...state,
          supplier: action.data
        };

      case actionTypes.ADD_DELIVERY_DATA:
        return {
          ...state,
          qtyAlloted: state.qtyAlloted + parseFloat(action.data.qty),
          deliveryData: _.concat(state.deliveryData, action.data)
        };
      case actionTypes.DELTE_DELIVERY_DATA: {
        const prevState = JSON.parse(JSON.stringify(state));
        console.log('Ids to be deleted : ', action.payload);
        return {
          ...prevState,
          deliveryData: prevState.deliveryData.filter(
            data => !action.payload.includes(data.id)
          )
        };
      }
      case actionTypes.ADD_INDENT_DATA: {
        // called after sending data in middleware , so append data

        const prevState = JSON.parse(JSON.stringify(state));

        const indentItemData = {
          item: prevState.item,
          uom: prevState.selecteduom,
          rate: prevState.Rate,
          supplier: prevState.supplier,
          activity: prevState.activity,
          deliveryData: prevState.deliveryData
        };

        return {
          ...state,
          indentData: _.concat(prevState.indentData, indentItemData)
        };
      }
      default:
        return state;
    }
  };
}
