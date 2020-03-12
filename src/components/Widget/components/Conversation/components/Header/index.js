import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { abortProcess } from "actions";
import close from "assets/clear-button.svg";
import fullscreen from "assets/fullscreen_button.svg";
import fullscreenExit from "assets/fullscreen_exit_button.svg";
import { Icon } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import "./style.scss";

class Header extends React.Component {
    abortCurrentProcess = () => {
        this.props.dispatch(abortProcess());
        console.log("Aborting Process ................ ");
    };

    render() {
        const {
            title,
            subtitle,
            fullScreenMode,
            toggleFullScreen,
            toggleChat,
            showCloseButton,
            showFullScreenButton,
            connected,
            connectingText,
            closeImage,
            profileAvatar
        } = this.props;
        return (
            <div className="header-and-loading">
                <div className={`header ${subtitle ? "with-subtitle" : ""}`}>
                    {profileAvatar && (
                        <img src={profileAvatar} className="avatar" alt="chat avatar" />
                    )}
                    <div className="header-buttons">
                        <ReplayIcon onClick={this.abortCurrentProcess} />
                        {showFullScreenButton && (
                            <button className="toggle-fullscreen-button" onClick={toggleFullScreen}>
                                <img
                                    className={`toggle-fullscreen ${
                                        fullScreenMode ? "fullScreenExitImage" : "fullScreenImage"
                                    }`}
                                    src={fullScreenMode ? fullscreenExit : fullscreen}
                                    alt="toggle fullscreen"
                                />
                            </button>
                        )}
                        {showCloseButton && (
                            <button className="close-button" onClick={toggleChat}>
                                <img
                                    className={`close ${closeImage ? "" : "default"}`}
                                    src={closeImage || close}
                                    alt="close"
                                />
                            </button>
                        )}
                    </div>
                    <div className="headerInfo">
                        <h4 className={`title ${profileAvatar && "with-avatar"}`}>{title}</h4>
                        {subtitle && (
                            <span className={profileAvatar && "with-avatar"}>{subtitle}</span>
                        )}
                    </div>
                </div>
                {!connected && <span className="loading">{connectingText}</span>}
            </div>
        );
    }
}

Header.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    fullScreenMode: PropTypes.bool,
    toggleFullScreen: PropTypes.func,
    toggleChat: PropTypes.func,
    showCloseButton: PropTypes.bool,
    showFullScreenButton: PropTypes.bool,
    connected: PropTypes.bool,
    connectingText: PropTypes.string,
    closeImage: PropTypes.string,
    profileAvatar: PropTypes.string
};

const mapStateToProps = state => ({
    inputTextFieldHint: state.behavior.get("inputTextFieldHint")
});

export default connect(mapStateToProps)(Header);
