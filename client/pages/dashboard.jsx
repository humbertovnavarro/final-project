import React from "react";
import UserSettings from "../components/user-settings";

class Dashboard extends React.Component {
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
