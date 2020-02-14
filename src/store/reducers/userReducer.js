import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';

export default function () {
  const initialState = Map({
    companyName: null,
    projectName: null,
    userName: null,
    userEmail: null,
    userId: null,
    apiHost: null,
    ccid: null,
    costUser: null,
    companyId: null,
    locationId: null,
    clientCode: null
  });

  return function reducer(state = initialState, action) {
    switch (action.type) {
      case actionTypes.ADD_USER_DATA: {
        return state.merge(action.data);
      }

      default:
        return state;
    }
  };
}
