import React from "react";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Box from "@material-ui/core/Box";

import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Select from "react-select";
import axios from "network";
import Button from "@material-ui/core/Button";
import DeliveryTable from "./DeliveryTable";

import { connect } from "react-redux";

// pick a date util library
import MomentUtils from "@date-io/moment";
import { addDeliveryData } from "actions";
import DeliveryForm from "./DeliveryForm";

class IndentDetails extends React.Component {
    state = {
        deliverySelector: {
            options: [],
            loading: true
        },
        tableForm: {
            date: moment().format("DD/MMM/YYYY"),
            qty: "",
            location: null
        }
    };

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    getDeliveryLocationData = async () => {
        const { clientCode, companyId, locationId, userId, apiHost } = this.props.user;
        const response = await axios.post(`/api/Chatbot/GetInfo`, {
            basic_Info: {
                client_code: clientCode,
                company_Id: companyId,
                location_Id: locationId,
                user_Id: userId
            },
            api_host: apiHost,
            info_Type: "LOCATION_LIST"
        });

        // await this.sleep(2000)

        const items = response.data.data;
        const options = [];
        for (let i = 0; i < items.length; ++i) {
            options.push({
                value: items[i].DELIVERY_LOCATION_ID,
                label: items[i].DELIVERY_LOCATION
            });
        }

        this.setState({ deliverySelector: { loading: false, options } });
    };

    componentDidMount() {
        this.getDeliveryLocationData();
    }

    handleLocationSelect = (item, action) => {
        console.log({ item, action });

        this.setState(prevState => ({
            tableForm: {
                ...prevState.tableForm,
                location: item
            }
        }));
    };

    handleQuantityChange = event => {
        const value = event.target.value;
        console.log(value);
        this.setState(prevState => ({
            tableForm: {
                ...prevState.tableForm,
                qty: value
            }
        }));
    };
    submitDeliveryData = () => {
        const { date, qty, location } = this.state.tableForm;
        this.props.dispatch(addDeliveryData(moment().unix(), date, qty, location));
        this.setState({
            tableForm: {
                date: moment().format("DD/MMM/YYYY"),
                qty: "",
                location: null
            }
        });
    };
    handleDateChange = date => {
        this.setState(prevState => ({
            tableForm: {
                ...prevState.tableForm,
                date: date.format("DD/MMM/YYYY")
            }
        }));
    };

    render() {
        return (
            <div>
                {/* <hr />
          <hr />

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              label="Delivery"
              format="DD/MM/YYYY"
              value={this.state.tableForm.date}
              // defaultValue={moment().toDate()}
              inputVariant="outlined"
              // value={selectedDate}
              onChange={this.handleDateChange}
            />
          </MuiPickersUtilsProvider>
          <TextField
            type="number"
            value={this.state.tableForm.qty}
            id="outlined-basic"
            label={this.state.tableForm.qty > this.props.maxQty ? 'Error' : 'Quantity'}
            onChange={this.handleQuantityChange}
            variant="outlined"
            error={this.state.tableForm.qty > this.props.maxQty}
          />

          <Select
            className="basic-single"
            classNamePrefix="select"
            isSearchable
            value={this.state.tableForm.location}
            isLoading={this.state.deliverySelector.loading}
            name="color"
            onChange={this.handleLocationSelect}
            placeholder="Select Location ... "
            options={this.state.deliverySelector.options}
          />

          <Button variant="contained" color="primary" onClick={this.submitDeliveryData}>
                    ADD
          </Button>

          <hr /> */}
                <DeliveryForm />
                <Box mt={2}>
                    <DeliveryTable />
                </Box>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    maxQty: state.indents.qty,
    rate: state.indents.rate,
    user: state.userData
});

export default connect(mapStateToProps)(IndentDetails);
