import * as actions from './actionTypes';

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
    data: '/inform',
    customData: data
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

export const addItem = (item) => ({
        type: actions.ADD_ITEM,
        data: item
    });

export const changeQuantity = (value) => ({
        type: actions.CHANGE_QUANTITY,
        data: value
    });
export const changeActivity = (value) => ({
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
export const deleteDeliveryData = (ids) => ({
        type: actions.DELTE_DELIVERY_DATA,
        payload: ids
    });
export const changeSupplier = (value) => ({
        type: actions.CHANGE_SUPPLIER,
        data: value
    });

export const changeRate = (value) => ({
        type: actions.CHANGE_RATE,
        data: value
    });
