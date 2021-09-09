import React from 'react';
import parseRoute from './parse-route';
import AppContext from './app-context';
import Channel from './pages/channel';
import Header from './components/header';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  renderContent() {
    const { path } = this.state.route
    switch (path) {
      case 'channel':
        return <Channel />;
      default:
        return <Channel />;
    }
  }

  render() {
    const contextValue = {
      route: this.state.route,
      path: this.state.route.path,
      params: this.state.route.params
    };
    return(
      <AppContext.Provider value={contextValue}>
        <Header />
        {this.renderContent()}
      </AppContext.Provider>
      );
  }
}
