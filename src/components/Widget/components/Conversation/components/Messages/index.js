import React, { Component } from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import CardMedia from "@material-ui/core/CardMedia";

import CardContent from "@material-ui/core/CardContent";

import { MESSAGES_TYPES } from "constants";
import {
    Video,
    Image,
    Message,
    Snippet,
    QuickReply,
    Popup,
    IndentPopup,
    OtherPOCharges,
    IndentTypeB,
    ConfirmationPopup
} from "messagesComponents";

// import IndentPopup from './components/IndentPopup';
// import Popup from './components/Popup';
import Dialog from "@material-ui/core/Dialog";

import "./styles.scss";
// import { IndentPopup } from './components/IndentPopup';

const isToday = date => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

// const Indent = () => <div>Indent Popup here</div>;
const formatDate = date => {
    const dateToFormat = new Date(date);
    const showDate = isToday(dateToFormat) ? "" : `${dateToFormat.toLocaleDateString()} `;
    return `${showDate}${dateToFormat.toLocaleTimeString("en-US", { timeStyle: "short" })}`;
};

const scrollToBottom = () => {
    const messagesDiv = document.getElementById("messages");
    if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
};

class Messages extends Component {
    componentDidMount() {
        scrollToBottom();
    }

    componentDidUpdate() {
        scrollToBottom();
    }

    getComponentToRender = (message, index, isLast) => {
        const { params } = this.props;
        const ComponentToRender = (() => {
            switch (message.get("type")) {
                case MESSAGES_TYPES.TEXT: {
                    return Message;
                }
                case MESSAGES_TYPES.SNIPPET.LINK: {
                    return Snippet;
                }
                case MESSAGES_TYPES.VIDREPLY.VIDEO: {
                    return Video;
                }
                case MESSAGES_TYPES.IMGREPLY.IMAGE: {
                    return Image;
                }
                case MESSAGES_TYPES.QUICK_REPLY: {
                    return QuickReply;
                }
                case MESSAGES_TYPES.POPUP: {
                    console.log("Displaying Popup Component");
                    return Popup;
                }
                case MESSAGES_TYPES.OTHER_PO_CHARGES: {
                    console.log("Displaying Other Charges Popup Component");
                    return OtherPOCharges;
                }
                case MESSAGES_TYPES.INDENT_POPUP: {
                    console.log("Dispalying Indent Popup");
                    return IndentPopup;
                }
                case MESSAGES_TYPES.AGAINST_SAMPLE_INDENT_POPUP: {
                    return IndentTypeB;
                }
                case MESSAGES_TYPES.PO_CONFIRMATION_POPUP: {
                    return ConfirmationPopup;
                }
                case MESSAGES_TYPES.CUSTOM_COMPONENT:
                    return connect(
                        store => ({ store }),
                        dispatch => ({ dispatch })
                    )(this.props.customComponent);
                default: {
                    console.log("No component found to display");
                    return null;
                }
            }
        })();

        const b = true;
        if (message.get("type") === "component") {
            return (
                <ComponentToRender
                    id={index}
                    {...message.get("props")}
                    isLast={isLast}
                    disabled={b}
                />
            );
        }
        return (
            <ComponentToRender
                id={index}
                params={params}
                messageObj={message}
                message={message}
                isLast={isLast}
                disabled={b}
            />
        );
    };

    card1() {
        return (
            <Card
                style={{
                    width: "320px",
                    height: "120px",
                    marginLeft: "16px",
                    marginBottom: "24px"
                }}
            >
                <Box display="flex" flexDirection="row">
                    <Box>
                        <Paper>
                            <img height="120px" src="https://i.imgur.com/KlCBsi3.jpg" />
                        </Paper>
                    </Box>
                    <Box />
                    <Box pt={1} style={{ background: "#574ae2", color: "white" }}>
                        <CardContent>
                            <Typography align="left" variant="body2" gutterBottom>
                                Hello! I am Mili, BlueKaktus Technical Support Assistant
                            </Typography>
                            <Typography align="left" variant="subtitle2">
                                How can I help you?
                            </Typography>
                        </CardContent>
                    </Box>
                </Box>
            </Card>
        );
    }
    card2() {
        return (
            <Card style={{ width: "172px", marginLeft: "96px" }}>
                <Box display="flex" flexDirection="column">
                    <Box>
                        <img
                            width="170px"
                            src="https://www.itvarnews.com/wp-content/uploads/2019/07/Amara-Avatar-01-330x330.jpg"
                        />
                    </Box>
                    <Box />
                    <CardContent>
                        <Typography
                            style={{ fontWeight: "bold", fontSize: "1.19rem" }}
                            align="center"
                            variant="subtitle2"
                            gutterBottom
                        >
                            Hello! I am Mili, the BlueKaktus Technical Support Assistant
                        </Typography>
                        <Typography align="center" variant="body2">
                            How can I help you?
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
        );
    }
    card3() {
        return (
            <Box width={"100%"} display="flex" alignItems="center">
                <Card
                    style={{
                        width: "310px",
                        height: "120px",
                        marginLeft: "12px",
                        marginBottom: "16px",
                        marginTop: "16px",
                        margin: "16px auto"
                    }}
                >
                    <Box display="flex" flexDirection="row">
                        <Box>
                            <Paper elevation={3}>
                                <img height="120px" src="https://i.imgur.com/KlCBsi3.jpg" />
                            </Paper>
                        </Box>
                        <Box />
                        <Box pt={3}>
                            <CardContent>
                                <Typography
                                    style={{ fontWeight: "bold", fontSize: "14px" }}
                                    align="left"
                                    variant="body2"
                                    gutterBottom
                                >
                                    Hello! I am Mili, BlueKaktus Technical Support Assistant
                                </Typography>
                                {/* <Typography align="left" variant="body2">
                                How can I help you?
                            </Typography> */}
                            </CardContent>
                        </Box>
                    </Box>
                </Card>
            </Box>
        );
    }

