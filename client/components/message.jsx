import React from "react";
import luminance from "../lib/luminance";
class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
      "`": '&grave'
    };
    const reg = /[&<>"'/]/ig;
    this.state.sanitized = this.props.message.content.replace(reg, (match) => (map[match]));
    //Replace asterisk with strong tag
    this.state.sanitized = this.state.sanitized.replaceAll(/\*([^*]+?)\*/g, "<b>$1<\/b>");
    //Replace urls with anchor tag
    this.state.sanitized = this.state.sanitized.replaceAll(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, "<a src=$1>$1<\/a>");
  }
  render() {
    const luminanceValue = luminance(this.props.message.color);
    const luminanceClass = luminanceValue > 100.00 ? "message-dark" : "message-light";
    return(
      <div className={`message ${luminanceClass}`}>
        <span style={{color: this.props.message.color}}
        className="message-username">
          {this.props.message.userName + ' : '}
        </span>
        <span className="message-content"
         dangerouslySetInnerHTML={{__html: this.state.sanitized}}>
        </span>
      </div>
    )
  }
}
export default Message;
