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

import { modifyPurchaseOrder, selectPOChanges } from "actions";
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

const StyledTableCell = withStyles(theme => ({
    head: {
        // backgroundColor: "#7065E6",
        backgroundColor: theme.palette.primary.light,
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
    { id: "label", numeric: false, disablePadding: true, label: "label" },
    { id: "value", numeric: true, disablePadding: false, label: "value" }
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
                <StyledTableCell padding="checkbox" />
                {headCells.map(headCell => (
                    <StyledTableCell
                        key={headCell.id}
                        align="center"
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
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
                    Select Values to Change
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
        minWidth: 480
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
    const rows = useSelector(state => state.poConfirmation.confirmationData);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState(
        useSelector(state => state.poConfirmation.selectedData)
    );
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        return;
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.id);
            dispatch(selectPurchaseOrders(newSelecteds));
            console.log("Selected Elements", newSelecteds);
            setSelected(newSelecteds);
        }
        dispatch(selectPurchaseOrders([]));
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
        dispatch(selectPOChanges(newSelected));
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

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const inputChanged = (e, id, key) => {
        let value = e.target.value;

        if (e.target.value == "") {
            e.target.error = true;
            console.log("Empty field setting to zero");
            value = 0;
        }
        dispatch(modifyPurchaseOrder(id, key, parseFloat(value)));
        console.log("Row ID : ", id);
        console.log("Input Changed : ", e.target.value);
    };

    const dateChanged = (value, id, key) => {
        console.log(format(value, "dd/MMM/yyyy"));
        dispatch(modifyPurchaseOrder(id, key, format(value, "dd/MMM/yyyy")));
    };

    const showQuantityError = (isSelected, balance, quantity, id) => {
        // console.log('Select Status for id ', id, ' ', isSelected);
        // console.log('rowid : ', row.INDENT_DT_ID, ' : ', typeof (parseFloat(quantity)), ' : ', (parseFloat(row.RATE)));
        if (isSelected) {
            if (parseFloat(balance) < parseFloat(quantity) || parseFloat(quantity) < 0) {
                return true;
            }
        }
        return false;
    };

    const showRateError = (isItemSelected, rate) => {
        // console.log('rowid : ', row.INDENT_DT_ID, ' : ', typeof (parseFloat(row.RATE)), ' : ', (parseFloat(row.RATE)));
        if (isItemSelected) {
            if (parseFloat(rate) <= 0) {
                return true;
            }
        }
        return false;
    };

    const getSelectedLength = () => {
        const recordIds = rows.map(record => record.id);
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
                            {stableSort(rows, getSorting(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                disabled={!row.isSelectable}
                                                onClick={event => handleClick(event, row.id)}
                                                // onClick={event => handleClick(event, row.INDENT_DT_ID, isItemSelected)}

                                                inputProps={{ "aria-labelledby": labelId }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.label}
                                        </TableCell>
                                        <TableCell align="center">{row.value}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 52 * emptyRows }}>
                                    <TableCell colSpan={3} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
            </Paper>
        </div>
    );
}
