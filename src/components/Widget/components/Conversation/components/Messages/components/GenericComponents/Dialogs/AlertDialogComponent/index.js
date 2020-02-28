import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";

const AlertDialogComponent = props => {
    const { denyText, affirmText, open, dialogContentText, dialogTitle, onAffirm, onDeny } = props;

    return (
        <div>
            <Dialog
                open={open}
                disableBackdropClick
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogContentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDeny} color="primary">
                        {denyText}
                    </Button>
                    <Button onClick={onAffirm} color="primary" autoFocus>
                        {affirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

AlertDialogComponent.propTypes = {
    denyText: PropTypes.string,
    affirmText: PropTypes.string,
    open: PropTypes.bool,
    dialogContentText: PropTypes.string,
    dialogTitle: PropTypes.string,
    onAffirm: PropTypes.func,
    onDeny: PropTypes.func
};

AlertDialogComponent.defaultProps = {
    denyText: "Disagree",
    affirmText: "Agree",
    dialogTitle: "Discard Changes ?",
    dialogContentText: "Discarding will delete currrent progress"
};
export default AlertDialogComponent;
