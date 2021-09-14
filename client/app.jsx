import React from 'react';
import parseRoute from './parse-route';
import AppContext from './app-context';
import Channel from './pages/channel';
import Browse from './pages/browse';
import Header from './components/header';
import SignUp from './components/signup';
import SignIn from './components/signin';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: {},
      modal: null
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setUser(data) {
    this.setState({
      user: data
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
        this.toggleModal(null);
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
    switch(modal) {
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
      default:
        return <Browse />;
    }
  }

  render() {
    const contextValue = {
      route: this.state.route,
      user: this.state.user
    };
    const modal = this.renderModal();
    return (
      <>
      {modal}
      <AppContext.Provider value={contextValue}>
        <Header toggleModal={this.toggleModal} />
        <div id="content">
          {this.renderContent()}
        </div>
      </AppContext.Provider>
      </>
    );
  }
}
