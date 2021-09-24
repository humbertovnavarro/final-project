import React from 'react';
import parseRoute from './parse-route';
import AppContext from './app-context';
import Channel from './pages/channel';
import Dashboard from './pages/dashboard';
import Browse from './pages/browse';
import Header from './components/header';
import SignUp from './components/signup';
import SignIn from './components/signin';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    if (user.token) {
      const req = {
        method: 'GET',
        headers: {
          'X-Access-Token': user.token
        }
      };
      fetch('/api/user', req)
        .then(res => res.json())
        .then(data => {
          const newData = Object.assign(this.state.user, data);
          this.setUser(newData);
        }).catch(err => {
          console.error(err);
        });
    }
    this.state = {
      route: parseRoute(window.location.hash),
      user: user,
      modal: null,
      contextMenuOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.setUser = this.setUser.bind(this);
    this.logout = this.logout.bind(this);
  }

  setUser(data) {
    this.setState({
      user: data
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('stream-key');
    this.setState({
      user: {}
    });
    window.location.hash = '#browse';
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const route = parseRoute(window.location.hash);
      this.setState({
        route: route
      });
    });
    window.addEventListener('click', e => {
      const x = e.clientX;
      const y = e.clientY;
      if (e.target.matches('.modal-container')) {
        if (document.elementFromPoint(x, y) !== e.target) {
          return;
        }
        this.toggleModal(null);
      }
      if (e.target.id === 'user') {
        this.setState({ contextMenuOpen: true });
      } else {
        this.setState({ contextMenuOpen: false });
      }
    });
  }

  toggleModal(modal) {
    this.setState({
      modal: modal
    });
  }

  renderModal() {
    const modal = this.state.modal;
    switch (modal) {
      case 'sign-up':
        return <SignUp toggleModal={this.toggleModal} setUser={this.setUser} />;
      case 'sign-in':
        return <SignIn toggleModal={this.toggleModal} setUser={this.setUser} />;
      default:
        return null;
    }
  }

  renderContent() {
    const { path } = this.state.route;
    switch (path) {
      case 'channel':
        return <Channel />;
      case 'browse':
        return <Browse />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Browse />;
    }
  }

  render() {
    const contextValue = {
      route: this.state.route,
      user: this.state.user,
      logout: this.logout
    };
    const modal = this.renderModal();
    return (
      <>
        {modal}
        <AppContext.Provider value={contextValue}>
          <Header contextMenuOpen={this.state.contextMenuOpen} toggleModal={this.toggleModal} />
          <div className="page">
            <div id="content">
              {this.renderContent()}
            </div>
          </div>
        </AppContext.Provider>
      </>
    );
  }
}
