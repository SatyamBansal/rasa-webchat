import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import axios from "network";
import UomSelector from "./Components/UomSelector";
import DescriptionIcon from "@material-ui/icons/Description";
import SaveDialogComponent from "../GenericComponents/Dialogs/SaveDialogComponent";
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
} from "actions";

import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Select from "react-select";
// import POTable from './Components/POTable';
import DialogContentText from "@material-ui/core/DialogContentText";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import Selector from "./Components/Selector";
import IndentDetails from "./Components/IndentDetails";

import { Table } from "@material-ui/core";

// import './styles.scss';
// import { compareAsc, format } from 'date-fns';
import { UI_MESSAGES } from "constants";

const colourOptions = [
    { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
    { value: "blue", label: "Blue", color: "#0052CC" },
    { value: "purple", label: "Purple", color: "#5243AA" },
    { value: "red", label: "Red", color: "#FF5630", isFixed: true },
    { value: "orange", label: "Orange", color: "#FF8B00" },
    { value: "yellow", label: "Yellow", color: "#FFC400" },
    { value: "green", label: "Green", color: "#36B37E" },
    { value: "forest", label: "Forest", color: "#00875A" },
    { value: "slate", label: "Slate", color: "#253858" },
    { value: "silver", label: "Silver", color: "#666666" }
];

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
        maxWidth: 720
    },
    numInput: {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "white"
        },
        "& label": {
            color: "grey"
        },
        "& fieldset": {
            borderColor: "#696161"
        }
    }
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
        },
        uomSelector: {
            options: [],
            disabled: true,
            loading: false
        },
        error: false,
        errorMessage: "Error"
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
        this.props.dispatch(sendIndentData());
        console.log("Deleting Indent ");
        this.props.dispatch(deletePopupMessage());
        this.enableUserInput();
        this.setState({ isDialogOpen: false, showAlert: false });
    }

    savePO() {
        this.closeDialog();
    }

    handleClose() {
        this.setState({ showAlert: true });
        console.log("Dialog is Closed");
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

    isDataValid(qty, rate) {
        if (qty <= 0 && qty != "") {
            return false;
        }

        if (rate <= 0 && rate != "") {
            return false;
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

        if (this.props.selectedItem == null) {
            this.setState({ error: true, errorMessage: "Please Select Item" });
            return;
        }

        if (this.props.uom == null) {
            this.setState({ error: true, errorMessage: "Please Select UOM" });
            return;
        }

        if (this.props.qty == "") {
            this.setState({ error: true, errorMessage: "Please Enter Quantity" });
            return;
        }

        if (this.props.rate == "") {
            this.setState({ error: true, errorMessage: "Please Enter Rate" });
            return;
        }

        this.props.dispatch(addIndentData());
        this.props.dispatch(sendIndentData());
        console.log("Deleting Indent ");
        this.props.dispatch(deletePopupMessage());

        console.log("Saving Changes in Dialog");
        this.enableUserInput();
        this.closeDialog();
    }

    handleQantityChange = event => {
        this.props.dispatch(changeQuantity(event.target.value));
    };

    handleRateChange = event => {
        this.props.dispatch(changeRate(event.target.value));
    };

    getActivityData = async () => {
        const { clientCode, companyId, locationId, userId, apiHost } = this.props.user;
        const response = await axios.post(`/api/Chatbot/GetInfo`, {
            basic_Info: {
                client_code: clientCode,
                company_Id: companyId,
                location_Id: locationId,
                user_Id: userId
            },
            api_host: apiHost,
            info_Type: "ACTIVITY_LIST"
        });

        const items = response.data.data;
        console.log(response);
        const options = [];
        for (let i = 0; i < items.length; ++i) {
            options.push({
                value: items[i].Code,
                label: items[i].Value
            });
        }

        console.log(options);

        this.setState({ activitySelector: { loading: false, options } });
    };

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    getSupplierData = async () => {
        const { clientCode, companyId, locationId, userId, apiHost } = this.props.user;
        const response = await axios.post(`/api/Chatbot/GetInfo`, {
            basic_Info: {
                client_code: clientCode,
                company_Id: companyId,
                location_Id: locationId,
                user_Id: userId
            },
            api_host: apiHost,
            info_Type: "PARTY_LIST"
        });

        // await this.sleep(2000)

        const items = response.data.data;
        const options = [];
        for (let i = 0; i < items.length; ++i) {
            options.push({
                value: items[i].Code,
                label: items[i].Value
            });
        }

        this.setState({ supplierSelector: { loading: false, options } });
    };

    getUomData = async itemId => {
        const { clientCode, companyId, locationId, userId, apiHost } = this.props.user;
        // this.setState({ uomSelector: { disabled: false, loading: true, options: [] } });
        await this.sleep(2000);
        const response = await axios.post(`/api/Chatbot/GetInfo`, {
            basic_info: {
                client_code: clientCode,
                company_id: companyId,
                location_id: locationId,
                user_id: userId
            },
            info_type: "UOM_LIST",
            api_host: apiHost,
            raw_data: {
                input_type_code: itemId // item_id
            }
        });

        // await this.sleep(2000)

        const items = response.data.data;
        const options = [];
        for (let i = 0; i < items.length; ++i) {
            options.push({
                value: items[i].Code,
                label: items[i].Value
            });
        }

        this.setState({ uomSelector: { disabled: false, loading: false, options } });
    };

    componentDidMount() {
        this.getActivityData();
        this.getSupplierData();
    }

    handleActivitySelect = (item, action) => {
        console.log({ item, action });
        if (action.action == "select-option") {
            console.log("Changing Activity");
            this.props.dispatch(changeActivity({ id: item.value, name: item.label }));
        }
    };

    handleSupplierSelect = (item, action) => {
        console.log({ item, action });
        if (action.action == "select-option") {
            console.log("Changing supplier");
            this.props.dispatch(changeSupplier({ id: item.value, name: item.label }));
        }
    };

    handleUomSelect = (item, action) => {
        // console.log({ item, action });
        // if (action.action == "select-option") {
        //     console.log("Changing supplier");
        //     this.props.dispatch(changeSupplier({ id: item.value, name: item.label }));
        // }
    };

    disableItemSelect = deliveryData => {
        if (deliveryData.length > 0) return true;
        return false;
    };

    enableUomSelector = item => {
        console.log(`checking uom selector with item : ${item}`);
        if (item) {
            this.getUomData(item.value);
        }
    };

    showQuantityError = qty => {
        if (qty == "") {
            return false;
        }

        if (parseFloat(qty) <= 0) {
            return true;
        }

        return false;
    };

    handleSnackBarClose = (event, reason) => {
        // if (reason === "clickaway") {
        //     return;
        // }

        this.setState({ error: false });
    };

    handleAlertAffirmClick = () => {
        console.log("Alert Affirm Clicked");
    };

    handleAlertDenyClick = () => {
        console.log("Alert Deny Clicked");
    };

    render() {
        // this.enableUomSelector(this.props.selectedItem);
        console.log("***********************", "in Indent render ", this.props.classes);
        console.log("Current Message Object : ", this.props.message);

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
                            startIcon={<DescriptionIcon />}
                            onClick={() => this.openDialog()}
                        >
                            {this.props.message.get("text", "Popup")
                                ? this.props.message.get("text", "Popup")
                                : "Popup"}
                        </Button>

                        <SaveDialogComponent
                            showDialog={this.state.isDialogOpen}
                            showAlertDialog={this.state.showAlert}
                            title="Item Detail"
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
                            saveButtonText="Submit"
                            classes={{
                                paper: this.props.classes.dialogStyles
                            }}
                        >
                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={12}>
                                    <Selector
                                        isDisabled={this.disableItemSelect(this.props.deliveryData)}
                                    />
                                </Grid>
                                <Grid item container spacing={2} mb={2}>
                                    <Grid item xs={6}>
                                        <UomSelector />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            disabled={this.disableItemSelect(
                                                this.props.deliveryData
                                            )}
                                            size="small"
                                            type="number"
                                            value={this.props.qty}
                                            id="outlined-basic"
                                            label={
                                                this.showQuantityError(this.props.qty)
                                                    ? "cannot be zero"
                                                    : "Quantity"
                                            }
                                            error={this.showQuantityError(this.props.qty)}
                                            onChange={this.handleQantityChange}
                                            variant="outlined"
                                            classes={{
                                                root: this.props.classes.numInput
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={this.props.rate}
                                            id="outlined-basic"
                                            error={this.showQuantityError(this.props.rate)}
                                            label={
                                                this.showQuantityError(this.props.rate)
                                                    ? "cannot be zero"
                                                    : "Rate"
                                            }
                                            onChange={this.handleRateChange}
                                            variant="outlined"
                                            classes={{
                                                root: this.props.classes.numInput
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2} m={2}>
                                    <Grid item xs={6}>
                                        <Select
                                            style={{ border: "1px solid red" }}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isSearchable
                                            isLoading={this.state.activitySelector.loading}
                                            name="color"
                                            onChange={this.handleActivitySelect}
                                            placeholder="Activity"
                                            options={this.state.activitySelector.options}
                                            styles={{
                                                menu: styles => ({ ...styles, zIndex: 2000 }),
                                                menuList: styles => ({
                                                    ...styles,
                                                    fontFamily: "Roboto"
                                                }),
                                                control: styles => ({
                                                    ...styles,
                                                    fontFamily: "Roboto"
                                                })
                                            }}
                                            theme={theme => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    neutral30: "black",
                                                    neutral20: "#696161",
                                                    neutral50: "grey",
                                                    primary: "#574ae2"
                                                }
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isSearchable
                                            onChange={this.handleSupplierSelect}
                                            isLoading={this.state.supplierSelector.loading}
                                            placeholder="Supplier"
                                            name="color2"
                                            styles={{
                                                menu: styles => ({ ...styles, zIndex: 2000 }),
                                                menuList: styles => ({
                                                    ...styles,
                                                    fontFamily: "Roboto"
                                                }),
                                                control: styles => ({
                                                    ...styles,
                                                    fontFamily: "Roboto"
                                                })
                                            }}
                                            theme={theme => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    neutral30: "black",
                                                    neutral20: "#696161",
                                                    neutral50: "grey",
                                                    primary: "#574ae2"
                                                }
                                            })}
                                            options={this.state.supplierSelector.options}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <IndentDetails />
                            <Snackbar
                                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                                open={this.state.error}
                                autoHideDuration={6000}
                                onClose={this.handleSnackBarClose}
                            >
                                <Alert onClose={this.handleSnackBarClose} severity="error">
                                    {this.state.errorMessage}
                                </Alert>
                            </Snackbar>
                        </SaveDialogComponent>
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
    deliveryData: state.indents.deliveryData,
    selectedItem: state.indents.item,
    uom: state.indents.uom,
    user: state.userData
});

export default connect(mapStateToProps)(withStyles(styles)(IndentPopup));

// // export default Popup
