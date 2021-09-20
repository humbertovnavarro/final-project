import React from 'react';
class Avatar extends React.Component {
  render() {
    const source = `/avatars/${this.props.channelId}.webp?t=${Date.now()}`
    return <div className={`avatar ${this.props.isLive ? 'live' : ''}`}>
      <img src={source} onError={this.handleError}/>
    </div>
  }
}
export default Avatar;
