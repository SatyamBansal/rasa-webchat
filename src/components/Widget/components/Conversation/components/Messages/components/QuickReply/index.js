import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { PROP_TYPES } from "constants";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
// import {
//     ThemeProvider,
//     MessageButton,
//     MessageButtons,
//     MessageText,
//     Message
// } from "@livechat/ui-kit";
import {
    addUserMessage,
    emitUserMessage,
    setQuickReply,
    toggleInputDisabled,
    changeInputFieldHint
} from "actions";
import Message from "../Message/index";

import "./styles.scss";
import { UI_MESSAGES } from "../../../../../../../../constants";

class QuickReply extends PureComponent {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        const { message, getChosenReply, inputState, id } = this.props;

        const hint = message.get("hint");
        const chosenReply = getChosenReply(id);
        if (!chosenReply && !inputState) {
            // this.props.toggleInputDisabled();
            // this.props.changeInputFieldHint(hint);
        }
    }

    handleClick(reply) {
        this.props.toggleInputDisabled();
        this.props.changeInputFieldHint(UI_MESSAGES.INPUT_HINT);
        const { chooseReply, id } = this.props;

        const payload = reply.payload;
        const title = reply.title;
        chooseReply(payload, title, id);
        // this.props.toggleInputDisabled();
        // this.props.changeInputFieldHint('Please Select a input');
    }

    render() {
        const { message, getChosenReply, isLast, id } = this.props;

        const chosenReply = getChosenReply(id);

        if (!chosenReply && this.props.inputState == false) {
            console.log("I m here");
            this.props.toggleInputDisabled();
            this.props.changeInputFieldHint("Select one Above ...");
        }
        if (chosenReply) {
            // console.log('Option Selected');
            // if (this.props.inputState) {
            //   this.props.toggleInputDisabled();
            //   console.log('Option Selected, Changing placeholder');
            //   this.props.changeInputFieldHint('Enter afasdfasdf ...');
            // }

            return <Message message={message} />;
        }

        // return (
        //     <div>
        //         <ThemeProvider>
        //             <Message>
        //                 <MessageText>Select a Supplier</MessageText>
        //                 <MessageButtons>
        //                     <MessageButton primary label="Confirm" />
        //                     <MessageButton label="Cancel" />
        //                 </MessageButtons>
        //             </Message>
        //         </ThemeProvider>
        //     </div>
        // );
        return (
            <div className="quickReplies-container">
                <Message message={message} />
                {isLast && (
                    <div className="pb-buttonList__container">
                        {message.get("quick_replies").map((reply, index) => {
                            if (reply.type === "web_url") {
                                return (
                                    <a
                                        key={index}
                                        href={reply.payload}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={"reply"}
                                    >
                                        {reply.title}
                                    </a>
                                );
                            }
                            return (
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                <button
                                    key={index}
                                    // className={'reply'}
                                    onClick={() => this.handleClick(reply)}
                                >
                                    {reply.title}
                                </button>
                            );
                        })}
                    </div>
                )}
                <Message message={message} />

                {isLast && (
                    <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                    >
                        {/* <Button variant="contained" color="primary" disableElevation>
          {message.get("text")}
      </Button> */}
                        {message.get("quick_replies").map((reply, index) => {
                            if (reply.type === "web_url") {
                                return (
                                    <a
                                        key={index}
                                        href={reply.payload}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={"reply"}
                                    >
                                        {reply.title}
                                    </a>
                                );
                            }
                            return (
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                <Button
                                    key={index}
                                    // className={'reply'}
                                    onClick={() => this.handleClick(reply)}
                                >
                                    {reply.title}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    getChosenReply: id => state.messages.get(id).get("chosenReply"),
    inputState: state.behavior.get("disabledInput")
});

const mapDispatchToProps = dispatch => ({
    toggleInputDisabled: () => dispatch(toggleInputDisabled()),
    changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
    chooseReply: (payload, title, id) => {
        dispatch(setQuickReply(id, title));
        dispatch(addUserMessage(title));
        dispatch(emitUserMessage(payload));
        // dispatch(toggleInputDisabled());
    }
});

QuickReply.propTypes = {
    getChosenReply: PropTypes.func,
    chooseReply: PropTypes.func,
    id: PropTypes.number,
    isLast: PropTypes.bool,
    message: PROP_TYPES.QUICK_REPLY
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuickReply);

function bin() {
    {
        isLast && (
            <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical outlined primary button group"
            >
                {/* <Button variant="contained" color="primary" disableElevation>
          {message.get("text")}
      </Button> */}
                {message.get("quick_replies").map((reply, index) => {
                    if (reply.type === "web_url") {
                        return (
                            <a
                                key={index}
                                href={reply.payload}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={"reply"}
                            >
                                {reply.title}
                            </a>
                        );
                    }
                    return (
                        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                        <Button
                            key={index}
                            // className={'reply'}
                            onClick={() => this.handleClick(reply)}
                        >
                            {reply.title}
                        </Button>
                    );
                })}
            </ButtonGroup>
        );
    }
}
