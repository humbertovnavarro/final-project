import React from 'react';
import Avatar from './avatar';
import AppContext from '../app-context';
class Header extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    switch (e.target.id) {
      case 'login':
        this.props.toggleModal('sign-up');
        break;
    }
  }

  render() {
    const button = (
      <>
      <label htmlFor="login">Login</label>
      <button onClick={this.handleClick} id="login" className="material-icons">person_outline</button>
      </>
    );
    const user = (
      <>
      <label htmlFor="user">{this.context.user.userName}</label>
      <button id="user">
        <Avatar channelId={this.context.user.userId}></Avatar>
      </button>
      </>

    );
    return (
      <div className="header">
        <div className="container">
          <div className="row center">
            <div className="column-half">
              <div className="row baseline">
                <h1><a href="#home">{'kamaii.tv'}</a></h1>
                <h2><a href="#browse">{'Browse'}</a></h2>
              </div>
            </div>
            <div className="column-half">
              <div className="row reverse center">
                {this.context.user.userName ? user : button}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Header;
