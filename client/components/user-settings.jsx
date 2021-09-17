import Avatar from "./avatar";
import React from "react";
import AppContext from "../app-context";
class UserSettings extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      color: '#000000',
      userName: "",
      password: "",
      passwordConfirm: "",
      email: "",
      streamKey: "",
      streamKeyHidden: true
    }
  }
  componentDidMount() {
    const req = {
      method: "GET",
      headers: {
        "X-Access-Token": this.context.user.token
      }
    }
    fetch("/api/user", req)
    .then(res => res.json())
    .then(data => {
      const newState = data;
      if(!data.streamKey) {
        newState.streamKey = '';
      }
      this.setState(data);
    });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  updateField(field, value) {
    const payload = {
      [field]: value
    };
    const req = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "X-Access-Token": this.context.user.token
      },
      body: JSON.stringify(payload)
    }
    fetch(`/api/user/${field}`, req)
    .catch(err => {
      alert('An unkown error occured.');
      console.error(err);
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const action = e.target.dataset.action;
    switch(action) {
      case "color":
        this.updateField('color', this.state.color);
        alert('Color updated.');
        break;
      case "userName":
        break;
      case "email":
        break;
      case "password":
        break;
      case "streamKey":
        const subAction = document.activeElement.dataset.action;
        if(subAction !== 'regen') {
          navigator.clipboard.writeText(this.state.streamKey)
          .then( () => {
            alert('Stream key copied to clipboard.');
          })
          .catch(err => {
            console.error("Could not copy to clipboard");
          });
          break;
        }
        const req = {
          method: "GET",
          headers: {
            "X-Access-Token": this.context.user.token
          },
        }
        fetch("/api/genkey", req)
          .then(res => res.json())
          .then(data => {
            alert('Stream key generated.');
            this.setState({
              streamKey: data.streamKey
            });
          });
        break;
    }
  }
  render() {
    return (
      <div className="user-settings">
        <h1>User Settings</h1>
        <div className="row item-center">
          <Avatar />
          <button>Upload</button>
        </div>
        <form data-action="color" id="color-form" onSubmit={this.handleSubmit}>
          <label htmlFor="color">Chat Color</label>
          <div className="row">
            <input type="color" name="color" id="color" onChange={this.handleChange} value={this.state.color} />
            <input type="submit" value="Update" />
          </div>
        </form>
        <form data-action="userName" onSubmit={this.handleSubmit}>
          <label htmlFor="userName">Username</label>
          <div className="row">
            <input name="userName" onChange={this.handleChange} value={this.state.userName} />
            <input type="submit" value="Update" />
          </div>
        </form>
        <form data-action="email" onSubmit={this.handleSubmit}>
          <label htmlFor="email">Email</label>
          <div className="row">
            <input name="email" onChange={this.handleChange} value={this.state.email}/>
            <input type="submit" value="Update" />
          </div>
        </form>
        <form data-action="password" onSubmit={this.handleSubmit}>
          <label htmlFor="password">Password</label>
          <div className="row">
            <input type="password" name="password" onChange={this.handleChange} value={this.state.password} />
          </div>
          <label htmlFor="password">Confirm Password</label>
          <div className="row">
            <input type="password" name="passwordConfirm" onChange={this.handleChange} value={this.state.passwordConfirm}/>
            <input type="submit" value="Update" />
          </div>
        </form>
        <form data-action="streamKey" onSubmit={this.handleSubmit}>
          <label htmlFor="password">Stream Key</label>
          <div className="row">
            <button data-action="copy" className="full-width" onClick={this.handleClick}>
              <input name="streamKey" onChange={this.handleChange} value={this.state.streamKey} />
            </button>
            <input data-action="regen" type="submit" value="Generate" />
          </div>
        </form>
      </div>
    )
  }
}
export default UserSettings;
