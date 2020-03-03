// import React, { Component } from 'react';
// import { connect } from 'react-redux';

// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import Checkbox from '@material-ui/core/Checkbox';

// class POTable extends Component {

//   render() {

//     const rows = this.props.data;

//     return (
//       <TableContainer component={Paper}>
//         <Table aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <Checkbox
//                   inputProps={{ 'aria-label': 'select all desserts' }}
//                 />
//               </TableCell>
//               <TableCell>Buyer Name</TableCell>
//               <TableCell align="right">Product</TableCell>
//               <TableCell align="right">Qty</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map(row => (

//               <TableRow key={row['Buyer Name']}>
//                 <TableCell>
//                   <Checkbox
//                     inputProps={{ 'aria-label': 'select all desserts' }}
//                   />
//                 </TableCell>
//                 <TableCell component="th" scope="row">
//                   {row['Buyer Name']}
//                 </TableCell>
//                 <TableCell align="right">{row.Product}</TableCell>
//                 <TableCell align="right">{row.Qty}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   data: state.purchaseOrders.orders
// });

// export default connect(mapStateToProps)(POTable);

// // import React from 'react';

// // const useStyles = makeStyles({
// //   table: {
// //     minWidth: 650,
// //   },
// // });

// // function createData(name, calories, fat, carbs, protein) {
// //   return { name, calories, fat, carbs, protein };
// // }

// // const rows = [
// //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
// //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
// //   createData('Eclair', 262, 16.0, 24, 6.0),
// //   createData('Cupcake', 305, 3.7, 67, 4.3),
// //   createData('Gingerbread', 356, 16.0, 49, 3.9),
// // ];

// // export default function SimpleTable() {
// //   const classes = useStyles();

// //   return (

// //   );
// // }

// //////////////////////////////////////////////////////
// //////////////////////////////////////////////////////

import {
    modifyPurchaseOrder,
    selectIndents,
    modifyIndent,
    changeIndentActivity,
    changeIndentSupplier
} from "actions";
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from "axios";

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);
// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
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

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
    { id: "ITEM_NAME", numeric: false, disablePadding: true, label: "Item" },
    { id: "UOM_CODE", numeric: false, disablePadding: false, label: "UOM" },
    { id: "AVERAGE", numeric: true, disablePadding: false, label: "Average" },
    { id: "QUANTITY", numeric: true, disablePadding: false, label: "Quantity" },
    { id: "RATE", numeric: true, disablePadding: false, label: "Price" },
    { id: "ACTIVITY", numeric: true, disablePadding: false, label: "Activity" },
    { id: "SUPPLIER", numeric: true, disablePadding: false, label: "Supplier" }
];

function EnhancedTableHead(props) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort
    } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ "aria-label": "select all desserts" }}
                    />
                </StyledTableCell>
                {headCells.map(headCell => (
                    <StyledTableCell
                        key={headCell.id}
                        // align={headCell.numeric ? "right" : "left"}
                        align="center"
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === "light"
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85)
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark
              },
    title: {
        flex: "1 1 100%"
    }
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle">
                    Orders
                </Typography>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1
    }
}));

