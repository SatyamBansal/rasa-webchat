import * as actions from "./actionTypes";

export function initialize() {
    return {
        type: actions.INITIALIZE
    };
}

export function connectServer() {
    return {
        type: actions.CONNECT
    };
}

export function disconnectServer() {
    return {
        type: actions.DISCONNECT
    };
}

export function getOpenState() {
    return {
        type: actions.GET_OPEN_STATE
    };
}

export function getVisibleState() {
    return {
        type: actions.GET_VISIBLE_STATE
    };
}

export function showChat() {
    return {
        type: actions.SHOW_CHAT
    };
}

export function hideChat() {
    return {
        type: actions.HIDE_CHAT
    };
}

export function toggleChat() {
    return {
        type: actions.TOGGLE_CHAT
    };
}

export function openChat() {
    return {
        type: actions.OPEN_CHAT
    };
}

export function closeChat() {
    return {
        type: actions.CLOSE_CHAT
    };
}

export function toggleFullScreen() {
    return {
        type: actions.TOGGLE_FULLSCREEN
    };
}

export function toggleInputDisabled() {
    return {
        type: actions.TOGGLE_INPUT_DISABLED
    };
}

export function changeInputFieldHint(hint) {
    return {
        type: actions.CHANGE_INPUT_FIELD_HINT,
        hint
    };
}

export function addUserMessage(text) {
    return {
        type: actions.ADD_NEW_USER_MESSAGE,
        text
    };
}

export function updatePOAmount(value) {
    return {
        type: actions.UPDATE_PO_TOTAL_AMOUNT,
        value
    };
}

export function emitUserMessage(text) {
    return {
        type: actions.EMIT_NEW_USER_MESSAGE,
        text
    };
}

export function sendChargesData(data) {
    return {
        type: actions.SEND_CHARGES_DATA,
        data: '/inform{"is_other_charges":"yes"}',
        customData: data
    };
}

export function sendPOData(data) {
    return {
        type: actions.SEND_PO_DATA,
        data: "/inform",
        customData: data
    };
}

export function sendIndentData() {
    return {
        type: actions.SEND_INDENT_DATA,
        data: "/inform"
    };
}

export function addIndentData() {
    return {
        type: actions.ADD_INDENT_DATA
    };
}

export function cancelPO() {
    return {
        type: actions.CANCEL_PO
    };
}

export function deletePopupMessage(data) {
    return {
        type: actions.DELETE_POPUP_MESSAGE
    };
}

export function addResponseMessage(text) {
    return {
        type: actions.ADD_NEW_RESPONSE_MESSAGE,
        text
    };
}

export function addPopup(text) {
    return {
        type: actions.ADD_POPUP,
        text
    };
}

export function addIndentPopup(text) {
    return {
        type: actions.ADD_INDENT_POPUP,
        text
    };
}

export function addPurchaseOrders(orders) {
    return {
        type: actions.ADD_PURCHASE_ORDERS,
        payload: orders
    };
}

export function addOtherCharges(charges) {
    return {
        type: actions.ADD_OTHER_CHARGES,
        payload: charges
    };
}

export function addOtherChargesPopup(text) {
    return {
        type: actions.ADD_OTHER_CHARGES_POPUP,
        text
    };
}

export function selectOtherCharges(charges) {
    return {
        type: actions.SELECT_CHARGES,
        payload: charges
    };
}

export function selectPurchaseOrders(orders) {
    return {
        type: actions.SELECT_PURCHASE_ORDERS,
        payload: orders
    };
}

export function modifyPurchaseOrder(orderid, key, value) {
    return {
        type: actions.MODIFY_PUCHASE_ORDER,
        payload: {
            orderid,
            key,
            value
        }
    };
}

export function abortProcess() {
    return {
        type: actions.ABORT_PROCESS
    };
}

export function clearPOdata() {
    return {
        type: actions.CLEAR_PO_DATA
    };
}

export function modifyOtherCharges(id, key, value) {
    return {
        type: actions.MODIFY_OTHER_CHARGES,
        payload: {
            id,
            key,
            value
        }
    };
}
export function addLinkSnippet(link) {
    return {
        type: actions.ADD_NEW_LINK_SNIPPET,
        link
    };
}

export function addVideoSnippet(video) {
    return {
        type: actions.ADD_NEW_VIDEO_VIDREPLY,
        video
    };
}

export function addImageSnippet(image) {
    return {
        type: actions.ADD_NEW_IMAGE_IMGREPLY,
        image
    };
}

export function addQuickReply(quickReply) {
    return {
        type: actions.ADD_QUICK_REPLY,
        quickReply
    };
}

export function setQuickReply(id, title) {
    return {
        type: actions.SET_QUICK_REPLY,
        id,
        title
    };
}

export function insertUserMessage(index, text) {
    return {
        type: actions.INSERT_NEW_USER_MESSAGE,
        index,
        text
    };
}

