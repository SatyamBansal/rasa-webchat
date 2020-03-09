import { Map } from "immutable";
import * as actionTypes from "../actions/actionTypes";

export default function() {
    const initialState = {
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
        clientCode: null,
        uiApiHost: null,
        department: null
    };

    return function reducer(state = initialState, action) {
        switch (action.type) {
            case actionTypes.ADD_USER_DATA: {
                console.log("Adding user details : ", action);
                return { ...state, ...action.data };
            }

            default:
                return state;
        }
    };
}
