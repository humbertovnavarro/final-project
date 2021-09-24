import React from 'react';
class SignIn extends React.Component {
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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.toggleModal('sign-up');
  }

  handleSubmit(e) {
    e.preventDefault();
    const identity = e.target.username.value;
    const password = e.target.password.value;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName: identity, password: password })
    };
    fetch('/api/login', req)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error });
          return;
        }
        localStorage.setItem('user', JSON.stringify(data));
        this.props.setUser(data);
        this.props.toggleModal(null);
      }).catch(err => { console.error(err); });
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
              <p className="text-center">Sign In</p>
            </div>
            <div>
              <p className="red text-center">{this.state.error}</p>
            </div>
            <div>
              {this.state.image ? <img src={this.state.image} /> : null}
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <input
                autoComplete="username"
                id="username"
                placeholder="required"
                name="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                autoComplete="current-password"
                type="password"
                onChange={this.handleChange}
                value={this.state.password}
                id="password"
                placeholder="required"
                name="password" />
            </div>
            <div className="row justify-center">
              <input id="sign-in" type="submit" value="Sign In" className="custom-button" />
            </div>
            <div className="row justify-center">
              <button id="sign-up-link" className="custom-button" onClick={this.handleClick}>Sign Up Instead</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default SignIn;
