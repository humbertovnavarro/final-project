import React from "react";
import { io } from "socket.io-client";
import AppContext from "../app-context";
import Message from './message'
class Chat extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userMessage: '',
      error: ''
    };
    this.handleInput = this.handleInput.bind(this);
    this.user = this.state.user;
  }
  connnect() {
    const params = {
      auth: {
        token: this.props.user.token || 'anonymous',
        room: this.props.room
      }
    }
    this.socket = io('', params);
    this.socket.on('message', (message) => {
      const messages = this.state.messages;
      messages.push(message);
      this.setState({ messages });
      this.bottom.scrollIntoView();
    });
    this.socket.on('error', (message) => {
      console.error(message);
    });
  }
  componentDidUpdate(prevProps) {
    if(prevProps.user.token !== this.props.user.token) {
      this.connnect();
    }
  }
  componentDidMount() {
    this.bottom = document.getElementById("bottom");
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey) {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if(this.state.userMessage.trim().length === 0) {
          return;
        }
        this.socket.emit('message', this.state.userMessage);
        this.setState({userMessage: ''});
      }
    });
    fetch(`/api/channel/${this.props.room}/messages`)
      .then(res => res.json())
      .then(messages => {
        this.setState({ messages }, () => this.bottom.scrollIntoView());
        this.connnect();
      });
  }
  handleInput(e) {
    if(e.target.value.length >= 500) {
      this.setState({error: 'Message must be less than 500 characters.'});
    } else {
      this.setState({error: ''});
    }
    this.setState({userMessage: e.target.value});
  }
  render() {
    const messages = this.state.messages.map((message) => {
      return (
        <Message message={message} key={message.messageId}/>
      );
    });
    return (
      <div className="chat-container">
        <div className="chat">
          <div className="message-container">
            {messages}
            <div id="bottom"></div>
          </div>
        </div>
        <p className="red">{this.state.error}</p>
        <textarea onInput={this.handleInput} value={this.state.userMessage}></textarea>
      </div>
    );
  }
}
export default Chat;
