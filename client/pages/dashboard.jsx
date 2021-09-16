import React from "react";
import Avatar from "../components/avatar";
import AppContext from "../app-context";
class Dashboard extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      passwordConfirm: "",
      email: "",
      streamKey: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.fetchStreamKey();
    this.fetchUserData();
  }
  fetchUserData() {
    const req = {
      method: "GET",
      headers: {
        "x-access-token": this.context.user.token
      }
    }
    fetch('/api/user', req)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          username: data.userName,
          email: data.email,
          password: data.password
        });
      });
  }
  fetchStreamKey() {
    let streamKey;
    if (localStorage.getItem("stream-key") !== null) {
      streamKey = localStorage.getItem("stream-key") || null;
    }
    if (streamKey && streamKey !== "undefined") {
      console.log("stream key is: ", streamKey);
      this.setState({
        streamKey: streamKey
      });
    } else {
      const req = {
        method: "GET",
        headers: {
          "x-access-token": this.context.user.token
        }
      }
      fetch('/api/genkey', req)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
          }
          const streamKey = `${this.context.user.userId}?k=${data.streamKey}`;
          localStorage.setItem("stream-key", streamKey);
          this.setState({ streamKey: streamKey });
        });
    }
  }
  handleChange(e) {
    const state = {};
    state[e.target.id] = e.target.value;
    this.setState(state);
  }
  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="user-settings">
            <h1>User Settings</h1>
            <div className="row">
              <Avatar />
              <button>Upload Profile Picture</button>
            </div>
            <div className="row">
              <form onSubmit={this.onSubmit}>
                <label>
                  <label htmlFor="username">Username</label>
                  <input onChange={this.handleChange} value={this.state.username} id="username" />
                  <label htmlFor="password">Password</label>
                  <input onChange={this.handleChange} value={this.state.password} id="password" />
                  <label htmlFor="passwordConfirm" >Confirm Password</label>
                  <input onChange={this.handleChange} value={this.state.passwordConfirm} id="passwordConfirm" />
                  <label htmlFor="email">Email</label>
                  <input onChange={this.handleChange} value={this.state.email} id="email" />
                  <label htmlFor="streamKey">Stream Key</label>
                  <input onChange={this.handleChange} value={this.state.streamKey} id="streamKey" />
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
