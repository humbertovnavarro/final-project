import React from "react";
import Avatar from "../components/avatar";
import AppContext from "../app-context";
import UserSettings from "../components/user-settings";
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
  }
  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="row">
            <div className="column-half">
              <UserSettings/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
