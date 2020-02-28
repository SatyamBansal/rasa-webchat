import React, { PureComponent } from "react";
import { PROP_TYPES } from "constants";

import { withStyles } from "@material-ui/core/styles";
import SaveDialogComponent from "../GenericComponents/Dialogs/SaveDialogComponent";
import "./styles.scss";

const styles = theme => ({
    dialogStyles: {}
});

class ImgReply extends PureComponent {
    state = { openDialog: false };

    onImageClick = () => {
        this.setState({ openDialog: true });
    };
    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };
    render() {
        const {
            params: { images: { dims = {} } = {} }
        } = this.props;
        const { width, height } = dims;
        // Convert map to object
        const message = [...this.props.message.entries()].reduce(
            (acc, e) => ((acc[e[0]] = e[1]), acc),
            {}
        );
        const { title, image } = message;
        const img = new Image();
        img.src = image;

        const b = true;
        return (
            <div className="image">
                <SaveDialogComponent
                    showDialog={this.state.openDialog}
                    classes={{
                        paper: this.props.classes.dialogStyles
                    }}
                    onDialogClose={this.handleDialogClose}
                >
                    <b className="image-title">{title}</b>
                    <div
                        className="image-details"
                        style={{ width: img.width, height: img.height, maxHeight: "90%" }}
                    >
                        <img className="image-frame" src={image} />
                    </div>
                </SaveDialogComponent>
                <b className="image-title">{title}</b>
                <div
                    onClick={this.onImageClick}
                    className="image-details"
                    style={{ width, height }}
                >
                    <img className="image-frame" src={image} />
                </div>
            </div>
        );
    }
}

ImgReply.propTypes = {
    message: PROP_TYPES.IMGREPLY
};

ImgReply.defaultProps = {
    params: {}
};

export default withStyles(styles)(ImgReply);
