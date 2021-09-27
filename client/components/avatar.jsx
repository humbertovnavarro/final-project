import React from 'react';
class Avatar extends React.Component {
  render() {
    const source = `/avatar/${this.props.channelId}`;
    return <div className={`avatar ${this.props.isLive ? 'live' : ''}?time=${this.props.time || Date.now()}`}>
      <img src={source} alt="Avatar"/>
    </div>;
  }
}
export default Avatar;
