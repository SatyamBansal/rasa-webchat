import React, { Component } from 'react';


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
    isDialogOpen: false
  }

  openDialog() {
    this.setState({
      isDialogOpen: true
    });
  }

  closeDialog() {
    this.setState({ isDialogOpen: false });
  }

  discardPO() {
    this.closeDialog();
  }


  savePO() {
    this.closeDialog();
  }

  handleClose() {
    console.log('Dialog is Closed');
  }

  saveChanges() {
    console.log('Saving Changes in Dialog');
  }
  render() {
    const isopen = true;
    const isLast = true;
    return (
      <div>
        {isLast && (
          <div>
            <Button variant="contained" color="primary" onClick={() => this.openDialog()}>
              Fill PO
            </Button>

            <Dialog open={this.state.isDialogOpen}>
              <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
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
                <Button autoFocus onClick={this.saveChanges} color="primary">
                  Save changes
                </Button>
              </DialogActions>
            </Dialog>


          </div>

        )}
      </div>
    );
  }
}

export default Popup;
