import React from 'react';
class SignUp extends React.Component {
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
    const identity = e.target.username.value;
    const password = e.target.password.value;
    const email = e.target.email.value;
    const method = document.activeElement.name;
    if (method === 'signup') {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: identity, password: password, email: email })
      };
      fetch('/api/register', req)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.setState({ error: data.error });
            return;
          }
          for (const key in data) {
            localStorage.setItem(key, data[key]);
          }
          this.props.setUser(data.token, data.userId);
        }).catch(err => { console.error(err); });
    }
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
            <p className="text-center">Signup</p>
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
            name="username"/>
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
             name="password"/>
          </div>
          <div>
            <label htmlFor="email">Email </label>
            <input type="email" id="email" name="email" placeholder="required"></input>
          </div>
          <div className="row justify-center">
            <input id="signup" name="signup" type="submit" value="Sign Up" className="custom-button"/>
          </div>
        </form>
      </div>
    </div>
    );
  }
}
export default SignUp;