export default function EnhancedTable() {
    const rows = useSelector(state => state.indentsTypeB.indents);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [activities, setActivities] = React.useState([]);
    const [suppliers, setSuppliers] = React.useState([]);
    const [age, setAge] = React.useState("");
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState(
        useSelector(state => state.purchaseOrders.selectedOrders)
    );
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        const getActivityData = async () => {
            const response = await axios.post("http://bluekaktus.ml/proxy/GetInfo", {
                basic_Info: {
                    client_code: "akri48",
                    company_Id: 4,
                    location_Id: 6,
                    user_Id: 1
                },
                info_Type: "ACTIVITY_LIST"
            });

            // await this.sleep(2000);

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
            setActivities(options);
        };

        getActivityData();
    }, []);

    React.useEffect(() => {
        const getSupplierData = async () => {
            const response = await axios.post("http://bluekaktus.ml/proxy/GetInfo", {
                basic_Info: {
                    client_code: "akri48",
                    company_Id: 4,
                    location_Id: 6,
                    user_Id: 1
                },
                info_Type: "MERCHANT_LIST"
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

            setSuppliers(options);
        };

        getSupplierData();
    }, []);

    // useEffect(() => {
    //   const populateLocationSelector = async () => {
    //     const { clientCode, companyId, locationId, userId } = userData.toJS();
    //     console.log({ clientCode, companyId, locationId, userId });
    //     console.log('Fetching location DAta');
    //     const response = await axios.post('http://192.168.1.33:81/api/Chatbot/GetInfo', {
    //       basic_Info: {
    //         client_code: clientCode,
    //         company_Id: companyId,
    //         location_Id: locationId,
    //         user_Id: userId
    //       },
    //       info_Type: 'LOCATION_LIST'
    //     });

    //     // await sleep(5000);
    //     console.log({ response });
    //     const items = response.data.data;
    //     const optionsNew = [];
    //     for (let i = 0; i < items.length; ++i) {
    //       optionsNew.push({
    //         value: items[i].Code,
    //         label: items[i].Value
    //       });
    //     }

    //     // this.setState({ deliverySelector: { loading: false, options } });
    //     setOptions(optionsNew);
    //     setLoading(false);
    //   };
    //   populateLocationSelector();
    // }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChange = event => {
        setAge(event.target.value);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.PD_ITEM_DT_ID);
            dispatch(selectIndents(newSelecteds));
            console.log("Selected Elements", newSelecteds);
            setSelected(newSelecteds);
            return;
        }
        dispatch(selectIndents([]));
        console.log("Selected Elements", []);
        setSelected([]);
    };

    // Todo : Dirty Patch for stopping event propogation , fix ASAP
    const handleClick = (event, name) => {
        let isInputElement = false;
        // console.log('Cusom filed : ', event.target.nodeName);
        // console.log('Element Clicked', event.target.type, typeof (event.target.type));
        console.log(event.target);
        if (
            event.target.type == "text" ||
            event.target.type == "number" ||
            event.target.type == "checkbox"
        ) {
            isInputElement = true;
            // console.log('An INput is clicked....');
            // console.log(selected, '______', name);
            if (selected.indexOf(name) >= 0 && event.target.type != "checkbox") {
                // console.log('Stopping from unselecting value .....');
                return;
            }
        }

        if (!(event.target.nodeName == "TD" || event.target.nodeName == "TH" || isInputElement)) {
            // console.log('NOt a table element');
            return;
        }
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
        dispatch(selectIndents(newSelected));
        console.log("Selected Elements", newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const handleSupplierChange = (id, value) => {
        console.log("changing supplier ", { id, value });
        dispatch(changeIndentSupplier(id, value));
    };

    const handleActivityChange = (id, value) => {
        console.log("changing activity ", { id, value });
        dispatch(changeIndentActivity(id, value));
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const inputChanged = (e, id, key) => {
        const value = e.target.value;

        // if (e.target.value == "") {
        //     e.target.error = true;
        //     console.log("Empty field setting to zero");
        //     value = 0;
        // }
        dispatch(modifyIndent(id, key, value));
        console.log("Row ID : ", id);
        console.log("Input Changed : ", e.target.value);
    };

    const dateChanged = (value, id, key) => {
        console.log(format(value, "dd/MMM/yyyy"));
        dispatch(modifyPurchaseOrder(id, key, format(value, "dd/MMM/yyyy")));
    };

    const showQuantityError = (isSelected, balance, quantity, id) => {
        // console.log('Select Status for id ', id, ' ', isSelected);
        // console.log('rowid : ', row.PD_ITEM_DT_ID, ' : ', typeof (parseFloat(quantity)), ' : ', (parseFloat(row.RATE)));
        if (isSelected) {
            if (parseFloat(balance) < parseFloat(quantity) || parseFloat(quantity) < 0) {
                return true;
            }
        }
        return false;
    };

    const showRateError = (isItemSelected, rate) => {
        // console.log('rowid : ', row.PD_ITEM_DT_ID, ' : ', typeof (parseFloat(row.RATE)), ' : ', (parseFloat(row.RATE)));
        if (isItemSelected) {
            if (parseFloat(rate) <= 0) {
                return true;
            }
        }
        return false;
    };

    const getSelectedLength = () => {
        const recordIds = rows.map(record => record.PD_ITEM_DT_ID);
        return selected.filter(value => recordIds.includes(value)).length;
    };
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={getSelectedLength()} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={getSelectedLength()}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.PD_ITEM_DT_ID);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            // onClick={event => handleClick(event, row.PD_ITEM_DT_ID)}
                                            tabIndex={-1}
                                            key={row.PD_ITEM_DT_ID}
                                            selected={isItemSelected}
                                        >
                                            <TableCell
                                                padding="checkbox"
                                                align="center"
                                                style={{ width: "5%" }}
                                            >
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    onClick={event =>
                                                        handleClick(
                                                            event,
                                                            row.PD_ITEM_DT_ID,
                                                            isItemSelected
                                                        )
                                                    }
                                                    inputProps={{ "aria-labelledby": labelId }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                align="left"
                                                style={{ width: "20%" }}
                                            >
                                                {row.ITEM_NAME}
                                            </TableCell>
                                            <TableCell align="left" style={{ width: "10%" }}>
                                                {row.UOM_CODE}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                align="center"
                                                style={{ width: "10%" }}
                                            >
                                                {row.AVERAGE}
                                            </TableCell>

                                            <TableCell
                                                align="right"
                                                align="center"
                                                style={{ width: "15%" }}
                                            >
                                                <TextField
                                                    custom="valid"
                                                    variant="outlined"
                                                    type="number"
                                                    error={isItemSelected && row.QUANTITY <= 0}
                                                    value={row.QUANTITY}
                                                    onChange={e => {
                                                        inputChanged(
                                                            e,
                                                            row.PD_ITEM_DT_ID,
                                                            "QUANTITY"
                                                        );
                                                    }}
                                                    inputProps={{ "aria-label": "quantity" }}
                                                />
                                            </TableCell>
                                            <TableCell align="center" style={{ width: "10%" }}>
                                                {row.RATE}
                                            </TableCell>
                                            <TableCell align="center" style={{ width: "15%" }}>
                                                <FormControl
                                                    variant="outlined"
                                                    className={classes.formControl}
                                                    style={{ width: "100%" }}
                                                >
                                                    <Select
                                                        autoWidth={false}
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        value={row.ACTIVITY}
                                                        displayEmpty
                                                        onChange={event => {
                                                            handleActivityChange(
                                                                row.PD_ITEM_DT_ID,
                                                                event.target.value
                                                            );
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>

                                                        {activities.map(item => (
                                                            <MenuItem value={item.value}>
                                                                <em>{item.label}</em>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>

                                            <TableCell align="center" style={{ width: "25%" }}>
                                                <FormControl
                                                    variant="outlined"
                                                    className={classes.formControl}
                                                    style={{ width: "100%" }}
                                                >
                                                    <Select
                                                        displayEmpty
                                                        autoWidth={false}
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        value={row.SUPPLIER}
                                                        onChange={event => {
                                                            handleSupplierChange(
                                                                row.PD_ITEM_DT_ID,
                                                                event.target.value
                                                            );
                                                        }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        {suppliers.map(item => (
                                                            <MenuItem value={item.value}>
                                                                <em>{item.label}</em>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>

                                            {/* <TableCell align="right">
                        <TextField
                          custom="valid"
                          variant="outlined"
                          label={
                            showQuantityError(
                              isItemSelected,
                              row.BALANCE_QUANTITY,
                              row.QUANTITY,
                              row.PD_ITEM_DT_ID
                            ) &&
                                                        (row.QUANTITY < 0
                                                          ? 'cannot be negative'
                                                          : 'greater than Balance')
                          }
                          error={showQuantityError(
                            isItemSelected,
                            row.BALANCE_QUANTITY,
                            row.QUANTITY,
                            row.PD_ITEM_DT_ID
                          )}
                          type="number"
                          defaultValue={row.QUANTITY}
                          onChange={(e) => {
                            inputChanged(
                              e,
                              row.PD_ITEM_DT_ID,
                              'QUANTITY'
                            );
                          }}
                          inputProps={{ 'aria-label': 'quantity' }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <TextField
                          variant="outlined"
                          type="number"
                          defaultValue={row.RATE}
                          onChange={(e) => {
                            inputChanged(e, row.PD_ITEM_DT_ID, 'RATE');
                          }}
                          error={showRateError(isItemSelected, row.RATE)}
                          label={
                            showRateError(isItemSelected, row.RATE) &&
                                                        (row.RATE < 0
                                                          ? 'cannot be negative'
                                                          : 'rate cannot be zero')
                          }
                          inputProps={{ 'aria-label': 'rate' }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        {row.HSN_CODE__TEXT}
                      </TableCell>
                      <TableCell>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            format="dd/MMM/yyyy"
                            minDateMessage="shoud be greater than current date"
                            minDate={
                              isItemSelected
                                ? format(new Date(), 'dd/MMM/yyyy')
                                : '01/JAN/1970'
                            }
                            disablePast={isItemSelected}
                            onChange={(date) => {
                              dateChanged(
                                date,
                                row.PD_ITEM_DT_ID,
                                'DEL_DATE'
                              );
                            }}
                            value={
                              row.DEL_DATE == 'null'
                                ? format(new Date(), 'dd/MMM/yyyy')
                                : row.DEL_DATE
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </TableCell> */}
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