    card4() {
        return (
            <Card
                style={{
                    width: "310px",
                    height: "120px",
                    marginLeft: "16px",
                    marginBottom: "24px",
                    marginTop: "16px"
                }}
            >
                <Box display="flex" flexDirection="row">
                    <Box>
                        <img height="120px" src="https://i.imgur.com/KlCBsi3.jpg" />
                    </Box>
                    <Box />
                    <Paper elevation={5}>
                        <Box pt={1}>
                            <CardContent>
                                <Typography
                                    style={{ fontWeight: "bold" }}
                                    align="left"
                                    variant="body2"
                                    gutterBottom
                                >
                                    Hello! I am Mili, BlueKaktus Technical Support Assistant
                                </Typography>
                                <Typography align="left" variant="body2">
                                    How can I help you?
                                </Typography>
                            </CardContent>
                        </Box>
                    </Paper>
                </Box>
            </Card>
        );
    }

    render() {
        const { displayTypingIndication, profileAvatar } = this.props;

        const renderMessages = () => {
            const { messages, showMessageDate } = this.props;

            if (messages.isEmpty()) return null;

            const groups = [];
            let group = null;

            const dateRenderer =
                typeof showMessageDate === "function"
                    ? showMessageDate
                    : showMessageDate === true
                    ? formatDate
                    : null;

            const renderMessageDate = message => {
                const timestamp = message.get("timestamp");

                if (!dateRenderer || !timestamp) return null;
                const dateToRender = dateRenderer(message.get("timestamp", message));
                return dateToRender ? (
                    <span className="message-date">
                        {dateRenderer(message.get("timestamp"), message)}
                    </span>
                ) : null;
            };

            const renderMessage = (message, index) => (
                <div className={`message ${profileAvatar && "with-avatar"}`} key={index}>
                    {profileAvatar && message.get("showAvatar") && (
                        <img src={profileAvatar} className="avatar" alt="profile" />
                    )}
                    {this.getComponentToRender(message, index, index === messages.size - 1)}
                    {renderMessageDate(message)}
                </div>
            );

            messages.forEach((msg, index) => {
                if (msg.get("renderComponent") == false) {
                    return;
                }
                if (group === null || group.from !== msg.get("sender")) {
                    if (group !== null) groups.push(group);

                    group = {
                        from: msg.get("sender"),
                        messages: []
                    };
                }

                group.messages.push(renderMessage(msg, index));
            });

            groups.push(group); // finally push last group of messages.

            return groups.map((g, index) => (
                <div className={`group-message from-${g.from}`} key={`group_${index}`}>
                    {g.messages}
                </div>
            ));
        };

        return (
            <div id="messages" className="messages-container">
                {/* <div>
                    <img src={profileAvatar} className="greetAvatar" alt="profile" />
                </div> */}
                {/* {this.card1()} */}
                {/* {this.card2()} */}

                {this.card3()}

                {renderMessages()}
                {displayTypingIndication && (
                    <div className={`message typing-indication ${profileAvatar && "with-avatar"}`}>
                        {profileAvatar && (
                            <img src={profileAvatar} className="avatar" alt="profile" />
                        )}
                        <div className="response">
                            <div id="wave">
                                {(function() {
                                    return (
                                        <div>
                                            <span className="dot" />
                                            <span className="dot" />
                                            <span className="dot" />
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Messages.propTypes = {
    messages: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
    profileAvatar: PropTypes.string,
    customComponent: PropTypes.func,
    showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    displayTypingIndication: PropTypes.bool
};

Message.defaultTypes = {
    displayTypingIndication: false
};

export default connect(store => ({
    messages: store.messages,
    displayTypingIndication: store.behavior.get("messageDelayed")
}))(Messages);
