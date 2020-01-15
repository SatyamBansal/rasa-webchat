import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  toggleFullScreen,
  toggleChat,
  openChat,
  showChat,
  addUserMessage,
  emitUserMessage,
  addResponseMessage,
  addLinkSnippet,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  addPopup,
  addPurchaseOrders,
  addOtherCharges,
  addOtherChargesPopup,
  renderCustomComponent,
  initialize,
  connectServer,
  disconnectServer,
  pullSession,
  newUnreadMessage,
  triggerMessageDelayed,
  triggerTooltipSent,
  setTooltipMessage
} from 'actions';

import { SESSION_NAME, NEXT_MESSAGE } from 'constants';
import { isSnippet, isVideo, isImage, isQR, isText } from './msgProcessor';
import WidgetLayout from './layout';
import { storeLocalSession, getLocalSession } from '../../store/reducers/helper';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.messages = [];
    this.onGoingMessageDelay = false;
  }

  componentDidMount() {
    const { connectOn, autoClearCache, storage, dispatch } = this.props;

    if (connectOn === 'mount') {
      this.initializeWidget();
      return;
    }

    const localSession = getLocalSession(storage, SESSION_NAME);
    const lastUpdate = localSession ? localSession.lastUpdate : 0;

    if (autoClearCache) {
      if (Date.now() - lastUpdate < 30 * 60 * 1000) {
        this.initializeWidget();
      } else {
        localStorage.removeItem(SESSION_NAME);
      }
    } else {
      dispatch(pullSession());
      if (lastUpdate) this.initializeWidget();
    }
  }

  componentDidUpdate() {
    const { isChatOpen, dispatch, embedded, initialized } = this.props;

    dispatch(pullSession());

    if (isChatOpen) {
      if (!initialized) {
        this.initializeWidget();
      }
      this.trySendInitPayload();
    }

    if (embedded && initialized) {
      dispatch(showChat());
      dispatch(openChat());
    }
  }

  componentWillUnmount() {
    const { socket } = this.props;

    if (socket) {
      socket.close();
    }
    clearTimeout(this.tooltipTimeout);
  }

  getSessionId() {
    const { storage } = this.props;
    // Get the local session, check if there is an existing session_id
    const localSession = getLocalSession(storage, SESSION_NAME);
    const localId = localSession ? localSession.session_id : null;
    return localId;
  }

  handleMessageReceived(message) {
    const { dispatch } = this.props;
    if (!this.onGoingMessageDelay) {
      this.onGoingMessageDelay = true;
      dispatch(triggerMessageDelayed(true));
      this.newMessageTimeout(message);
    } else {
      this.messages.push(message);
    }
  }

  popLastMessage() {
    const { dispatch } = this.props;
    if (this.messages.length) {
      this.onGoingMessageDelay = true;
      dispatch(triggerMessageDelayed(true));
      this.newMessageTimeout(this.messages.shift());
    }
  }

  newMessageTimeout(messageWithMetadata) {
    const { dispatch, isChatOpen, customMessageDelay } = this.props;
    const { metadata, ...message } = messageWithMetadata;
    setTimeout(() => {
      this.dispatchMessage(message);
      if (!isChatOpen) {
        dispatch(newUnreadMessage());
      }
      dispatch(triggerMessageDelayed(false));
      this.onGoingMessageDelay = false;
      this.popLastMessage();
    }, customMessageDelay(message.text || ''));
  }

  initializeWidget() {
    const {
      storage,
      socket,
      dispatch,
      embedded,
      initialized,
      connectOn,
      tooltipPayload,
      tooltipDelay
    } = this.props;

    if (!socket.isInitialized()) {
      socket.createSocket();

      socket.on('bot_uttered', (botUttered) => {


        // botUttered = {
        //   type: 'popup',
        //   text: 'This is a custom popup',
        //   attachment: {
        //     payload: [
        //       {
        //         'Buyer Name': 'Satyam',
        //         Product: 'Product A',
        //         Qty: 100

        //       },
        //       {
        //         'Buyer Name': 'Buyer B',
        //         Product: 'Product B',
        //         Qty: 199

        //       }
        //     ]
        //   }
        // };

        function createData(name, calories, fat, carbs, protein) {
          return { name, calories, fat, carbs, protein };
        }

        // const rows = [
        //   createData('Satyam', 305, 3.7, 67, 4.3),
        //   createData('Donut', 452, 25.0, 51, 4.9),
        //   createData('Eclair', 262, 16.0, 24, 6.0),
        //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        //   createData('Gingerbread', 356, 16.0, 49, 3.9),
        //   createData('Honeycomb', 408, 3.2, 87, 6.5),
        //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        //   createData('Jelly Bean', 375, 0.0, 94, 0.0),
        //   createData('KitKat', 518, 26.0, 65, 7.0),
        //   createData('Lollipop', 392, 0.2, 98, 0.0),
        //   createData('Marshmallow', 318, 0, 81, 2.0),
        //   createData('Nougat', 360, 19.0, 9, 37.0),
        //   createData('Oreo', 437, 18.0, 63, 4.0)
        // ];

        // const rows = [
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11938,
        //     INDENT_ID: 11728,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4282,
        //     UOM_ID: 1,
        //     REQ_QTY: 1280.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/101219/1',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Cambric Gerige NAVY BLUE 28',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11985,
        //     INDENT_ID: 11752,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4275,
        //     UOM_ID: 1,
        //     REQ_QTY: 121.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/121219/1',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Fabric 1234 100 100% COTTON 55 BLACK',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11986,
        //     INDENT_ID: 11752,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4282,
        //     UOM_ID: 1,
        //     REQ_QTY: 1280.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/121219/1',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Cambric Gerige NAVY BLUE 28',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11987,
        //     INDENT_ID: 11753,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4275,
        //     UOM_ID: 1,
        //     REQ_QTY: 121.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/121219/2',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Fabric 1234 100 100% COTTON 55 BLACK',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11988,
        //     INDENT_ID: 11753,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4282,
        //     UOM_ID: 1,
        //     REQ_QTY: 1280.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/121219/2',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Cambric Gerige NAVY BLUE 28',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11989,
        //     INDENT_ID: 11754,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4275,
        //     UOM_ID: 1,
        //     REQ_QTY: 121.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/121219/3',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Fabric 1234 100 100% COTTON 55 BLACK',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11990,
        //     INDENT_ID: 11754,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4282,
        //     UOM_ID: 1,
        //     REQ_QTY: 1280.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/121219/3',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Cambric Gerige NAVY BLUE 28',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 12025,
        //     INDENT_ID: 11768,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4394,
        //     UOM_ID: 1,
        //     REQ_QTY: 19.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 33.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/171219/1',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Fabric 1234 50 90% poly 10% lycra 21 BLACK',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 12026,
        //     INDENT_ID: 11769,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4394,
        //     UOM_ID: 1,
        //     REQ_QTY: 19.0,
        //     BALANCE_QUANTITY: 9.0,
        //     QUANTITY: 9.0,
        //     L_SHORT: 0,
        //     RATE: 21.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/171219/2',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Fabric 1234 50 90% poly 10% lycra 21 BLACK',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 12077,
        //     INDENT_ID: 11795,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4274,
        //     UOM_ID: 1,
        //     REQ_QTY: 1537.0,
        //     BALANCE_QUANTITY: 99.0,
        //     QUANTITY: 99.0,
        //     L_SHORT: 0,
        //     RATE: 51.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/241219/1',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Fabric 1234 100 100% COTTON 55 RED',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 12078,
        //     INDENT_ID: 11795,
        //     JOB_ID: 8945,
        //     ITEM_ID: 4275,
        //     UOM_ID: 1,
        //     REQ_QTY: 121.0,
        //     BALANCE_QUANTITY: 91.0,
        //     QUANTITY: 91.0,
        //     L_SHORT: 0,
        //     RATE: 52.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/241219/1',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Fabric 1234 100 100% COTTON 55 BLACK',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11868,
        //     INDENT_ID: 11670,
        //     JOB_ID: 8945,
        //     ITEM_ID: 3,
        //     UOM_ID: 1,
        //     REQ_QTY: 1674.9,
        //     BALANCE_QUANTITY: 550.0,
        //     QUANTITY: 550.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/261119/2',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Cambric Greige',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 4265.0,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11876,
        //     INDENT_ID: 11676,
        //     JOB_ID: 8945,
        //     ITEM_ID: 3,
        //     UOM_ID: 1,
        //     REQ_QTY: 1674.9,
        //     BALANCE_QUANTITY: 55.0,
        //     QUANTITY: 55.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND/4/6/271119/4',
        //     JOB_DESCRIPTION: '131360 TOP//SUMIT-ORD-1',
        //     ITEM_DESC: 'Cambric Greige',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 4265.0,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 10684,
        //     INDENT_ID: 10508,
        //     JOB_ID: 8889,
        //     ITEM_ID: 3223,
        //     UOM_ID: 5,
        //     REQ_QTY: 1606.0,
        //     BALANCE_QUANTITY: 1606.0,
        //     QUANTITY: 1606.0,
        //     L_SHORT: 0,
        //     RATE: 50.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND10508',
        //     JOB_DESCRIPTION: '004//ORD-N009',
        //     ITEM_DESC: 'SlubSingletest',
        //     hsn_code: null,
        //     HSN_CODE__text: null,
        //     UOM_DESCRIPTION: 'Kilogram',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'Amazon India',
        //     UOM_id__text: 'Kilogram'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 10720,
        //     INDENT_ID: 10523,
        //     JOB_ID: 8941,
        //     ITEM_ID: 3156,
        //     UOM_ID: 1,
        //     REQ_QTY: 600.0,
        //     BALANCE_QUANTITY: 600.0,
        //     QUANTITY: 600.0,
        //     L_SHORT: 0,
        //     RATE: 100.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND10523',
        //     JOB_DESCRIPTION: '001TESTNEW//test_uom_change',
        //     ITEM_DESC: 'Fabric 1 1 1 1  RED',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 100.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 10722,
        //     INDENT_ID: 10523,
        //     JOB_ID: 8941,
        //     ITEM_ID: 4255,
        //     UOM_ID: 2,
        //     REQ_QTY: 600.0,
        //     BALANCE_QUANTITY: 600.0,
        //     QUANTITY: 600.0,
        //     L_SHORT: 0,
        //     RATE: 133.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND10523',
        //     JOB_DESCRIPTION: '001TESTNEW//test_uom_change',
        //     ITEM_DESC: 'Button BLACK  28',
        //     hsn_code: null,
        //     HSN_CODE__text: null,
        //     UOM_DESCRIPTION: 'Pcs.',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Pcs.'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11864,
        //     INDENT_ID: 11667,
        //     JOB_ID: 7847,
        //     ITEM_ID: 3222,
        //     UOM_ID: 5,
        //     REQ_QTY: 1.0,
        //     BALANCE_QUANTITY: 1.0,
        //     QUANTITY: 1.0,
        //     L_SHORT: 0,
        //     RATE: 50.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND11667',
        //     JOB_DESCRIPTION: '001TESTNEW//159159',
        //     ITEM_DESC: 'Slub Single Jersey 100%Ctn 34S 66"',
        //     hsn_code: null,
        //     HSN_CODE__text: null,
        //     UOM_DESCRIPTION: 'Kilogram',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: '48W',
        //     UOM_id__text: 'Kilogram'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11919,
        //     INDENT_ID: 11711,
        //     JOB_ID: 8981,
        //     ITEM_ID: 3220,
        //     UOM_ID: 5,
        //     REQ_QTY: 88.0,
        //     BALANCE_QUANTITY: 88.0,
        //     QUANTITY: 88.0,
        //     L_SHORT: 0,
        //     RATE: 1.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND11711',
        //     JOB_DESCRIPTION: '044//ON-test-0212',
        //     ITEM_DESC: 'Single Jersey 100%Ctn 30S N/A 64" 160 Winter White',
        //     hsn_code: 19,
        //     HSN_CODE__text: '121',
        //     UOM_DESCRIPTION: 'Kilogram',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 106.0,
        //     buyername: 'A G FABRICS',
        //     UOM_id__text: 'Kilogram'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 11999,
        //     INDENT_ID: 11756,
        //     JOB_ID: 8993,
        //     ITEM_ID: 4293,
        //     UOM_ID: 5,
        //     REQ_QTY: 16578.947,
        //     BALANCE_QUANTITY: 0.947,
        //     QUANTITY: 0.947,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND11755',
        //     JOB_DESCRIPTION: 'Linen BLUE-232 17//pankaj_wo1',
        //     ITEM_DESC: 'YARN GREIGE COTTON 100% 30s BLUE-232',
        //     hsn_code: null,
        //     HSN_CODE__text: null,
        //     UOM_DESCRIPTION: 'Kilogram',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 0.0,
        //     buyername: 'A G FABRICS',
        //     UOM_id__text: 'Kilogram'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 12028,
        //     INDENT_ID: 11772,
        //     JOB_ID: 9002,
        //     ITEM_ID: 687,
        //     UOM_ID: 5,
        //     REQ_QTY: 5978.261,
        //     BALANCE_QUANTITY: 0.001,
        //     QUANTITY: 0.001,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND11772',
        //     JOB_DESCRIPTION: 'Linen BOTTLE GREEN 39//SJ-WO-001',
        //     ITEM_DESC: 'YARN GREIGE 100% CTN   30s C.C.',
        //     hsn_code: null,
        //     HSN_CODE__text: null,
        //     UOM_DESCRIPTION: 'Kilogram',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 5958.26,
        //     buyername: 'A G FABRICS',
        //     UOM_id__text: 'Kilogram'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1364,
        //     INDENT_ID: 1274,
        //     JOB_ID: 2832,
        //     ITEM_ID: 18,
        //     UOM_ID: 1,
        //     REQ_QTY: 255199.998,
        //     BALANCE_QUANTITY: 0.003,
        //     QUANTITY: 0.003,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1274',
        //     JOB_DESCRIPTION: '17121//12121',
        //     ITEM_DESC: 'American Crepe - Green',
        //     hsn_code: 15,
        //     HSN_CODE__text: '123.576',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 2625525.0,
        //     buyername: 'New Delhi',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1375,
        //     INDENT_ID: 1277,
        //     JOB_ID: 2832,
        //     ITEM_ID: 18,
        //     UOM_ID: 1,
        //     REQ_QTY: 255199.998,
        //     BALANCE_QUANTITY: 0.003,
        //     QUANTITY: 0.003,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1277',
        //     JOB_DESCRIPTION: '17121//12121',
        //     ITEM_DESC: 'American Crepe - Green',
        //     hsn_code: 15,
        //     HSN_CODE__text: '123.576',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 2625525.0,
        //     buyername: 'New Delhi',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1386,
        //     INDENT_ID: 1280,
        //     JOB_ID: 2832,
        //     ITEM_ID: 18,
        //     UOM_ID: 1,
        //     REQ_QTY: 255199.998,
        //     BALANCE_QUANTITY: 0.003,
        //     QUANTITY: 0.003,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1280',
        //     JOB_DESCRIPTION: '17121//12121',
        //     ITEM_DESC: 'American Crepe - Green',
        //     hsn_code: 15,
        //     HSN_CODE__text: '123.576',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 2625525.0,
        //     buyername: 'New Delhi',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1395,
        //     INDENT_ID: 1283,
        //     JOB_ID: 2833,
        //     ITEM_ID: 21,
        //     UOM_ID: 1,
        //     REQ_QTY: 938.0,
        //     BALANCE_QUANTITY: 100.0,
        //     QUANTITY: 100.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1283',
        //     JOB_DESCRIPTION: '122220-B-DUNGREE//OTest_27062017',
        //     ITEM_DESC: 'ACRYLIC POLY AC70%POLY30% 54" 410 00-WHITE',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 33988.0,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1402,
        //     INDENT_ID: 1285,
        //     JOB_ID: 2832,
        //     ITEM_ID: 18,
        //     UOM_ID: 1,
        //     REQ_QTY: 255199.998,
        //     BALANCE_QUANTITY: 0.003,
        //     QUANTITY: 0.003,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1285',
        //     JOB_DESCRIPTION: '17121//12121',
        //     ITEM_DESC: 'American Crepe - Green',
        //     hsn_code: 15,
        //     HSN_CODE__text: '123.576',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 2625525.0,
        //     buyername: 'New Delhi',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1446,
        //     INDENT_ID: 1304,
        //     JOB_ID: 2837,
        //     ITEM_ID: 249,
        //     UOM_ID: 2,
        //     REQ_QTY: 1838.0,
        //     BALANCE_QUANTITY: 1828.0,
        //     QUANTITY: 1828.0,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1293',
        //     JOB_DESCRIPTION: 'T-Dress//GAP-06-010',
        //     ITEM_DESC: 'T-Dress SIZELABEL  small',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Pcs.',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Pcs.'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1454,
        //     INDENT_ID: 1305,
        //     JOB_ID: 2838,
        //     ITEM_ID: 242,
        //     UOM_ID: 1,
        //     REQ_QTY: 311.111,
        //     BALANCE_QUANTITY: 0.001,
        //     QUANTITY: 0.001,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1305',
        //     JOB_DESCRIPTION: 'Ice-cream Print Top//171059',
        //     ITEM_DESC: 'CAMBRICT 500 200 150X50 42IN',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 108229274.3,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 1811,
        //     INDENT_ID: 1566,
        //     JOB_ID: 2842,
        //     ITEM_ID: 23,
        //     UOM_ID: 1,
        //     REQ_QTY: 72145.284,
        //     BALANCE_QUANTITY: 0.002,
        //     QUANTITY: 0.002,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1566',
        //     JOB_DESCRIPTION: 'Anchor Print Shirt with Sleeve Tabs//17JUNE-30R',
        //     ITEM_DESC: 'ACRYLIC POLY AC70%POLY30% 54" 410 RED',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'New Delhi',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 4776,
        //     INDENT_ID: 1572,
        //     JOB_ID: 2857,
        //     ITEM_ID: 18,
        //     UOM_ID: 1,
        //     REQ_QTY: 29401.563,
        //     BALANCE_QUANTITY: 0.003,
        //     QUANTITY: 0.003,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND1572',
        //     JOB_DESCRIPTION: 'testprod//by123',
        //     ITEM_DESC: 'American Crepe - Green',
        //     hsn_code: 15,
        //     HSN_CODE__text: '123.576',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 2625525.0,
        //     buyername: 'GAP',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 3811,
        //     INDENT_ID: 4451,
        //     JOB_ID: 3916,
        //     ITEM_ID: 337,
        //     UOM_ID: 2,
        //     REQ_QTY: 945.0,
        //     BALANCE_QUANTITY: 45.0,
        //     QUANTITY: 45.0,
        //     L_SHORT: 0,
        //     RATE: 2.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND4451',
        //     JOB_DESCRIPTION: '131003-G-BLOUSE//01 Nov 017',
        //     ITEM_DESC: '1107118 SIZELABEL  0-3m',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Pcs.',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 42.0,
        //     buyername: 'VARDHAMAN',
        //     UOM_id__text: 'Pcs.'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 5080,
        //     INDENT_ID: 4891,
        //     JOB_ID: 4020,
        //     ITEM_ID: 21,
        //     UOM_ID: 1,
        //     REQ_QTY: 44069.502,
        //     BALANCE_QUANTITY: 0.002,
        //     QUANTITY: 0.002,
        //     L_SHORT: 0,
        //     RATE: 0.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND4891',
        //     JOB_DESCRIPTION: '09-feb-2018//dell08',
        //     ITEM_DESC: 'ACRYLIC POLY AC70%POLY30% 54" 410 00-WHITE',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 33988.0,
        //     buyername: 'A.V. EXPO FAB1',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 7063,
        //     INDENT_ID: 6085,
        //     JOB_ID: 4387,
        //     ITEM_ID: 12,
        //     UOM_ID: 1,
        //     REQ_QTY: 448.0,
        //     BALANCE_QUANTITY: 56.0,
        //     QUANTITY: 56.0,
        //     L_SHORT: 0,
        //     RATE: 20.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND6080',
        //     JOB_DESCRIPTION: '08022018//test200718',
        //     ITEM_DESC: 'Cambric - Blue',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 3246.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 7064,
        //     INDENT_ID: 6085,
        //     JOB_ID: 4387,
        //     ITEM_ID: 12,
        //     UOM_ID: 1,
        //     REQ_QTY: 448.0,
        //     BALANCE_QUANTITY: 56.0,
        //     QUANTITY: 56.0,
        //     L_SHORT: 0,
        //     RATE: 20.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND6080',
        //     JOB_DESCRIPTION: '08022018//test200718',
        //     ITEM_DESC: 'Cambric - Blue',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 3246.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 7127,
        //     INDENT_ID: 6118,
        //     JOB_ID: 4394,
        //     ITEM_ID: 242,
        //     UOM_ID: 1,
        //     REQ_QTY: 1272.0,
        //     BALANCE_QUANTITY: 1272.0,
        //     QUANTITY: 1272.0,
        //     L_SHORT: 0,
        //     RATE: 20.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND6100',
        //     JOB_DESCRIPTION: '10227 inner//ORD_16082018',
        //     ITEM_DESC: 'CAMBRICT 500 200 150X50 42IN',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 108229274.3,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 7140,
        //     INDENT_ID: 6118,
        //     JOB_ID: 4394,
        //     ITEM_ID: 15,
        //     UOM_ID: 7,
        //     REQ_QTY: 2.0,
        //     BALANCE_QUANTITY: 2.0,
        //     QUANTITY: 2.0,
        //     L_SHORT: 0,
        //     RATE: 2.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND6100',
        //     JOB_DESCRIPTION: '10227 inner//ORD_16082018',
        //     ITEM_DESC: 'Thread',
        //     hsn_code: 19,
        //     HSN_CODE__text: '121',
        //     UOM_DESCRIPTION: 'Reel',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 3575.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Reel'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8105,
        //     INDENT_ID: 7121,
        //     JOB_ID: 4428,
        //     ITEM_ID: 231,
        //     UOM_ID: 2,
        //     REQ_QTY: 77.0,
        //     BALANCE_QUANTITY: 77.0,
        //     QUANTITY: 77.0,
        //     L_SHORT: 0,
        //     RATE: 10.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7121',
        //     JOB_DESCRIPTION: '001TESTNEW//12sep2018',
        //     ITEM_DESC: '17121 Zip  104-110 Red',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Pcs.',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Pcs.'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8118,
        //     INDENT_ID: 7127,
        //     JOB_ID: 4427,
        //     ITEM_ID: 10,
        //     UOM_ID: 5,
        //     REQ_QTY: 100665.0,
        //     BALANCE_QUANTITY: 100665.0,
        //     QUANTITY: 100665.0,
        //     L_SHORT: 0,
        //     RATE: 4.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7127',
        //     JOB_DESCRIPTION: 'vvvvvvvvvvv//testlotcut',
        //     ITEM_DESC: 'Cotton Yarn-1',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Kilogram',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 72.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Kilogram'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8120,
        //     INDENT_ID: 7127,
        //     JOB_ID: 4427,
        //     ITEM_ID: 338,
        //     UOM_ID: 2,
        //     REQ_QTY: 6711.0,
        //     BALANCE_QUANTITY: 6711.0,
        //     QUANTITY: 6711.0,
        //     L_SHORT: 0,
        //     RATE: 4.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7127',
        //     JOB_DESCRIPTION: 'vvvvvvvvvvv//testlotcut',
        //     ITEM_DESC: '1107118 SIZELABEL  12-18m',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Pcs.',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 3100.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Pcs.'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8121,
        //     INDENT_ID: 7127,
        //     JOB_ID: 4427,
        //     ITEM_ID: 340,
        //     UOM_ID: 2,
        //     REQ_QTY: 6711.0,
        //     BALANCE_QUANTITY: 6711.0,
        //     QUANTITY: 6711.0,
        //     L_SHORT: 0,
        //     RATE: 4.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7127',
        //     JOB_DESCRIPTION: 'vvvvvvvvvvv//testlotcut',
        //     ITEM_DESC: '1107118 SIZELABEL  3-6m',
        //     hsn_code: 1,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Pcs.',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: null,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Pcs.'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8131,
        //     INDENT_ID: 7127,
        //     JOB_ID: 4427,
        //     ITEM_ID: 1807,
        //     UOM_ID: 1,
        //     REQ_QTY: 34226.0,
        //     BALANCE_QUANTITY: 10.0,
        //     QUANTITY: 10.0,
        //     L_SHORT: 0,
        //     RATE: 33.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7127',
        //     JOB_DESCRIPTION: 'vvvvvvvvvvv//testlotcut',
        //     ITEM_DESC: 'Fabric 1 1 1 1 95 GRIS CHINE CLAIR 1',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 264.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8131,
        //     INDENT_ID: 7127,
        //     JOB_ID: 4427,
        //     ITEM_ID: 1807,
        //     UOM_ID: 1,
        //     REQ_QTY: 34226.0,
        //     BALANCE_QUANTITY: 29653.0,
        //     QUANTITY: 29653.0,
        //     L_SHORT: 0,
        //     RATE: 33.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7127',
        //     JOB_DESCRIPTION: 'vvvvvvvvvvv//testlotcut',
        //     ITEM_DESC: 'Fabric 1 1 1 1 95 GRIS CHINE CLAIR 1',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 264.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8132,
        //     INDENT_ID: 7127,
        //     JOB_ID: 4427,
        //     ITEM_ID: 1807,
        //     UOM_ID: 1,
        //     REQ_QTY: 34226.0,
        //     BALANCE_QUANTITY: 2281.0,
        //     QUANTITY: 2281.0,
        //     L_SHORT: 0,
        //     RATE: 33.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7127',
        //     JOB_DESCRIPTION: 'vvvvvvvvvvv//testlotcut',
        //     ITEM_DESC: 'Fabric 1 1 1 1 95 GRIS CHINE CLAIR 1',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 264.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   },
        //   {
        //     DEL_DATE: null,
        //     INDENT_DT_ID: 8134,
        //     INDENT_ID: 7127,
        //     JOB_ID: 4427,
        //     ITEM_ID: 58,
        //     UOM_ID: 1,
        //     REQ_QTY: 11185.0,
        //     BALANCE_QUANTITY: 11185.0,
        //     QUANTITY: 11185.0,
        //     L_SHORT: 0,
        //     RATE: 55.0,
        //     CURR_RATE: 1,
        //     TAX_AMOUNT: 0,
        //     OTHER_AMOUNT: 0,
        //     RAW_QUANTITY: 0,
        //     INDENT_NO: 'IND7127',
        //     JOB_DESCRIPTION: 'vvvvvvvvvvv//testlotcut',
        //     ITEM_DESC: 'Fabric countq ddd conste 10',
        //     hsn_code: 3,
        //     HSN_CODE__text: '4858',
        //     UOM_DESCRIPTION: 'Meter',
        //     DELIVERY_DATE: null,
        //     BAL_STOCK: 78.0,
        //     buyername: 'A.V. EXPO FAB',
        //     UOM_id__text: 'Meter'
        //   }
        // ];
        // botUttered = {
        //   type: 'popup',

        //   payload: rows
        // };
        console.log('####################Response from bot socket : ', botUttered);

        if (botUttered.metadata && botUttered.metadata.tooltip) {
          dispatch(setTooltipMessage(String(botUttered.text)));
          return;
        }
        const newMessage = { ...botUttered, text: String(botUttered.text) };
        this.handleMessageReceived(newMessage);
      });

      dispatch(pullSession());

      // Request a session from server
      const localId = this.getSessionId();
      socket.on('connect', () => {
        socket.emit('session_request', { session_id: localId });
      });

      // When session_confirm is received from the server:
      socket.on('session_confirm', (remoteId) => {
        // eslint-disable-next-line no-console
        console.log(`session_confirm:${socket.socket.id} session_id:${remoteId}`);

        // Store the initial state to both the redux store and the storage, set connected to true
        dispatch(connectServer());

        /*
        Check if the session_id is consistent with the server
        If the localId is null or different from the remote_id,
        start a new session.
        */
        if (localId !== remoteId) {
          // storage.clear();
          // Store the received session_id to storage

          storeLocalSession(storage, SESSION_NAME, remoteId);
          dispatch(pullSession());
          this.trySendInitPayload();
          if (connectOn === 'mount' && tooltipPayload) {
            this.tooltipTimeout = setTimeout(() => {
              this.trySendTooltipPayload();
            }, parseInt(tooltipDelay, 10));
          }
        } else {
          // If this is an existing session, it's possible we changed pages and want to send a
          // user message when we land.
          const nextMessage = window.localStorage.getItem(NEXT_MESSAGE);

          if (nextMessage !== null) {
            const { message, expiry } = JSON.parse(nextMessage);
            window.localStorage.removeItem(NEXT_MESSAGE);

            if (expiry === 0 || expiry > Date.now()) {
              dispatch(addUserMessage(message));
              dispatch(emitUserMessage(message));
            }
          }
        }
      });

      socket.on('disconnect', (reason) => {
        // eslint-disable-next-line no-console
        console.log(reason);
        if (reason !== 'io client disconnect') {
          dispatch(disconnectServer());
        }
      });
    }

    if (embedded && initialized) {
      dispatch(showChat());
      dispatch(openChat());
    }
  }

  // TODO: Need to erase redux store on load if localStorage
  // is erased. Then behavior on reload can be consistent with
  // behavior on first load

  trySendInitPayload() {
    const {
      initPayload,
      customData,
      socket,
      initialized,
      isChatOpen,
      isChatVisible,
      embedded,
      connected,
      dispatch
    } = this.props;

    // Send initial payload when chat is opened or widget is shown
    if (!initialized && connected && ((isChatOpen && isChatVisible) || embedded)) {
      // Only send initial payload if the widget is connected to the server but not yet initialized

      const sessionId = this.getSessionId();

      // check that session_id is confirmed
      if (!sessionId) return;

      // eslint-disable-next-line no-console
      console.log('sending init payload', sessionId);
      socket.emit('user_uttered', { message: initPayload, customData, session_id: sessionId });
      dispatch(initialize());
    }
  }

  trySendTooltipPayload() {
    const {
      tooltipPayload,
      socket,
      customData,
      connected,
      isChatOpen,
      dispatch,
      tooltipSent
    } = this.props;

    if (connected && !isChatOpen && !tooltipSent) {
      const sessionId = this.getSessionId();

      if (!sessionId) return;

      socket.emit('user_uttered', { message: tooltipPayload, customData, session_id: sessionId });

      dispatch(triggerTooltipSent());
    }
  }

  toggleConversation() {
    this.props.dispatch(setTooltipMessage(null));
    clearTimeout(this.tooltipTimeout);
    this.props.dispatch(toggleChat());
  }

  toggleFullScreen() {
    this.props.dispatch(toggleFullScreen());
  }

  dispatchMessage(message) {
    if (Object.keys(message).length === 0) {
      return;
    }

    if (isText(message)) {
      this.props.dispatch(addResponseMessage(message.text));
    } else if (isQR(message)) {
      this.props.dispatch(addQuickReply(message));
    } else if (isSnippet(message)) {
      const element = message.attachment.payload.elements[0];
      this.props.dispatch(
        addLinkSnippet({
          title: element.title,
          content: element.buttons[0].title,
          link: element.buttons[0].url,
          target: '_blank'
        })
      );
    } else if (isVideo(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(
        addVideoSnippet({
          title: element.title,
          video: element.src
        })
      );
    } else if (isImage(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(
        addImageSnippet({
          title: element.title,
          image: element.src
        })
      );
    } else if (message.type == 'popup') {
      console.log('Adding Orders : ', message.payload);
      const orders = message.payload;
      for (let i = 0; i < orders.length; ++i) {
        orders[i]._id = i;
      }
      this.props.dispatch(addPurchaseOrders(orders));
      this.props.dispatch(addPopup(message.text));
    } else if(message.type == 'otherpocharges'){
      console.log('##############Other Charges Popup Triggered');
      console.log('Adding Other Charges : ', message.payload);
      const charges = message.payload;
      for (let i = 0; i < charges.length; ++i) {
        charges[i]._id = i;
      }

      this.props.dispatch(addOtherCharges(charges));
      this.props.dispatch(addOtherChargesPopup(message.text));
      
    } else {
      // some custom message
      const props = message;
      if (this.props.customComponent) {
        this.props.dispatch(renderCustomComponent(this.props.customComponent, props, true));
      }
    }
  }

  handleMessageSubmit(event) {
    event.preventDefault();
    const userUttered = event.target.message.value;
    if (userUttered) {
      this.props.dispatch(addUserMessage(userUttered));
      this.props.dispatch(emitUserMessage(userUttered));
    }
    event.target.message.value = '';
  }

  render() {
    return (
      <WidgetLayout
        toggleChat={() => this.toggleConversation()}
        toggleFullScreen={() => this.toggleFullScreen()}
        onSendMessage={event => this.handleMessageSubmit(event)}
        title={this.props.title}
        subtitle={this.props.subtitle}
        customData={this.props.customData}
        profileAvatar={this.props.profileAvatar}
        showCloseButton={this.props.showCloseButton}
        showFullScreenButton={this.props.showFullScreenButton}
        hideWhenNotConnected={this.props.hideWhenNotConnected}
        fullScreenMode={this.props.fullScreenMode}
        isChatOpen={this.props.isChatOpen}
        isChatVisible={this.props.isChatVisible}
        badge={this.props.badge}
        embedded={this.props.embedded}
        params={this.props.params}
        openLauncherImage={this.props.openLauncherImage}
        closeImage={this.props.closeImage}
        customComponent={this.props.customComponent}
        displayUnreadCount={this.props.displayUnreadCount}
        showMessageDate={this.props.showMessageDate}
        tooltipPayload={this.props.tooltipPayload}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.behavior.get('initialized'),
  connected: state.behavior.get('connected'),
  isChatOpen: state.behavior.get('isChatOpen'),
  isChatVisible: state.behavior.get('isChatVisible'),
  fullScreenMode: state.behavior.get('fullScreenMode'),
  tooltipSent: state.behavior.get('tooltipSent')
});

Widget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  customData: PropTypes.shape({}),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  initPayload: PropTypes.string,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  connectOn: PropTypes.oneOf(['mount', 'open']),
  autoClearCache: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  isChatVisible: PropTypes.bool,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  socket: PropTypes.shape({}),
  embedded: PropTypes.bool,
  params: PropTypes.object,
  connected: PropTypes.bool,
  initialized: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  customMessageDelay: PropTypes.func.isRequired,
  tooltipPayload: PropTypes.string,
  tooltipSent: PropTypes.bool.isRequired,
  tooltipDelay: PropTypes.number.isRequired
};

Widget.defaultProps = {
  isChatOpen: false,
  isChatVisible: true,
  fullScreenMode: false,
  connectOn: 'mount',
  autoClearCache: false,
  displayUnreadCount: false,
  tooltipPayload: null
};

export default connect(mapStateToProps)(Widget);
