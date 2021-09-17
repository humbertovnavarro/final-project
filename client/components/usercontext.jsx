import React from "react";
class UserContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isAuthenticated: false,
      isLoading: true,
      error: null,
    };
  }
  render() {
    return (
      <div className="user-context-menu">
        <a>User Dashboard</a>
        <a>My Channel</a>
      </div>
    );
  }
}
export default UserContextMenu;
