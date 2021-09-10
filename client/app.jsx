import React from 'react';
import parseRoute from './parse-route';
import AppContext from './app-context';
import Channel from './pages/channel';
import Browse from './pages/browse';
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
      const route = parseRoute(window.location.hash);
      this.setState({
        route: route
      });
    });
  }

  renderContent() {
    const { path } = this.state.route;
    switch (path) {
      case 'channel':
        return <Channel />;
      case 'browse':
        return <Browse />
      default:
        return <Channel />;
    }
  }

  render() {
    const contextValue = {
      route: this.state.route
    };
    return(
      <AppContext.Provider value={contextValue}>
        <Header />
        <div id="content">
          {this.renderContent()}
        </div>
      </AppContext.Provider>
      );
  }
}
