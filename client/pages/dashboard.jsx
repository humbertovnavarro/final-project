import React from "react";
import Avatar from "../components/avatar";
import AppContext from "../app-context";
import UserSettings from "../components/user-settings";
import ShakaPlayer from 'shaka-player-react';

class Dashboard extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="row">
            <div className="column-half line-right padding-right">
              <UserSettings/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
