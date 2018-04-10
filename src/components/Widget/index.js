/* eslint-disable no-undef */
import React, { Component } from 'react';
import { isSnippet, isQR, isText } from './msgProcessor';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleChat, addUserMessage, addResponseMessage, addLinkSnippet, addQuickReply } from 'actions';
import io from 'socket.io-client';
import WidgetLayout from './layout';


class Widget extends Component {

  componentDidMount() {
    this.socket = io(this.props.socketUrl);
    this.socket.on('connect', () => {
      console.log(`connect:${this.socket.id}`);
    });


    this.socket.on('bot_uttered', (botUttered) => {
      this.dispatchMessage(botUttered);
    });

    this.socket.on('connect_error', (error) => {
      // console.log(error);
    });

    this.socket.on('error', (error) => {
      // console.log(error);
    });

    this.socket.on('disconnect', (reason) => {
      // console.log(reason);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullScreenMode) {
      this.props.dispatch(toggleChat());
    }
  }

  dispatchMessage(message) {
    if (Object.keys(message).length === 0) {
      return;
    }
    if (isText(message)) {
      this.props.dispatch(addResponseMessage(message.text));
    } else if (isQR(message)) {
      this.props.dispatch(addQuickReply({
        text: 'text1',
        quick_replies: [
          { title: 'Quick Reply 1', payload: 'Here is my first answer' },
          { title: 'Quick Reply 2', payload: 'Here is another possible answer' }
        ]
      }));
    } else if (isSnippet(message)) {
      const element = message.attachment.payload.elements[0];
      this.props.dispatch(addLinkSnippet({
        title: element.title,
        content: element.buttons[0].title,
        link: element.buttons[0].url,
        target: '_blank'
      }));
    }
  }

  toggleConversation = () => {
    this.props.dispatch(toggleChat());
  };

  handleMessageSubmit = (event) => {
    event.preventDefault();
    const userUttered = event.target.message.value;
    if (userUttered) {
      this.props.dispatch(addUserMessage(userUttered));
      this.socket.emit('user_uttered', userUttered);
    }
    event.target.message.value = '';
  }

  render() {
    return (
      <WidgetLayout
        onToggleConversation={this.toggleConversation}
        onSendMessage={this.handleMessageSubmit}
        title={this.props.title}
        subtitle={this.props.subtitle}
        profileAvatar={this.props.profileAvatar}
        showCloseButton={this.props.showCloseButton}
        fullScreenMode={this.props.fullScreenMode}
        badge={this.props.badge}
      />
    );
  }
}

Widget.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  socketUrl: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number
};

export default connect()(Widget);
