import React from "react";
import { io } from "socket.io-client";
import AppContext from "../app-context";
class Chat extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userMessage: ''
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey || this.state.userMessage.length === 0) {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        this.socket.emit('message', this.state.userMessage);
        this.setState({userMessage: ''});
      }
    });
    const params = {
      auth: {
        token: this.context.user.token,
        room: this.props.room
      }
    }
    fetch(`/api/channel/${this.props.room}/messages`)
      .then(res => res.json())
      .then(messages => {
        this.setState({ messages });
        this.socket = io('', params);
        this.socket.on('message', (message) => {
          const messages = this.state.messages;
          messages.push(message);
          this.setState({ messages });
        });
      });
  }
  handleClick(e) {
    if(this.context.user.token) {
      return;
    } else {
      this.props.toggleModal('sign-up');
    }
  }
  handleInput(e) {
    this.setState({userMessage: e.target.value});
  }
  render() {
    const messages = this.state.messages.map((message) => {
      return (
        <div className="message" key={message.messageId}>
          <span className="message-username">{message.userName}</span>
          <span className="message-content">{message.content}</span>
        </div>
      );
    });
    return (
      <div className="chat-container">
        <div className="chat">
          <div className="message-container">
            {messages}
          </div>
        </div>
        <textarea onClick={this.handleClick} onInput={this.handleInput} value={this.state.userMessage}></textarea>
      </div>
    );
  }
}
export default Chat;
