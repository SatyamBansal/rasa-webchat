import { createStore, combineReducers, applyMiddleware } from "redux";

import { SESSION_NAME } from "constants";

import behavior from "./reducers/behaviorReducer";
import messages from "./reducers/messagesReducer";
import purchaseOrders from "./reducers/poReducer";
import otherPOCharges from "./reducers/otherChargesReducer";
import { getLocalSession } from "./reducers/helper";
import * as actionTypes from "./actions/actionTypes";
import otherChargesReducer from "./reducers/otherChargesReducer";
import indentReducer from "./reducers/indentReducer";
import userReducer from "./reducers/userReducer";
import indentTypeBReducer from "./reducers/indentTypeBReducer";

import _ from "lodash";

let store = "call initStore first";

function initStore(hintText, connectingText, socket, storage, docViewer = false) {
    const customMiddleWare = store => next => action => {
        console.log("STORE....", store);
        const session_id = getLocalSession(storage, SESSION_NAME)
            ? getLocalSession(storage, SESSION_NAME).session_id
            : null;
        switch (action.type) {
            case actionTypes.EMIT_NEW_USER_MESSAGE: {
                console.log("User Uttering ############################ : ", {
                    message: action.text,
                    customData: socket.customData,
                    session_id
                });
                console.log("CURRENT STORE STATE : ", store.getState());
                socket.emit("user_uttered", {
                    message: action.text,
                    customData: socket.customData,
                    session_id
                });
                return;
            }

            case actionTypes.SEND_CUSTOM_ACTION_TEXT: {
                console.log("Sending Custom Action Text ############################ : ", {
                    message: action.data,
                    customData: socket.customData,
                    session_id
                });
                // console.log('CURRENT STORE STATE : ', store.getState());
                socket.emit("user_uttered", {
                    message: action.data,
                    customData: socket.customData,
                    session_id
                });
                return;
            }

            case actionTypes.SEND_INDENT_DATA: {
                console.log(
                    "*************************sending indent data to server ......",
                    store.getState().indents.indentData
                );
                const { userData } = store.getState();

                if (store.getState().indents.indentData.length > 1) {
                    console.log("Sending Indent Data Again ... ");
                    action.data = "/reply_ask_more_items";
                }
                console.log(action.type);
                socket.emit("user_uttered", {
                    message: action.data,
                    customData: { payload: store.getState().indents.indentData },
                    session_id
                });
                return;
            }
            case actionTypes.SEND_PO_DATA: {
                console.log(
                    "*************************sending po data to server ......",
                    action.data
                );
                console.log(action.type);
                socket.emit("user_uttered", {
                    message: action.data,
                    customData: { payload: action.customData },
                    session_id
                });
                next(action);
                return;
            }

            case actionTypes.SEND_AGAINST_SAMPLE_INDENT_DATA: {
                console.log(
                    "*************************sending against indent data to server ......",
                    action.data
                );
                console.log(action.type);
                socket.emit("user_uttered", {
                    message: action.data,
                    customData: { payload: action.customData },
                    session_id
                });
                next(action);
                return;
            }

            case actionTypes.SEND_CHARGES_DATA: {
                console.log(
                    "*************************sending charges data to server ......",
                    action.data
                );
                console.log(action.type);
                socket.emit("user_uttered", {
                    message: action.data,
                    customData: { payload: action.customData },
                    session_id
                });
                next(action);
                return;
            }
            case actionTypes.CANCEL_PO: {
                console.log("!!!!!! Aborting PO Creation Process .......... ");
                socket.emit("user_uttered", {
                    message: "/quit_po",
                    customData: socket.customData,
                    session_id
                });
                return;
            }
            case actionTypes.ABORT_PROCESS: {
                console.log("!!!!!!!!!!! Aborting Current Process ..........");
                socket.emit("user_uttered", {
                    message: "/abort_ywjvcnq",
                    customData: socket.customData,
                    session_id
                });
                next(action);
                return;
            }
            case actionTypes.GET_OPEN_STATE: {
                return store.getState().behavior.get("isChatOpen");
            }
            case actionTypes.GET_VISIBLE_STATE: {
                return store.getState().behavior.get("isChatVisible");
            }
            case actionTypes.GET_FULLSCREEN_STATE: {
                return store.getState().behavior.get("fullScreenMode");
            }
            default: {
                // Do something
            }
        }

        // console.log('Middleware triggered:', action);
        next(action);
    };
    const reducer = combineReducers({
        behavior: behavior(hintText, connectingText, storage, docViewer),
        messages: messages(storage),
        purchaseOrders: purchaseOrders(),
        otherPOCharges: otherChargesReducer(),
        indents: indentReducer(),
        userData: userReducer(),
        indentsTypeB: indentTypeBReducer()
    });

    /* eslint-disable no-underscore-dangle */
    store = createStore(
        reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        applyMiddleware(customMiddleWare)
    );
    /* eslint-enable */
}

export { initStore, store };
