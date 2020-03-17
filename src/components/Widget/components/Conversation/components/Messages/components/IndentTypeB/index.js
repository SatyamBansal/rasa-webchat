import React, { Component } from "react";
import { connect } from "react-redux";
import {
    toggleInputDisabled,
    changeInputFieldHint,
    sendAgainstSampleIndentData,
    deletePopupMessage,
    cancelPO,
    updatePOAmount,
    hideComponent
} from "actions";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import POTable from "./Components/POTable";
import DialogContentText from "@material-ui/core/DialogContentText";
import "./styles.scss";
import { compareAsc, format } from "date-fns";
import { UI_MESSAGES } from "../../../../../../../../constants";
import SaveDialogComponent from "../GenericComponents/Dialogs/SaveDialogComponent";
import DescriptionIcon from "@material-ui/icons/Description";

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    dialogStyles: {
        width: "90%",
        maxWidth: 1500
    }
});

const AlertDialog = props => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        // setOpen(true);
    };

    const handlePositive = () => {
        // setOpen(false);

        props.discardPO();
    };

    const handleNegative = () => {
        console.log("Closing Alert Dialog ");

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

const DialogTitle = withStyles(styles)(props => {
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

class IndentTypeB extends Component {
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
        // this.props.dispatch(deletePopupMessage());
        // this.props.dispatch(cancelPO());
        // this.enableUserInput();
        // this.setState({ isDialogOpen: false, showAlert: false });

        this.props.dispatch(sendAgainstSampleIndentData(this.props.savedOrders));
        this.props.dispatch(hideComponent("againstSampleIndentPopup"));
        this.props.dispatch(deletePopupMessage());
        console.log("Discarding Changes in Dialog");
        this.enableUserInput();
        this.closeDialog();
    }

    savePO() {
        this.closeDialog();
    }

    handleClose() {
        this.setState({ showAlert: true });
        console.log("Dialog is Closed");
    }

    filterOrdersData(orderids = [], orders) {
        console.log("IDS : ", orderids);
        console.log("Orders : ", orders);
        return orders.filter(order => orderids.includes(order.PD_ITEM_DT_ID));
    }

    getOrdersData(selectedOrderids = [], orders, savedOrders) {
        console.log("DEbug", { selectedOrderids, orders, savedOrders });
        // console.log('Filtered Selected Records', this.filterOrdersData(selectedOrderids, orders));
        const exclusiveSavedIds = [];

        const savedIds = savedOrders.map(order => order.PD_ITEM_DT_ID);

        const orderIds = orders.map(order => order.PD_ITEM_DT_ID);
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
        console.log("Exclusive ids :", exclusiveSavedIds);
        console.log(
            "saved exclusive data : ",
            this.filterOrdersData(exclusiveSavedIds, savedOrders)
        );
        console.log("selected record data : ", this.filterOrdersData(selectedOrderids, orders));
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

        if (selectedOrders.length <= 0) {
            return false;
        }

        console.log("Checking DAta Valadity for orders : ", selectedOrders);
        // return selectedOrders.length > 2;
        for (let i = 0; i < selectedOrders.length; ++i) {
            if (selectedOrders[i].QUANTITY <= 0) {
                return false;
            }
        }

        return true;
    }

    enableUserInput() {
        this.props.dispatch(toggleInputDisabled());
        this.props.dispatch(changeInputFieldHint(UI_MESSAGES.INPUT_HINT));
    }
    disableUserInput() {
        this.props.dispatch(toggleInputDisabled());
        this.props.dispatch(changeInputFieldHint("Select Details Above ..."));
    }

    getTotalPOAmount(data) {
        let totalAmount = 0;

        for (let i = 0; i < data.length; i++) {
            totalAmount += parseFloat(data[i].QUANTITY) * parseFloat(data[i].RATE);
        }

        return totalAmount;
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
        console.log("SENDING DATA ........ : ", data);
        // console.log("Total PO AMOUNT : ", this.getTotalPOAmount(data));
        this.props.dispatch(sendAgainstSampleIndentData(data));
        this.props.dispatch(hideComponent("againstSampleIndentPopup"));

        // this.props.dispatch(updatePOAmount(this.getTotalPOAmount(data)));
        this.props.dispatch(deletePopupMessage());
        console.log("Saving Changes in Dialog");
        this.enableUserInput();
        this.closeDialog();
    }
    render() {
        if (!this.state.isDialogOpen && !this.props.messageObj.get("isAbortTriggered")) {
            this.disableUserInput();
        }
        console.log("Message Object Recieved : ", this.props.messageObj);
        console.log("***********************", this.props.message.get("text"));
        const isopen = true;
        const isLast = true;
        return (
            <div>
                {isLast && (
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DescriptionIcon />}
                            style={{ marginTop: "8px" }}
                            disabled={this.props.messageObj.get("isAbortTriggered")}
                            onClick={() => this.openDialog()}
                        >
                            ITEM DETAILS
                        </Button>

                        <SaveDialogComponent
                            showDialog={this.state.isDialogOpen}
                            showAlertDialog={this.state.showAlert}
                            title={`Fill Indent Details`}
                            onAlertAffirmClick={() => {
                                this.discardPO();
                            }}
                            onAlertDenyClick={this.handleAlertAffirmClick}
                            // alertDenyText: PropTypes.string,
                            // alertAffirmText: PropTypes.string,
                            // alertDialogTitle: PropTypes.string,
                            // alertContentText: PropTypes.string,
                            // onSaveButtonClick: PropTypes.func,
                            onSaveButtonClick={() => {
                                this.saveChanges();
                            }}
                            saveButtonText={this.props.selectedOrdersId.length ? "Change" : "Save"}
                            classes={{
                                paper: this.props.classes.dialogStyles
                            }}
                            disableSaveButton={
                                !this.isDataValid(this.props.selectedOrdersId, this.props.orders)
                            }
                        >
                            <POTable />
                        </SaveDialogComponent>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    orders: state.indentsTypeB.indents,
    selectedOrdersId: state.indentsTypeB.selectedIndents,
    savedOrders: state.indentsTypeB.savedIndents
});

export default connect(mapStateToProps)(withStyles(styles)(IndentTypeB));
