import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import send from 'assets/send_button.svg';
import './style.scss';


class Sender extends React.Component {


  componentDidUpdate() {
    console.log('user input element : ', this.nameInput);
    if (!this.props.disabledInput) {
      console.log('setting focus to userinput');
      this.nameInput.focus();
    }

  }

  render() {
    const { sendMessage, inputTextFieldHint, disabledInput } = this.props;
    console.log('Disabled Input : ', disabledInput);
    return (
      <form className="sender" onSubmit={sendMessage}>
        <input ref={(input) => { this.nameInput = input; }} type="text" className="new-message" name="message" placeholder={inputTextFieldHint} disabled={disabledInput} autoComplete="off" />
        <button type="submit" className="send">
          <img src={send} className="send-icon" alt="send" />
        </button>
      </form>
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
  inputTextFieldHint: state.behavior.get('inputTextFieldHint')
});

Sender.propTypes = {
  sendMessage: PropTypes.func,
  inputTextFieldHint: PropTypes.string,
  disabledInput: PropTypes.bool
};

export default connect(mapStateToProps)(Sender);
