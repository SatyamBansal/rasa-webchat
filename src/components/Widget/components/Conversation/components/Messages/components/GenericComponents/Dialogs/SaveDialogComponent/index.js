import React from "react";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import PropTypes from "prop-types";

import AlertDialogComponent from "../AlertDialogComponent";
import { isWithinInterval } from "date-fns";

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        // position: "absolute",
        // right: theme.spacing(1),
        // top: theme.spacing(1),
        // color: theme.palette.grey[500]
    },
    dialogStyles: {
        maxWidth: 1800
    }
});

const useFooterStyles = makeStyles({
    root: {
        backgroundColor: "#c9cbff"
    }
});
const titleStyles = makeStyles(theme => ({
    root: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 8,
        paddingLeft: 16,
        backgroundColor: theme.palette.primary.main
    },
    iconButton: {
        color: "white"
    }
}));

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}))(MuiDialogActions);

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        backgroundImage: "linear-gradient(#e5e4ff, #c8caff)"
    }
}))(MuiDialogContent);

const DialogTitle = props => {
    const { children, onClose, ...other } = props;
    const classes = titleStyles();
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Box display="flex" alignItems="center">
                <Box flexGrow={1}>
                    <Typography variant="h6" style={{ color: "white" }}>
                        {children}
                    </Typography>
                </Box>
                <Box>
                    <IconButton aria-label="close" className={classes.iconButton} onClick={onClose}>
                        <CloseIcon styles={{ backgroundColor: "transparent !important" }} />
                    </IconButton>
                </Box>
            </Box>
        </MuiDialogTitle>
    );
};

const SaveDialogComponent = props => {
    const {
        showDialog,
        onAlertAffirmClick,
        onAlertDenyClick,
        alertDenyText,
        alertAffirmText,
        alertDialogTitle,
        alertContentText,
        onSaveButtonClick,
        saveButtonText,
        disableSaveButton,
        title,
        children
    } = props;
    const classes = useFooterStyles();

    const [showAlertDialog, toggleAlertDialog] = React.useState(false);

    const onCloseClick = () => {
        toggleAlertDialog(true);
    };

    const onAffirmClick = () => {
        toggleAlertDialog(false);
        if (onAlertAffirmClick) {
            onAlertAffirmClick();
        }
    };

    const onDenyClick = () => {
        toggleAlertDialog(false);
        if (onAlertDenyClick) {
            onAlertDenyClick();
        }
    };

    return (
        <div>
            <Dialog open={showDialog} maxWidth="lg" classes={props.classes}>
                <AlertDialogComponent
                    open={showAlertDialog}
                    onAffirm={onAffirmClick}
                    onDeny={onDenyClick}
                    denyText={alertDenyText}
                    affirmText={alertAffirmText}
                    dialogTitle={alertDialogTitle}
                    dialogContentText={alertContentText}
                />
                <DialogTitle id="customized-dialog-title" onClose={onCloseClick}>
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    {children}
                    {/* <POTable /> */}
                </DialogContent>
                <DialogActions classes={{ root: classes.root }}>
                    <Button
                        disabled={disableSaveButton}
                        autoFocus
                        variant="contained"
                        onClick={onSaveButtonClick}
                        color="primary"
                    >
                        {saveButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

SaveDialogComponent.propTypes = {
    showDialog: PropTypes.bool,
    onAlertAffirmClick: PropTypes.func,
    onAlertDenyClick: PropTypes.func,
    alertDenyText: PropTypes.string,
    alertAffirmText: PropTypes.string,
    alertDialogTitle: PropTypes.string,
    alertContentText: PropTypes.string,
    onSaveButtonClick: PropTypes.func,
    saveButtonText: PropTypes.string,
    disableSaveButton: PropTypes.bool,
    title: PropTypes.string
};

export default SaveDialogComponent;
