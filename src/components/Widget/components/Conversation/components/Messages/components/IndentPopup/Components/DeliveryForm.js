import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { useDispatch, useSelector } from 'react-redux';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Select from 'react-select';
import { addDeliveryData } from 'actions';

const currentDate = () => moment();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const DeliveryForm = (props) => {
  // Component States
  const [date, setDate] = useState(currentDate());
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();

  userData.set('userId', '2');
  console.log(`${userData} : user id : ${userData.get('userId')}`);

  useEffect(() => {
    const populateLocationSelector = async () => {
      const { clientCode, companyId, locationId, userId } = userData.toJS();
      console.log({ clientCode, companyId, locationId, userId });
      console.log('Fetching location DAta');
      const response = await axios.post('http://192.168.1.33:81/api/Chatbot/GetInfo', {
        basic_Info: {
          client_code: clientCode,
          company_Id: companyId,
          location_Id: locationId,
          user_Id: userId
        },
        info_Type: 'LOCATION_LIST'
      });

      // await sleep(5000);
      console.log({ response });
      const items = response.data.data;
      const optionsNew = [];
      for (let i = 0; i < items.length; ++i) {
        optionsNew.push({
          value: items[i].Code,
          label: items[i].Value
        });
      }

      // this.setState({ deliverySelector: { loading: false, options } });
      setOptions(optionsNew);
      setLoading(false);
    };
    populateLocationSelector();
  }, []);

  const handleDateChange = (date) => {
    console.log('Handling Date Change');
    console.log(date.format('DD/MMM/YYYY'));
    setDate(date);
  };

  const handleQuantityChange = (event) => {
    const { value } = event.target;
    console.log('Handling quantity change', typeof value);
    setQuantity(value);
  };

  const handleLocationSelect = (item, action) => {
    console.log({ item, action });

    // this.setState(prevState => ({
    //   tableForm: {
    //     ...prevState.tableForm,
    //     location: item
    //   }
    // }));

    setLocation(item);
  };

  const submitDeliveryData = () => {
    dispatch(addDeliveryData(moment().unix(), date.format('DD/MMM/YYYY'), quantity, location));
    // this.setState({
    //   tableForm: {
    //     date: moment().format('DD/MMM/YYYY'),
    //     qty: '',
    //     location: null
    //   }
    // });
    setDate(currentDate());
    setQuantity('');
    setLocation(null);
  };

  const isDataValid = (qty, selectedLocation) => {
    if (qty == '') {
      return false;
    }
    if (selectedLocation === null) {
      return false;
    }

    return true;
  };

  return (
    <Box>
      <Box mb={1} mt={1}>
        <Typography color="textPrimary">Add Delivery Data</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isSearchable
            value={location}
            isLoading={loading}
            name="color"
            onChange={handleLocationSelect}
            placeholder="Location"
            options={options}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            size="small"
            type="number"
            value={quantity}
            id="outlined-basic"
            label={quantity > props.maxQty ? 'Error' : 'Quantity'}
            onChange={handleQuantityChange}
            variant="outlined"
            error={quantity > props.maxQty}
          />
        </Grid>
        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              size="small"
              label="Delivery"
              format="DD/MMM/YYYY"
              value={date}
              // defaultValue={moment().toDate()}
              inputVariant="outlined"
              // value={selectedDate}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth="true"
            disabled={!isDataValid(quantity, location)}
            onClick={submitDeliveryData}
          >
                        ADD
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryForm;
