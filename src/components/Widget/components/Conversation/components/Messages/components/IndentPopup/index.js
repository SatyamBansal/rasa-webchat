import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  toggleInputDisabled,
  changeInputFieldHint,
  sendIndentData,
  addIndentData,
  deletePopupMessage,
  cancelPO,
  changeQuantity,
  changeRate,
  changeSupplier,
  changeActivity
} from 'actions';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
// import POTable from './Components/POTable';
import DialogContentText from '@material-ui/core/DialogContentText';

import Selector from './Components/Selector';
import IndentDetails from './Components/IndentDetails';

import { Table } from '@material-ui/core';

// import './styles.scss';
// import { compareAsc, format } from 'date-fns';
import { UI_MESSAGES } from 'constants';

const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC' },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' }
];

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const AlertDialog = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    // setOpen(true);
  };

  const handlePositive = () => {
    // setOpen(false);

    props.discardPO();
  };

  const handleNegative = () => {
    console.log('Closing Alert Dialog ');

    props.closeAlert();
  };

  return (
    <div>
      <Dialog
        open={props.showAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">{"Discard Changes ?"}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
                        Discard Changes ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNegative} color="primary">
                        Disagree
          </Button>
          <Button onClick={handlePositive} color="primary" autoFocus>
                        Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>

      <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

class IndentPopup extends Component {
    state = {
      isDialogOpen: false,
      isDirty: false,
      showAlert: false,
      isDataValid: false,
      disableItemInput: false,
      activitySelector: {
        options: [],
        loading: true
      },
      supplierSelector: {
        options: [],
        loading: true
      }
    };

    openDialog() {
      this.setState({
        isDialogOpen: true
      });
    }

    closeDialog() {
      this.setState({ isDialogOpen: false });
    }

    closeAlert() {
      this.setState({ showAlert: false });
    }

    dataChanged() {
      this.setState(state => ({
        isDirty: !state.isDirty
      }));
    }

    discardPO() {
      this.props.dispatch(deletePopupMessage());
      this.props.dispatch(cancelPO());
      this.enableUserInput();
      this.setState({ isDialogOpen: false, showAlert: false });
    }

    savePO() {
      this.closeDialog();
    }

    handleClose() {
      this.setState({ showAlert: true });
      console.log('Dialog is Closed');
    }

    // filterOrdersData(orderids = [], orders) {
    //   console.log('IDS : ', orderids);
    //   console.log('Orders : ', orders);
    //   return orders.filter(order => orderids.includes(order.INDENT_DT_ID));
    // }

    // getOrdersData(selectedOrderids = [], orders, savedOrders) {
    //   console.log('DEbug', { selectedOrderids, orders, savedOrders });
    //   // console.log('Filtered Selected Records', this.filterOrdersData(selectedOrderids, orders));
    //   const exclusiveSavedIds = [];

    //   const savedIds = savedOrders.map(order => order.INDENT_DT_ID);

    //   const orderIds = orders.map(order => order.INDENT_DT_ID);
    //   for (let i = 0; i < savedIds.length; ++i) {
    //     if (!orderIds.includes(savedIds[i])) {
    //       exclusiveSavedIds.push(savedIds[i]);
    //     }
    //     // else{

    //     //   //add in exclusive
    //     // }
    //     // if (selectedOrderids.includes(savedIds[i]) || orderIds.includes(savedIds[i])) {
    //     //   continue;
    //     // } else {

    //     // }
    //   }
    //   console.log('Exclusive ids :', exclusiveSavedIds);
    //   console.log(
    //     'saved exclusive data : ',
    //     this.filterOrdersData(exclusiveSavedIds, savedOrders)
    //   );
    //   console.log('selected record data : ', this.filterOrdersData(selectedOrderids, orders));
    //   const newSavedOrders = [];
    //   newSavedOrders.concat(this.filterOrdersData(exclusiveSavedIds, savedOrders));
    //   newSavedOrders.concat(this.filterOrdersData(selectedOrderids, orders));
    //   return [
    //     ...this.filterOrdersData(exclusiveSavedIds, savedOrders),
    //     ...this.filterOrdersData(selectedOrderids, orders)
    //   ];
    // }

    // isDataValid(ids, orders) {
    //   const selectedOrders = this.filterOrdersData(ids, orders);
    //   console.log('Checking DAta Valadity for orders : ', selectedOrders);
    //   // return selectedOrders.length > 2;
    //   for (let i = 0; i < selectedOrders.length; ++i) {
    //     if (parseFloat(selectedOrders[i].RATE) <= 0) {
    //       console.log('Validation Failed on rate');
    //       return false;
    //     }
    //     if (
    //       parseFloat(selectedOrders[i].BALANCE_QUANTITY) <
    //                 parseFloat(selectedOrders[i].QUANTITY) ||
    //             selectedOrders[i].QUANTITY < 0
    //     ) {
    //       console.log('Validation Failed on quantity');
    //       return false;
    //     }
    //     if (compareAsc(selectedOrders[i].DEL_DATE, format(new Date(), 'dd/MMM/yyyy')) < -1) {
    //       console.log('Validation Failed on date');
    //       return false;
    //     }
    //   }

    //   return true;
    // }

    enableUserInput() {
      this.props.dispatch(toggleInputDisabled());
      this.props.dispatch(changeInputFieldHint(UI_MESSAGES.INPUT_HINT));
    }
    disableUserInput() {
      this.props.dispatch(toggleInputDisabled());
      this.props.dispatch(changeInputFieldHint('Select Details Above ...'));
    }
    saveChanges() {
      //   console.log(
      //     this.getOrdersData(
      //       this.props.selectedOrdersId,
      //       this.props.orders,
      //       this.props.savedOrders
      //     )
      //   );
      //   const data = this.getOrdersData(
      //     this.props.selectedOrdersId,
      //     this.props.orders,
      //     this.props.savedOrders
      //   );
      //   console.log('SENDING DATA ........ : ', data);
      //   this.props.dispatch(sendPOData(data));
      //   this.props.dispatch(deletePopupMessage());
      this.props.dispatch(addIndentData());
      this.props.dispatch(sendIndentData());

      console.log('Saving Changes in Dialog');
      this.enableUserInput();
      this.closeDialog();
    }

    handleQantityChange = (event) => {
      this.props.dispatch(changeQuantity(event.target.value));
    };

    handleRateChange = (event) => {
      this.props.dispatch(changeRate(event.target.value));
    };

    getActivityData = async () => {
      const response = await axios.post('http://bluekaktus.ml/proxy/getActivityList', {
        BASICPARAMS: {
          CLIENT_CODE: 'demo',
          APP_VERSION: '1.0'
        }
      });

      await this.sleep(2000);

      const items = response.data.data;
      console.log(response);
      const options = [];
      for (let i = 0; i < items.length; ++i) {
        options.push({
          value: items[i].ACTIVITY_ID,
          label: items[i].ACTIVITY
        });
      }

      console.log(options);

      this.setState({ activitySelector: { loading: false, options } });
    };

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    getSupplierData = async () => {
      await this.sleep(2000);
      const response = await axios.post('http://bluekaktus.ml/proxy/getSupplierList', {
        BASICPARAMS: {
          CLIENT_CODE: 'demo',
          APP_VERSION: '1.0'
        }
      });

        // await this.sleep(2000)

      const items = response.data.data;
      const options = [];
      for (let i = 0; i < items.length; ++i) {
        options.push({
          value: items[i].SUPPLIER_ID,
          label: items[i].SUPPLIER
        });
      }

      this.setState({ supplierSelector: { loading: false, options } });
    };

    componentDidMount() {
      this.getActivityData();
      this.getSupplierData();
    }

    handleActivitySelect = (item, action) => {
      console.log({ item, action });
      if (action.action == 'select-option') {
        console.log('Changing Activity');
        this.props.dispatch(changeActivity({ id: item.value, name: item.label }));
      }
    };

    handleSupplierSelect = (item, action) => {
      console.log({ item, action });
      if (action.action == 'select-option') {
        console.log('Changing supplier');
        this.props.dispatch(changeSupplier({ id: item.value, name: item.label }));
      }
    };

    disableItemSelect = (deliveryData) => {
      if (deliveryData.length > 0) return true;
      else return false;
    };

    render() {
      console.log('***********************', 'in Indent render ');

      if (!this.state.isDialogOpen) {
        this.disableUserInput();
      }

      const isopen = true;
      const isLast = true;
      return (
        <div>
          {isLast && (
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.openDialog()}
              >
                {this.props.message.get('text', 'Popup')}
              </Button>

              <Dialog open={this.state.isDialogOpen} style={{ maxWidth: '1500px' }}>
                <AlertDialog
                  closeAlert={() => this.closeAlert()}
                  showAlert={this.state.showAlert}
                  discardPO={() => this.discardPO()}
                />
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={() => this.handleClose()}
                >
                                Item Detail
                </DialogTitle>
                <DialogContent dividers>
                  <Selector
                    isDisabled={this.disableItemSelect(this.props.deliveryData)}
                  />
                  <TextField
                    type="number"
                    value={this.props.qty}
                    id="outlined-basic"
                    label="Quantity"
                    error={this.props.qty < this.props.qtyAlloted}
                    onChange={this.handleQantityChange}
                    variant="outlined"
                  />
                  <TextField
                    type="number"
                    value={this.props.rate}
                    id="outlined-basic"
                    label="Rate"
                    onChange={this.handleRateChange}
                    variant="outlined"
                  />
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable
                    isLoading={this.state.activitySelector.loading}
                    name="color"
                    onChange={this.handleActivitySelect}
                    placeholder="Select Activity ... "
                    options={this.state.activitySelector.options}
                  />
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable
                    onChange={this.handleSupplierSelect}
                    isLoading={this.state.supplierSelector.loading}
                    placeholder="Select Supplier ... "
                    name="color2"
                    options={this.state.supplierSelector.options}
                  />

                  <IndentDetails />

                  {/* <selectuom />
                                <TextField
                                    id="outlined-basic"
                                    label="Outlined"
                                    variant="outlined"
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Outlined"
                                    variant="outlined"
                                />
                                <select>Supplier</select>
                                <select>Activity</select>

                                <form>
                                    <Date></Date>
                                    <select>delivery location</select>
                                    <button>Add</button>
                                </form>

                                <Table></Table> */}
                </DialogContent>
                {/* <Button variant="contained" color="secondary" onClick={() => this.discardPO()}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={() => this.savePO()}>
                Submit
              </Button> */}
                <DialogActions>
                  <Button
                    disabled={
                      //   !this.isDataValid(
                      //     this.props.selectedOrdersId,
                      //     this.props.orders
                      //   )
                      false
                    }
                    autoFocus
                    onClick={() => {
                      this.saveChanges();
                    }}
                    color="primary"
                  >
                                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </div>
      );
    }
}

const mapStateToProps = state => ({
  qty: state.indents.qty,
  qtyAlloted: state.indents.qtyAlloted,
  rate: state.indents.rate,
  deliveryData: state.indents.deliveryData
});

export default connect(mapStateToProps)(IndentPopup);

// // export default Popup
