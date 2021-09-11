import React from 'react';
import Login from './login';
class Header extends React.Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    switch(e.target.id){
      case 'login':
        this.props.toggleLogin();
    }
  }
  render(){
    return (
      <div className="header">
        <div className="row baseline">
          <div className="column-half">
            <div className="row baseline">
              <h1><a href="#home">{'kamaii.tv'}</a></h1>
              <h2><a href="#browse">{'Browse'}</a></h2>
            </div>
          </div>
          <div className="column-half">
            <div className="row reverse center">
              <label htmlFor="login">Login</label>
              <button onClick={this.handleClick} id="login" className="material-icons">person_outline</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Header;
