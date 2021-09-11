import React from 'react';
class Avatar extends React.Component {
  render() {
    const channelId = this.props.channelId || 'default';
    return <div className={`avatar ${this.props.isLive ? 'live' : ''}`}>
      <img src={`/avatars/${channelId}.png`} onError={this.handleError}/>
    </div>
  }
}
export default Avatar;
