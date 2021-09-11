import React from "react";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      email: '',
      image: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  handleChange(e) {
    const state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }
  render() {
    return (
    <div className="modal-container">
      <div className="modal">
        <form onSubmit={this.handleSubmit}>
          <div>
            <p className="text-center">{this.state.error}</p>
          </div>
          <div>
            {this.state.image ? <img src={this.state.image} /> : null}
          </div>
          <div>
            <label htmlFor="username">Username Or Email</label>
            <input id="username" name="username"></input>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input onChange={this.handleChange} value={this.state.password} id="password" name="password"></input>
          </div>
          <div className="row space-between">
            <button className="custom-button">Sign Up</button>
            <button className="custom-button">Login</button>
          </div>
        </form>
      </div>
    </div>
    )
  }
}
export default Login;
