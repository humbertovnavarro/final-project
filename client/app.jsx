import React from 'react';
import parseRoute from './parse-route';
import AppContext from './app-context';
import Channel from './pages/channel';
import Browse from './pages/browse';
import Header from './components/header';
import SignUp from './components/signup';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      jwt: null,
      loggingIn: false
    };
    this.toggleLogin = this.toggleLogin.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setUser(token) {
    this.setState({
      jwt: token,
      loggingIn: false
    });
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const route = parseRoute(window.location.hash);
      this.setState({
        route: route
      });
    });
    window.addEventListener('click', e => {
      if (e.target.matches('.modal-container')) {
        this.toggleLogin();
      }
    });
  }

  toggleLogin() {
    this.setState({
      loggingIn: !this.state.loggingIn
    });
  }

  renderModal() {
    if (this.state.loggingIn) {
      return <SignUp setUser={this.setUser} toggleLogin={this.toggleLogin}/>;
    }
    return null;
  }

  renderContent() {
    const { path } = this.state.route;
    switch (path) {
      case 'channel':
        return <Channel />;
      case 'browse':
        return <Browse />;
      default:
        return <Browse />;
    }
  }

  render() {
    const contextValue = {
      route: this.state.route
    };
    const modal = this.renderModal();
    return (
      <>
      {modal}
      <AppContext.Provider value={contextValue}>
        <Header toggleLogin={this.toggleLogin} />
        <div id="content">
          {this.renderContent()}
        </div>
      </AppContext.Provider>
      </>
    );
  }
}
