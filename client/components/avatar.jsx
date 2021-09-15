import React from 'react';
class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state =
    {
      channelId: this.props.channelId
    };
    this.handleError = this.handleError.bind(this);
  }
  handleError() {
    this.setState({channelId: 'default'});
  }
  render() {
    const channelId = this.props.channelId || 'default';
    return <div className={`avatar ${this.props.isLive ? 'live' : ''}`}>
      <img src={`/avatars/${this.state.channelId}.png`} onError={this.handleError}/>
    </div>
  }
}
export default Avatar;
