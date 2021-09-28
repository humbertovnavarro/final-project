import React from 'react';
import AppContext from '../app-context';
class Avatar extends React.Component {
  static contextType = AppContext;
  render() {
    const source = `/avatar/${this.props.channelId}?time=${this.context.time}`;
    return <div className={`avatar ${this.props.isLive ? 'live' : ''}`}>
      <img src={source} alt="Avatar"/>
    </div>;
  }
}
export default Avatar;