export function renderCustomComponent(component, props, showAvatar) {
    return {
        type: actions.ADD_COMPONENT_MESSAGE,
        component,
        props,
        showAvatar
    };
}

export function dropMessages() {
    return {
        type: actions.DROP_MESSAGES
    };
}

export function pullSession() {
    return {
        type: actions.PULL_SESSION
    };
}

export function newUnreadMessage() {
    return {
        type: actions.NEW_UNREAD_MESSAGE
    };
}

export function triggerMessageDelayed(messageDelayed) {
    return {
        type: actions.TRIGGER_MESSAGE_DELAY,
        messageDelayed
    };
}

export function setTooltipMessage(tooltipMessage) {
    return {
        type: actions.SET_TOOLTIP_MESSAGE,
        tooltipMessage
    };
}

export function triggerTooltipSent() {
    return {
        type: actions.TRIGGER_TOOLTIP_SENT
    };
}

export const addItem = item => ({
    type: actions.ADD_ITEM,
    data: item
});

export const changeQuantity = value => ({
    type: actions.CHANGE_QUANTITY,
    data: value
});
export const changeActivity = value => ({
    type: actions.CHANGE_ACTIVITY,
    data: value
});

export const addDeliveryData = (id, date, qty, location) => ({
    type: actions.ADD_DELIVERY_DATA,
    data: {
        id,
        date,
        qty,
        location
    }
});
export const deleteDeliveryData = ids => ({
    type: actions.DELTE_DELIVERY_DATA,
    payload: ids
});
export const changeSupplier = value => ({
    type: actions.CHANGE_SUPPLIER,
    data: value
});

export const changeUom = value => ({
    type: actions.CHANGE_UOM,
    data: value
});

export const changeRate = value => ({
    type: actions.CHANGE_RATE,
    data: value
});

// "company_name":"Arvind", "project_name":"ProAct", "user_name":"Deepmala", "user_email":"deepmala.burnwal@arvindbrands.co.in", "user_id":"1", "api_host": "http://192.168.1.33:81", "ccid":"69", "cost_user":"arvind@bluekaktus.com", "company_id": "4", "location_id": "6", "client_code": "akri48"
// Manage User data

export const addUserData = info => {
    console.log({ info });
    return {
        type: actions.ADD_USER_DATA,
        data: {
            companyName: info.client_code,
            projectName: info.project_name,
            userName: info.user_name,
            userEmail: info.user_email,
            userId: info.user_id,
            apiHost: info.api_host,
            ccid: info.ccid,
            costUser: info.cost_user,
            companyId: info.company_id,
            locationId: info.location_id,
            clientCode: info.client_code,
            uiApiHost: info.ui_api_host || "https://bluekaktus.com",
            department: info.indent_department_code_login
        }
    };
};

export function addAgainstSampleIndentPopup(text) {
    return {
        type: actions.ADD_AGAINST_SAMPLE_INDENT_POPUP,
        text
    };
}

export function addAgainstSampleIndentData(indents) {
    return {
        type: actions.ADD_AGAINST_SAMPLE_INDENT_DATA,
        payload: indents
    };
}

export function modifyIndent(orderid, key, value) {
    return {
        type: actions.MODIFY_INDENT,
        payload: {
            orderid,
            key,
            value
        }
    };
}

export function changeIndentSupplier(id, supplier) {
    return {
        type: actions.CHANGE_INDENT_SUPPLIER,
        payload: {
            id,
            supplier
        }
    };
}

export function changeIndentActivity(id, activity) {
    return {
        type: actions.CHANGE_INDENT_ACTIVITY,
        payload: {
            id,
            activity
        }
    };
}

export function selectIndents(indents) {
    return {
        type: actions.SELECT_INDENTS,
        payload: indents
    };
}

export function sendAgainstSampleIndentData(indents) {
    return {
        type: actions.SEND_AGAINST_SAMPLE_INDENT_DATA,
        data: "/inform",
        customData: indents
    };
}

export function sendCustomActionText(text) {
    return {
        type: actions.SEND_CUSTOM_ACTION_TEXT,
        data: text
    };
}

export function addPOConfirmationPopup(text) {
    return {
        type: actions.ADD_PO_CONFIRMATION_POPUP,
        text
    };
}

export function addPOConfirmationData(data) {
    return {
        type: actions.ADD_PO_CONFIRMATION_DATA,
        payload: data
    };
}

export function sendPOConfirmationData(data) {
    return {
        type: actions.SEND_PO_COFIRMATION_DATA,
        data: "/change",
        customData: data
    };
}

export function selectPOChanges(orders) {
    return {
        type: actions.SELECT_PO_CHANGES,
        payload: orders
    };
}

export function clearIndentData() {
    return {
        type: actions.CLEAR_INDENT_DATA
    };
}

export function hideComponent(componentName) {
    return {
        type: actions.HIDE_COMPONENT,
        data: componentName
    };
}
