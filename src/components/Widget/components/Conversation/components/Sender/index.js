import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import send from "assets/send_button.svg";
import "./style.scss";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";

import { loadCSS } from "fg-loadcss";
import IconButton from "@material-ui/core/IconButton";
import { withTheme } from "@material-ui/core/styles";

class Sender extends React.Component {
    componentDidMount() {
        loadCSS(
            "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
            document.querySelector("#font-awesome-css")
        );
    }
    componentDidUpdate() {
        console.log("user input element : ", this.nameInput);
        if (!this.props.disabledInput) {
            console.log("setting focus to userinput");
            this.nameInput.focus();
        }
    }

    render() {
        const { sendMessage, inputTextFieldHint, disabledInput } = this.props;
        console.log("Disabled Input : ", disabledInput);
        return (
            // <form className="sender" onSubmit={sendMessage}>
            //   <input ref={(input) => { this.nameInput = input; }} type="text" className="new-message" name="message" placeholder={inputTextFieldHint} disabled={disabledInput} autoComplete="off" />
            //   <button type="submit" className="send">
            //     <img src={send} className="send-icon" alt="send" />
            //   </button>
            // </form>

            <Paper
                className="sender"
                style={{
                    width: "95%",
                    height: "48px",
                    borderRadius: "64px",
                    margin: "0 auto",
                    marginBottom: "10px"
                }}
            >
                <form onSubmit={sendMessage}>
                    <div style={{ width: "100%", height: "100%" }}>
                        <Box display="flex" alignItems="center" width="100%" height="100%">
                            <Box height="48px" flexGrow={1} display="flex" alignItems="center">
                                <input
                                    ref={input => {
                                        this.nameInput = input;
                                    }}
                                    type="text"
                                    className="new-message"
                                    name="message"
                                    disabled={disabledInput}
                                    placeholder={inputTextFieldHint}
                                    autoComplete="off"
                                />
                            </Box>
                            <div className="sendButton">
                                <Box pr={1}>
                                    <IconButton type="submit" disabled={disabledInput}>
                                        <Icon
                                            style={{
                                                fontSize: 24,
                                                color: this.props.theme.palette.primary.main
                                            }}
                                            className="fas fa-paper-plane"
                                        />
                                    </IconButton>
                                </Box>
                            </div>
                        </Box>
                    </div>
                </form>
            </Paper>
        );
    }
}
// const Sender = ({ sendMessage, inputTextFieldHint, disabledInput }) =>
// {
//   console.log('Disabled Input : ', disabledInput);
//   return (
//     <form className="sender" onSubmit={sendMessage}>
//       <input type="text" className="new-message" name="message" placeholder={inputTextFieldHint} disabled={disabledInput} autoFocus autoComplete="off" />
//       <button type="submit" className="send">
//         <img src={send} className="send-icon" alt="send" />
//       </button>
//     </form>
//   );
// };

const mapStateToProps = state => ({
    inputTextFieldHint: state.behavior.get("inputTextFieldHint")
});

Sender.propTypes = {
    sendMessage: PropTypes.func,
    inputTextFieldHint: PropTypes.string,
    disabledInput: PropTypes.bool
};

export default connect(mapStateToProps)(withTheme(Sender));
