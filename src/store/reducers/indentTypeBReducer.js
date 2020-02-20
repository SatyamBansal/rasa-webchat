// Reducer for Indents Type B

import * as actionTypes from "../actions/actionTypes";

export default function() {
    const INITIAL_STATE = {
        selectedIndents: [],
        indents: [],
        savedIndents: []
    };

    return function reducer(state = INITIAL_STATE, action) {
        console.log("Indent Type B reducer called with action : ", action);
        switch (action.type) {
            case actionTypes.ADD_AGAINST_SAMPLE_INDENT_DATA: {
                console.log("Recieved new indents", action.payload);
                const newIndents = action.payload;
                const savedIds = state.savedIndents.map(indent => indent.PD_ITEM_DT_ID);
                console.log("SAVED ids", savedIds);
                const modifiedNewIndents = newIndents.map(record => {
                    console.log("Record", record);
                    if (savedIds.includes(record.PD_ITEM_DT_ID)) {
                        console.log("Found Conflicting record");
                        const savedRecord = state.savedIndents.find(
                            obj => obj.PD_ITEM_DT_ID == record.PD_ITEM_DT_ID
                        );
                        if (savedRecord) {
                            record.QUANTITY = savedRecord.QUANTITY;
                        }
                    }

                    return record;
                });
                return { ...state, indents: modifiedNewIndents };
            }
            case actionTypes.SELECT_INDENTS: {
                return { ...state, selectedIndents: action.payload };
            }
            case actionTypes.MODIFY_INDENT: {
                console.log("INitial Quantity:", state.indents[0].QUANTITY);
                // const modifiedState = { ...state };
                const modifiedState = JSON.parse(JSON.stringify(state));
                const prevOrders = modifiedState.indents;
                for (let i = 0; i < prevOrders.length; ++i) {
                    if (prevOrders[i].PD_ITEM_DT_ID == action.payload.orderid) {
                        if (action.payload.key == "QUANTITY") {
                            if (parseFloat(action.payload.value) < 0) {
                                action.payload.value = parseFloat(action.payload.value) * -1;
                            }
                        }
                        prevOrders[i][action.payload.key] = action.payload.value;
                        break;
                    }
                }

                console.log(
                    "Previous State ====================  ",
                    state === modifiedState,
                    state.indents[0].QUANTITY
                );

                return modifiedState;
            }

            case actionTypes.SEND_AGAINST_SAMPLE_INDENT_DATA: {
                console.log("Updating saved Records ...");
                return { ...state, savedIndents: action.customData };
            }
            case actionTypes.CLEAR_INDENT_DATA: {
                console.log("Deleting Old PO data");
                return {
                    selectedIndents: [],
                    indents: [],
                    savedIndents: []
                };
            }
            case actionTypes.CHANGE_INDENT_SUPPLIER: {
                console.log("IN change indent supplier", { action });
                let modifiedState;
                modifiedState = JSON.parse(JSON.stringify(state));

                modifiedState.indents = modifiedState.indents.map(item => {
                    if (item.PD_ITEM_DT_ID == action.payload.id) {
                        console.log("Changing Supplier in reducer");
                        item.SUPPLIER = action.payload.supplier;
                        return item;
                    }

                    return item;
                });

                return { ...modifiedState };
            }
            case actionTypes.CHANGE_INDENT_ACTIVITY: {
                console.log("IN change indent activity", { action });
                let modifiedState;
                modifiedState = JSON.parse(JSON.stringify(state));

                modifiedState.indents = modifiedState.indents.map(item => {
                    if (item.PD_ITEM_DT_ID == action.payload.id) {
                        console.log("Changing Activity in reducer");
                        item.ACTIVITY = action.payload.activity;
                        return item;
                    }

                    return item;
                });

                return { ...modifiedState };
            }
            default: {
                console.log("Returning Default State for po reducer : ", state);
                return state;
            }
        }
    };
}
("");
