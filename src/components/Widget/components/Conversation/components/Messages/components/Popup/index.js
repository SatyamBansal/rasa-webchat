import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleInputDisabled,
  changeInputFieldHint,
  sendPOData,
  deletePopupMessage,
  cancelPO
} from 'actions';

import { withStyles } from '@material-ui/core/styles';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import POTable from './Components/POTable';
import DialogContentText from '@material-ui/core/DialogContentText';
import './styles.scss';
import { compareAsc, format } from 'date-fns';

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
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
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

class Popup extends Component {
    state = {
      isDialogOpen: false,
      isDirty: false,
      showAlert: false,
      isDataValid: false
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

    filterOrdersData(orderids = [], orders) {
      console.log('IDS : ', orderids);
      console.log('Orders : ', orders);
      return orders.filter(order => orderids.includes(order.INDENT_DT_ID));
    }

    getOrdersData(selectedOrderids = [], orders, savedOrders) {
      console.log('DEbug', { selectedOrderids, orders, savedOrders });
      // console.log('Filtered Selected Records', this.filterOrdersData(selectedOrderids, orders));
      const exclusiveSavedIds = [];

      const savedIds = savedOrders.map(order => order.INDENT_DT_ID);

      const orderIds = orders.map(order => order.INDENT_DT_ID);
      for (let i = 0; i < savedIds.length; ++i) {
        if (!orderIds.includes(savedIds[i])) {
          exclusiveSavedIds.push(savedIds[i]);
        }
        // else{

        //   //add in exclusive
        // }
        // if (selectedOrderids.includes(savedIds[i]) || orderIds.includes(savedIds[i])) {
        //   continue;
        // } else {

        // }
      }
      console.log('Exclusive ids :', exclusiveSavedIds);
      console.log(
        'saved exclusive data : ',
        this.filterOrdersData(exclusiveSavedIds, savedOrders)
      );
      console.log('selected record data : ', this.filterOrdersData(selectedOrderids, orders));
      const newSavedOrders = [];
      newSavedOrders.concat(this.filterOrdersData(exclusiveSavedIds, savedOrders));
      newSavedOrders.concat(this.filterOrdersData(selectedOrderids, orders));
      return [
        ...this.filterOrdersData(exclusiveSavedIds, savedOrders),
        ...this.filterOrdersData(selectedOrderids, orders)
      ];
    }

    isDataValid(ids, orders) {
      const selectedOrders = this.filterOrdersData(ids, orders);
      console.log('Checking DAta Valadity for orders : ', selectedOrders);
      // return selectedOrders.length > 2;
      for (let i = 0; i < selectedOrders.length; ++i) {
        if (parseFloat(selectedOrders[i].RATE) <= 0) {
          console.log('Validation Failed on rate');
          return false;
        }
        if (
          parseFloat(selectedOrders[i].BALANCE_QUANTITY) <
                    parseFloat(selectedOrders[i].QUANTITY) ||
                selectedOrders[i].QUANTITY < 0
        ) {
          console.log('Validation Failed on quantity');
          return false;
        }
        if (compareAsc(selectedOrders[i].DEL_DATE, format(new Date(), 'dd/MMM/yyyy')) < -1) {
          console.log('Validation Failed on date');
          return false;
        }
      }

      return true;
    }

    enableUserInput() {
      this.props.dispatch(toggleInputDisabled());
      this.props.dispatch(changeInputFieldHint('Enter Message ...'));
    }
    disableUserInput() {
      this.props.dispatch(toggleInputDisabled());
      this.props.dispatch(changeInputFieldHint('Select Details Above ...'));
    }
    saveChanges() {
      console.log(
        this.getOrdersData(
          this.props.selectedOrdersId,
          this.props.orders,
          this.props.savedOrders
        )
      );
      const data = this.getOrdersData(
        this.props.selectedOrdersId,
        this.props.orders,
        this.props.savedOrders
      );
      console.log('SENDING DATA ........ : ', data);
      this.props.dispatch(sendPOData(data));
      this.props.dispatch(deletePopupMessage());
      console.log('Saving Changes in Dialog');
      this.enableUserInput();
      this.closeDialog();
    }
    render() {
      if (!this.state.isDialogOpen) {
        this.disableUserInput();
      }

      console.log('***********************', this.props.message.get('text'));
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
                {this.props.message.get('text', 'Fill PO')}
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
                                Fill PO Details
                </DialogTitle>
                <DialogContent dividers>
                  <POTable />
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
                      !this.isDataValid(
                        this.props.selectedOrdersId,
                        this.props.orders
                      )
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
  orders: state.purchaseOrders.orders,
  selectedOrdersId: state.purchaseOrders.selectedOrders,
  savedOrders: state.purchaseOrders.savedOrders
});

export default connect(mapStateToProps)(Popup);
