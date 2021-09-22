import React from 'react';
class Avatar extends React.Component {
  render() {
    const source = `/avatar/${this.props.channelId}`
    return <div className={`avatar ${this.props.isLive ? 'live' : ''}`}>
      <img src={source} alt="USR"/>
    </div>
  }
}
export default Avatar;
