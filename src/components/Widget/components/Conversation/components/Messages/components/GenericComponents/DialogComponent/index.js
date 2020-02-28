import React from "react";

const DialogComponent = props => (
  <div>
    <Dialog open={props.open} maxWidth="lg">
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
);

export default DialogComponent;
