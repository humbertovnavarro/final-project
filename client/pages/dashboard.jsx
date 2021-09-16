import React from "react";
import Avatar from "../components/avatar";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {

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
                <input id="username" />
                <label htmlFor="password">Password</label>
                <input id="password" />
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input id="passwordConfirm" />
                <label htmlFor="email">Email</label>
                <input id="email" />
                <label htmlFor="streamKey">Stream Key</label>
                <input id="streamKey" />
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
